use anchor_lang::prelude::*;

use crate::constants::*;
use crate::error::*;
use crate::schemas::Proposal;


#[derive(Accounts)]
pub struct CancelProposal<'info> {
    #[account(
        mut,
        constraint = *sender.key == proposal.sender
        @ ErrorCodes::SenderInvalidStateAccount,
        close = sender
    )]
    pub proposal: Account<'info, Proposal>,

    #[account(mut)]
    pub sender: Signer<'info>,
    pub system_program: Program<'info, System>,
}

pub fn handler(
    ctx: Context<CancelProposal>,
) -> Result<()> {
    let proposal = &mut ctx.accounts.proposal;
    if proposal.status == 0 {
        proposal.status = 1;
    }
    Ok(())
}


