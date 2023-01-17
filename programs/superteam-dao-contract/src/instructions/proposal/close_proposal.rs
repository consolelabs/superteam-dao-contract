use anchor_lang::prelude::*;

use crate::constants::*;
use crate::error::*;
use crate::schemas::Proposal;


#[derive(Accounts)]
pub struct CloseProposal<'info> {
    #[account(
        mut,
        seeds = [b"v1", PROPOSAL_SEED.as_ref(), payer.key().as_ref(), proposal.identifier.to_le_bytes().as_ref()],
        bump
    )]
    pub proposal: Account<'info, Proposal>,

    #[account(mut)]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

pub fn handler(
    ctx: Context<CloseProposal>,
) -> Result<()> {
    let proposal = &mut ctx.accounts.proposal;
    if proposal.sender_status == 2 || proposal.receiver_status == 2{
        proposal.close(ctx.accounts.payer.to_account_info())?
    }
    Ok(())
}