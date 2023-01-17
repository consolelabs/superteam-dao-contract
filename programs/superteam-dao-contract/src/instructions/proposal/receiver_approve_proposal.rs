use anchor_lang::prelude::*;

use crate::constants::*;
use crate::error::*;
use crate::schemas::Proposal;


#[derive(Accounts)]
pub struct ReceiverApproveProposal<'info> {
    #[account(
        mut,
        constraint = *receiver.key == proposal.receiver
        @ ErrorCodes::ReceiverInvalidStateAccount
    )]
    pub proposal: Account<'info, Proposal>,

    #[account(mut)]
    pub receiver: Signer<'info>,
    pub system_program: Program<'info, System>,
}

pub fn handler(
    ctx: Context<ReceiverApproveProposal>,
) -> Result<()> {
    let proposal = &mut ctx.accounts.proposal;
    if proposal.receiver_status == 0  {
        proposal.receiver_status = 1;
    }
    Ok(())
}


