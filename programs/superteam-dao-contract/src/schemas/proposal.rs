use anchor_lang::prelude::*;
use crate::constants::*;


#[account]
#[derive(Default)]
pub struct Proposal {
    pub recipient: Pubkey,
    pub sender: Pubkey,
    pub status: u8,
    pub owner: bool,
    pub spl: Pubkey,
    pub amount: u64,
    pub pop_status: u8,
    pub tags: String,
    pub transaction: Option<String>,
    pub image: String,
    pub title: String,
    pub subtitle: String,
    pub identifier: u64,
}

impl Proposal {
    // FYI: https://github.com/coral-xyz/anchor/blob/master/lang/syn/src/codegen/program/handlers.rs#L98
    pub fn space() -> usize {
        8 +  // discriminator
        PUBKEY_SIZE + // recipient
        PUBKEY_SIZE + // sender
        1 + // status: 0-pending 1-cancel 2-approve 3-reject
        1 + // owner
        PUBKEY_SIZE + // spl
        U64_SIZE + // amount
        1 + // pop_status: 0-pending 1-confirm 2-reject
        4 + MAX_LENGTH_TAGS + // tags
        1 + 4 + LENGTH_TRANSACTION_HASH + // transaction hash
        4 + MAX_LENGTH_IMAGE + // image
        4 + MAX_LENGTH_TITLE + // title
        4 + MAX_LENGTH_SUBTITLE + // subtitle
        8  // identifier
    }
}

