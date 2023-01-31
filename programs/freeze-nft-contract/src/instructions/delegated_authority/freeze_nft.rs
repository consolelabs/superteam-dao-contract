use anchor_lang::prelude::*;
use anchor_lang::solana_program::program::invoke_signed;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Approve};
use mpl_token_metadata::{id as metadata_id, instruction::freeze_delegated_account};
use mpl_token_metadata::state::{Metadata, TokenMetadataAccount};

use crate::schemas::Authority;

use crate::constants::*;
use crate::error::*;

#[derive(Accounts)]
pub struct FreezeNft<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
        init,
        seeds = [FREEZE_SEED.as_ref(), payer.key().as_ref(), nft_mint.key().as_ref()],
        bump,
        payer = payer,
        space = Authority::space()
    )]
    pub authority: Account<'info, Authority>,

    pub nft_mint: Account<'info, Mint>,

    /// CHECK: metadata from token meta program.
    #[account(
        seeds = [META_PREFIX.as_ref(), mpl_token_metadata::id().as_ref(), nft_mint.key().as_ref()],
        seeds::program = mpl_token_metadata::id(),
        bump,
    )]
    pub nft_metadata: AccountInfo<'info>,

    #[account(mut,
        constraint = ata.mint == nft_mint.key() @ ErrorCodes::InvalidMint,
        constraint = ata.owner == payer.key() @ ErrorCodes::InvalidOwner
    )]
    pub ata: Account<'info, TokenAccount>,

    /// CHECK: edition from token meta program.
    #[account(
        seeds = [META_PREFIX.as_ref(), metadata_id().as_ref(), nft_mint.key().as_ref(), EDITION_PREFIX.as_ref()],
        seeds::program = metadata_id(),
        bump,
    )]
    pub edition: AccountInfo<'info>,

    /// CHECK: metaplex program. this will be checked in the cpi call of freeze_delegated_account
    pub metadata_program: UncheckedAccount<'info>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub rent: Sysvar<'info, Rent>,
}

pub fn handler(
    ctx: Context<FreezeNft>
) -> Result<()> {
    let metadata = Metadata::from_account_info(&ctx.accounts.nft_metadata.to_account_info())?;
    // let collection = metadata.collection.unwrap();
    // let collection_key = collection.key;
    require!(
        metadata.mint == ctx.accounts.nft_mint.key(),
        ErrorCodes::InvalidMint
    );

    let payer = ctx.accounts.payer.key();
    let nft_mint_key = ctx.accounts.nft_mint.key();
    let authority_bump = *ctx.bumps.get("authority").unwrap();
    let authority_seeds = &[
        FREEZE_SEED.as_ref(),
        payer.as_ref(),
        nft_mint_key.as_ref(),
        &[authority_bump],
    ];

    if ctx.accounts.ata.amount > 0 {
        // Approve with offer PDA
        token::approve(ctx.accounts.into_approve_context(), 1)?;

        // Freeze with offer PDA
        invoke_signed(
            &freeze_delegated_account(
                metadata_id(),
                ctx.accounts.authority.key(),
                ctx.accounts.ata.key(),
                ctx.accounts.edition.key(),
                ctx.accounts.nft_mint.key(),
            ),
            &[
                ctx.accounts.authority.to_account_info(),
                ctx.accounts.ata.to_account_info(),
                ctx.accounts.edition.to_account_info(),
                ctx.accounts.nft_mint.to_account_info(),
                ctx.accounts.metadata_program.to_account_info(),
                ctx.accounts.token_program.to_account_info(),
                ctx.accounts.system_program.to_account_info(),
            ],
            &[authority_seeds],
        )?;
    } else {
        return Err(ErrorCodes::InvalidAmount.into());
    }
    Ok(())
}

impl<'info> FreezeNft<'info> {
    fn into_approve_context(&self) -> CpiContext<'_, '_, '_, 'info, Approve<'info>> {
        let cpi_accounts = Approve {
            to: self.ata.to_account_info().clone(),
            delegate: self.authority.to_account_info().clone(),
            authority: self.payer.to_account_info().clone(),
        };
        CpiContext::new(self.token_program.to_account_info().clone(), cpi_accounts)
    }
}