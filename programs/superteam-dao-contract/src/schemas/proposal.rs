use anchor_lang::prelude::*;
use crate::constants::*;


#[account]
#[derive(Default)]
pub struct Proposal {
    pub receiver: Pubkey,
    pub sender: Pubkey,
    pub transaction: String,
    pub receiver_status: u8,
    pub sender_status: u8,
    pub spl: Pubkey,
    pub amount: u64,
    pub tags: String,
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
        4 + LENGTH_TRANSACTION_HASH + // transaction hash
        1 + // receiver_status-0-pending-1-approve-2-reject
        1 + // sender_status-0-pending-1-approve-2-reject
        PUBKEY_SIZE + // spl
        U64_SIZE + // amount
        4 + MAX_LENGTH_TAGS + // tags
        4 + MAX_LENGTH_IMAGE + // image
        4 + MAX_LENGTH_TITLE + // title
        4 + MAX_LENGTH_SUBTITLE + // subtitle
        8  // identifier
    }
}

