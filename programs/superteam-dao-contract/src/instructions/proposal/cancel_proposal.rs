use anchor_lang::prelude::*;

use crate::constants::*;
use crate::error::*;
use crate::schemas::Proposal;


#[derive(Accounts)]
pub struct CancelProposal<'info> {
    #[account(
        mut,
        constraint = *payer.key == proposal.submitter
        @ ErrorCodes::InvalidAccount
    )]
    pub proposal: Account<'info, Proposal>,

    #[account(mut)]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

pub fn handler(
    ctx: Context<CancelProposal>,
) -> Result<()> {
    let proposal = &mut ctx.accounts.proposal;
    if proposal.sender_status == 0 && proposal.receiver_status == 0 {
        proposal.close(ctx.accounts.payer.to_account_info())?
    }
    Ok(())
}