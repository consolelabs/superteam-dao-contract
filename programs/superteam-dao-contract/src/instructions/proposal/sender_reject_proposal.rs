use anchor_lang::prelude::*;

use crate::constants::*;
use crate::error::*;
use crate::schemas::Proposal;


#[derive(Accounts)]
pub struct SenderRejectProposal<'info> {
    #[account(
    mut,
    constraint = *sender.key == proposal.sender
    @ ErrorCodes::ReceiverInvalidStateAccount
    )]
    pub proposal: Account<'info, Proposal>,

    #[account(mut)]
    pub sender: Signer<'info>,
    pub system_program: Program<'info, System>,
}

pub fn handler(
    ctx: Context<SenderRejectProposal>,
) -> Result<()> {
    let proposal = &mut ctx.accounts.proposal;
    if proposal.sender_status == 0  {
        proposal.sender_status = 2;
    }
    Ok(())
}


