use anchor_lang::prelude::*;

use crate::schemas::Proposal;
use crate::constants::*;
use crate::error::*;

#[derive(Accounts)]
#[instruction(first_txn: String, second_txn: String, third_txn: String, sender: Pubkey, receiver: Pubkey)]
pub struct CreateProposal<'info> {
    #[account(
        init,
        seeds = [PROPOSAL_SEED.as_ref(), first_txn.as_bytes(), second_txn.as_bytes(), third_txn.as_bytes(), sender.as_ref(), receiver.as_ref()],
        bump,
        space = Proposal::space(),
        payer = payer
    )]
    pub proposal: Account<'info, Proposal>,

    #[account(mut)]
    pub payer: Signer<'info>,

    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,

}

pub fn handler(
    ctx: Context<CreateProposal>,
    first_txn: String, second_txn: String, third_txn: String,
    sender: Pubkey, receiver: Pubkey, image: String, title: String, subtitle: String,
    spl: Pubkey, tags: String, amount: u64
) -> Result<()> {
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
    proposal.sender_status = 0;
    proposal.receiver_status = 0;
    proposal.transaction = format!("{}{}{}", first_txn, second_txn, third_txn);
    proposal.submitter = ctx.accounts.payer.key();

    Ok(())
}