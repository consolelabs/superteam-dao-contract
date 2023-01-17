use anchor_lang::prelude::*;

use crate::constants::*;
use crate::error::*;
use crate::schemas::Proposal;


#[derive(Accounts)]
pub struct CloseProposal<'info> {
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
    ctx: Context<CloseProposal>,
) -> Result<()> {
    let proposal = &mut ctx.accounts.proposal;
    if proposal.sender_status == 2 || proposal.receiver_status == 2{
        proposal.close(ctx.accounts.payer.to_account_info())?
    }
    Ok(())
}