use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount};

use crate::constants::*;
use crate::error::*;
use crate::schemas::Proposal;


#[derive(Accounts)]
pub struct ApproveProposal<'info> {
    #[account(
    mut,
    constraint = *recipient.key == proposal.recipient
    @ ErrorCodes::RecipientInvalidStateAccount
    )]
    pub proposal: Account<'info, Proposal>,


    #[account(mut)]
    pub recipient: Signer<'info>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
}

pub fn handler(
    ctx: Context<ApproveProposal>
) -> Result<()> {
    let proposal = &mut ctx.accounts.proposal;
    if proposal.status == 0 {
        proposal.status = 2;
        // approver submit grant with transaction hash, applicant approve and confirm
        if !proposal.transaction.is_none() && proposal.owner == false {
            proposal.pop_status = 1;
        }
    }
    Ok(())
}


