use anchor_lang::prelude::*;

use crate::constants::*;
use crate::error::*;
use crate::schemas::Proposal;


#[derive(Accounts)]
pub struct RejectProposal<'info> {
    #[account(
        mut,
        constraint = *recipient.key == proposal.recipient
        @ ErrorCodes::RecipientInvalidStateAccount
    )]
    pub proposal: Account<'info, Proposal>,

    #[account(mut)]
    pub recipient: Signer<'info>,
    pub system_program: Program<'info, System>,
}

pub fn handler(
    ctx: Context<RejectProposal>,
) -> Result<()> {
    let proposal = &mut ctx.accounts.proposal;
    if proposal.status == 0 {
        proposal.status = 3;
    }
    Ok(())
}


