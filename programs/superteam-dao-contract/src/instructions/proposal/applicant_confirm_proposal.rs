use std::ptr::null;
use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount};

use crate::constants::*;
use crate::error::*;
use crate::schemas::Proposal;


#[derive(Accounts)]
pub struct ApplicantConfirmProposal<'info> {
    #[account(
        mut,
    )]
    pub proposal: Account<'info, Proposal>,

    #[account(mut)]
    pub applicant: Signer<'info>,

    pub system_program: Program<'info, System>,
}

pub fn handler(
    ctx: Context<ApplicantConfirmProposal>
) -> Result<()> {
    let applicant = &ctx.accounts.applicant;
    let proposal = &mut ctx.accounts.proposal;
    if proposal.owner == true && proposal.sender == *applicant.key && proposal.status == 2 {
        if !proposal.transaction.is_none() {
            proposal.pop_status = 1;
        }
    } else if proposal.owner == false && proposal.recipient == *applicant.key && proposal.status == 2{
        if !proposal.transaction.is_none() {
            proposal.pop_status = 1;
        }
    } else {
        return Err(ErrorCodes::InvalidProposal.into())
    }
    Ok(())
}


