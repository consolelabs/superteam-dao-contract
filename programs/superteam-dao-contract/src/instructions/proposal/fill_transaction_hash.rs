use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount};

use crate::constants::*;
use crate::error::*;
use crate::schemas::Proposal;


#[derive(Accounts)]
pub struct FillTransactionHash<'info> {
    #[account(
        mut,
    )]
    pub proposal: Account<'info, Proposal>,

    #[account(mut)]
    pub signer: Signer<'info>,

    pub system_program: Program<'info, System>,
}

pub fn handler(
    ctx: Context<FillTransactionHash>, transaction_hash: Option<String>
) -> Result<()> {
    let signer = & ctx.accounts.signer;
    let proposal = &mut ctx.accounts.proposal;
    if *signer.key == proposal.recipient || *signer.key == proposal.sender  {
        if transaction_hash.is_none() {
            return Err(ErrorCodes::TransactionHashIsNotValid.into())
        }
        if proposal.pop_status == 1 {
            return Err(ErrorCodes::InvalidProposal.into())
        }
        proposal.transaction = transaction_hash;
    }
    Ok(())
}
