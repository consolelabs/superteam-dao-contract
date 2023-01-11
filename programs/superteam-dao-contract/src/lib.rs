use anchor_lang::prelude::*;
pub mod schemas;
pub mod instructions;
pub mod constants;
pub mod error;

use crate::constants::*;
use crate::error::*;

use instructions::*;
use schemas::*;

declare_id!("9J2QYZw4KgkL7W1uAf2awtqAc7roNWtcjVmAGs6GskRT");

#[program]
pub mod superteam_dao_contract {
    use super::*;

    pub fn create_identifier(ctx: Context<CreateIdentifier>) -> Result<()> {
        create_identifier::handler(ctx);
        Ok(())
    }

    pub fn create_proposal(ctx: Context<CreateProposal>, recipient: Pubkey, image: String, title: String, subtitle: String,
                           spl: Pubkey, tags: String, amount: u64, is_owner: bool, transaction_hash: Option<String>) -> Result<()> {
        create_proposal::handler(ctx, recipient, image, title, subtitle, spl, tags, amount, is_owner, transaction_hash);
        Ok(())
    }

    pub fn cancel_proposal(ctx: Context<CancelProposal>) -> Result<()> {
        cancel_proposal::handler(ctx);
        Ok(())
    }

    pub fn reject_proposal(ctx: Context<RejectProposal>) -> Result<()> {
        reject_proposal::handler(ctx);
        Ok(())
    }

    pub fn approve_proposal(ctx: Context<ApproveProposal>) -> Result<()> {
        approve_proposal::handler(ctx);
        Ok(())
    }

    pub fn close_proposal(ctx: Context<CloseProposal>) -> Result<()> {
        close_proposal::handler(ctx);
        Ok(())
    }

    pub fn applicant_confirm_proposal(ctx: Context<ApplicantConfirmProposal>) -> Result<()> {
        applicant_confirm_proposal::handler(ctx);
        Ok(())
    }

    pub fn applicant_reject_proposal(ctx: Context<ApplicantRejectProposal>) -> Result<()> {
        applicant_reject_proposal::handler(ctx);
        Ok(())
    }

    pub fn fill_transaction_hash(ctx: Context<FillTransactionHash>, transaction_hash: Option<String>) -> Result<()> {
        fill_transaction_hash::handler(ctx, transaction_hash);
        Ok(())
    }

}
