use anchor_lang::prelude::*;
pub mod schemas;
pub mod instructions;
pub mod constants;
pub mod error;

use crate::constants::*;
use crate::error::*;

use instructions::*;
use schemas::*;

declare_id!("CQamCKHdgid5vgpRvuc88GQCFXvifPUYRTUmpgv3bDuG");

#[program]
pub mod freeze_nft_contract {
    use super::*;

    pub fn freeze_nft(ctx: Context<FreezeNft>) -> Result<()> {
        freeze_nft::handler(ctx);
        Ok(())
    }
}
