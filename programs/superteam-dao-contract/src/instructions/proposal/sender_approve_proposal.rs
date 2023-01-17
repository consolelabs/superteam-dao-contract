use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount};

use crate::constants::*;
use crate::error::*;
use crate::schemas::Proposal;


#[derive(Accounts)]
pub struct SenderApproveProposal<'info> {
    #[account(
    mut,
    constraint = *sender.key == proposal.sender
    @ ErrorCodes::SenderInvalidStateAccount
    )]
    pub proposal: Account<'info, Proposal>,


    #[account(mut)]
    pub sender: Signer<'info>,

    pub system_program: Program<'info, System>
}

pub fn handler(
    ctx: Context<SenderApproveProposal>
) -> Result<()> {
    let proposal = &mut ctx.accounts.proposal;
    if proposal.sender_status == 0 {
        proposal.sender_status = 1
    }
    Ok(())
}


