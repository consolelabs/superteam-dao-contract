use anchor_lang::prelude::*;

use crate::schemas::{Identifier, Proposal};
use crate::constants::*;
use crate::error::*;

#[derive(Accounts)]
pub struct CreateProposal<'info> {
    #[account(
        init,
        seeds = [b"v1", PROPOSAL_SEED.as_ref(), sender.key().as_ref(), identifier.count.to_le_bytes().as_ref()],
        bump,
        space = Proposal::space(),
        payer = sender
    )]
    pub proposal: Account<'info, Proposal>,

    #[account(
        mut,
        seeds = [b"v1", IDENTIFIER_SEED.as_ref(), sender.key().as_ref()],
        bump,
        has_one = sender
    )]
    pub identifier: Account<'info, Identifier>,

    #[account(mut)]
    pub sender: Signer<'info>,

    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,

}

pub fn handler(
    ctx: Context<CreateProposal>,
    recipient: Pubkey, image: String, title: String, subtitle: String,
    spl: Pubkey, tags: String, amount: u64
) -> Result<()> {
    let identifier = &mut ctx.accounts.identifier;
    let proposal = &mut ctx.accounts.proposal;

    proposal.recipient = recipient;
    proposal.sender = ctx.accounts.sender.key();
    proposal.image = image;
    proposal.title = title;
    proposal.subtitle = subtitle;
    proposal.spl = spl;
    proposal.amount = amount;
    proposal.tags = tags;
    proposal.identifier = identifier.count;
    proposal.status = 0;

    identifier.count += 1;

    Ok(())
}