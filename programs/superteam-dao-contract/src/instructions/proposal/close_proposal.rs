use anchor_lang::AccountsClose;
use anchor_lang::error::Error::ProgramError;
use anchor_lang::prelude::*;

use crate::constants::*;
use crate::error::*;
use crate::schemas::Proposal;


#[derive(Accounts)]
pub struct CloseProposal<'info> {
    #[account(
        mut,
        constraint = *sender.key == proposal.sender
        @ ErrorCodes::SenderInvalidStateAccount
    )]
    pub proposal: Account<'info, Proposal>,

    #[account(mut)]
    pub sender: Signer<'info>,
    pub system_program: Program<'info, System>,
}

pub fn handler(
    ctx: Context<CloseProposal>,
) -> Result<()> {
    let proposal = & ctx.accounts.proposal;
    if proposal.status == 1 ||  proposal.status == 3{
        proposal.close(ctx.accounts.sender.to_account_info())?
    }
    Ok(())
}


