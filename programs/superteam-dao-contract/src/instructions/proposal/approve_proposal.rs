use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount};

use crate::constants::*;
use crate::error::*;
use crate::schemas::Proposal;


#[derive(Accounts)]
pub struct ApproveProposal<'info> {
    #[account(
    mut,
    constraint = *recipient.key == proposal.recipient
    @ ErrorCodes::RecipientInvalidStateAccount
    )]
    pub proposal: Account<'info, Proposal>,

    #[account(
        mut,
        constraint = sender_token_account.owner == proposal.sender
        @ ErrorCodes::OwnerInvalidTokenAccount,
        constraint = sender_token_account.mint == proposal.spl
        @ ErrorCodes::InvalidMintAccount
    )]
    pub sender_token_account: Account<'info, TokenAccount>,

    #[account(
        mut,
        constraint = recipient_token_account.owner == proposal.recipient
        @ ErrorCodes::OwnerInvalidTokenAccount,
        constraint = recipient_token_account.mint == proposal.spl
        @ ErrorCodes::InvalidMintAccount
    )]
    pub recipient_token_account: Account<'info, TokenAccount>,

    #[account(
        mut,
        constraint = mint.key() == proposal.spl
        @ ErrorCodes::InvalidAccount,
    )]
    pub mint: Account<'info, Mint>,

    #[account(mut)]
    pub recipient: Signer<'info>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
}

pub fn handler(
    ctx: Context<ApproveProposal>,
) -> Result<()> {
    let proposal = &mut ctx.accounts.proposal;
    if proposal.status == 0 {
        proposal.status = 2;
    }

    if proposal.status == 2 {
        let balance: u64 = ctx.accounts.recipient_token_account.amount;
        require!(
            proposal.amount <= balance,
            ErrorCodes::NotEnoughSplToken
        );

        // Transfer Tokens to the Vault
        token::transfer(CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            token::Transfer {
                from: ctx.accounts.recipient_token_account.to_account_info(),
                to: ctx.accounts.sender_token_account.to_account_info(),
                authority: ctx.accounts.recipient.to_account_info(),
            },
        ), proposal.amount)?;
    }
    Ok(())
}


