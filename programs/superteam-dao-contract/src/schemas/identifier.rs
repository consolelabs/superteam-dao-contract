use anchor_lang::prelude::*;
use crate::constants::*;


#[account]
#[derive(Default)]
pub struct Identifier {
    pub payer: Pubkey,
    pub count: u64
}

impl Identifier {
    // FYI: https://github.com/coral-xyz/anchor/blob/master/lang/syn/src/codegen/program/handlers.rs#L98
    pub fn space() -> usize {
        8 +  // discriminator
        PUBKEY_SIZE + // payer
        U64_SIZE // count
    }
}

