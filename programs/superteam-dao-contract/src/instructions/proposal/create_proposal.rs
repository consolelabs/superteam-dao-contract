use anchor_lang::prelude::*;

use crate::schemas::{Identifier, Proposal};
use crate::constants::*;
use crate::error::*;

#[derive(Accounts)]
pub struct CreateProposal<'info> {
    #[account(
        init,
        seeds = [b"v1", PROPOSAL_SEED.as_ref(), payer.key().as_ref(), identifier.count.to_le_bytes().as_ref()],
        bump,
        space = Proposal::space(),
        payer = payer
    )]
    pub proposal: Account<'info, Proposal>,

    #[account(
        mut,
        seeds = [b"v1", IDENTIFIER_SEED.as_ref(), payer.key().as_ref()],
        bump,
        has_one = payer
    )]
    pub identifier: Account<'info, Identifier>,

    #[account(mut)]
    pub payer: Signer<'info>,

    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,

}

pub fn handler(
    ctx: Context<CreateProposal>,
    receiver: Pubkey, sender: Pubkey, image: String, title: String, subtitle: String,
    spl: Pubkey, tags: String, amount: u64, is_owner: bool, transaction_hash: String
) -> Result<()> {
    let identifier = &mut ctx.accounts.identifier;
    let proposal = &mut ctx.accounts.proposal;

    if image.chars().count() > MAX_LENGTH_IMAGE {
        return Err(ErrorCodes::ImageTooLong.into())
    }

    if title.chars().count() > MAX_LENGTH_TITLE {
        return Err(ErrorCodes::TitleTooLong.into())
    }

    if subtitle.chars().count() > MAX_LENGTH_SUBTITLE {
        return Err(ErrorCodes::SubtitleTooLong.into())
    }

    if tags.chars().count() > MAX_LENGTH_TAGS {
        return Err(ErrorCodes::TagsTooLong.into())
    }

    proposal.receiver = receiver;
    proposal.sender = sender;
    proposal.image = image;
    proposal.title = title;
    proposal.subtitle = subtitle;
    proposal.spl = spl;
    proposal.amount = amount;
    proposal.tags = tags;
    proposal.identifier = identifier.count;
    proposal.sender_status = 0;
    proposal.receiver_status = 0;
    proposal.transaction = transaction_hash;

    identifier.count += 1;

    Ok(())
}