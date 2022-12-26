use anchor_lang::prelude::*;
pub mod schemas;
pub mod instructions;
pub mod constants;
pub mod error;

use crate::constants::*;
use crate::error::*;

use instructions::*;
use schemas::*;

declare_id!("EQA7EsMus3Bj4UC5czQ28gjK6tDdvz1572qr2XSnvTQV");

#[program]
pub mod superteam_dao_contract {
    use super::*;

    pub fn create_identifier(ctx: Context<CreateIdentifier>) -> Result<()> {
        create_identifier::handler(ctx);
        Ok(())
    }

    pub fn create_proposal(ctx: Context<CreateProposal>, recipient: Pubkey, image: String, title: String, subtitle: String,
                           spl: Pubkey, tags: String, amount: u64) -> Result<()> {
        create_proposal::handler(ctx, recipient, image, title, subtitle, spl, tags, amount);
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

}