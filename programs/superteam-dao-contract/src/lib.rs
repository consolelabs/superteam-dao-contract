use anchor_lang::prelude::*;
pub mod schemas;
pub mod instructions;
pub mod constants;
pub mod error;

use crate::constants::*;
use crate::error::*;

use instructions::*;
use schemas::*;

declare_id!("7cir3NiJkRvAHY5DFtnBWWDWXUMPjnJcVgwiQ9YBUS5o");

#[program]
pub mod superteam_dao_contract {
    use super::*;

    pub fn create_proposal(ctx: Context<CreateProposal>, first_txn: String,
                           second_txn: String, third_txn: String,
                           sender: Pubkey, receiver: Pubkey,
                           image: String, title: String, subtitle: String,
                           spl: Pubkey, tags: String, amount: u64) -> Result<()> {
        create_proposal::handler(ctx, first_txn, second_txn, third_txn, sender, receiver, image, title, subtitle, spl, tags, amount);
        Ok(())
    }

    pub fn sender_approve_proposal(ctx: Context<SenderApproveProposal>) -> Result<()> {
        sender_approve_proposal::handler(ctx);
        Ok(())
    }

    pub fn receiver_approve_proposal(ctx: Context<ReceiverApproveProposal>) -> Result<()> {
        receiver_approve_proposal::handler(ctx);
        Ok(())
    }

    pub fn sender_reject_proposal(ctx: Context<SenderRejectProposal>) -> Result<()> {
        sender_reject_proposal::handler(ctx);
        Ok(())
    }

    pub fn receiver_reject_proposal(ctx: Context<ReceiverRejectProposal>) -> Result<()> {
        receiver_reject_proposal::handler(ctx);
        Ok(())
    }

    pub fn cancel_proposal(ctx: Context<CancelProposal>) -> Result<()> {
        cancel_proposal::handler(ctx);
        Ok(())
    }

    pub fn close_proposal(ctx: Context<CloseProposal>) -> Result<()> {
        close_proposal::handler(ctx);
        Ok(())
    }


}
