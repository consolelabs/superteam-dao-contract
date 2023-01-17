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

    pub fn create_proposal(ctx: Context<CreateProposal>, receiver: Pubkey, sender: Pubkey, image: String, title: String, subtitle: String,
                           spl: Pubkey, tags: String, amount: u64, is_owner: bool, transaction_hash: String) -> Result<()> {
        create_proposal::handler(ctx, receiver, sender, image, title, subtitle, spl, tags, amount, is_owner, transaction_hash);
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
