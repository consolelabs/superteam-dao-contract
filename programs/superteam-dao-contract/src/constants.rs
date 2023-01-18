use anchor_lang::prelude::*;

pub const PUBKEY_SIZE: usize = std::mem::size_of::<Pubkey>();
pub const BOOL_SIZE: usize = std::mem::size_of::<bool>();
pub const I64_SIZE: usize = std::mem::size_of::<i64>();
pub const U64_SIZE: usize = std::mem::size_of::<u64>();
pub const U32_SIZE: usize = std::mem::size_of::<u32>();
pub const VERSION: i8 = 1;
pub const PROPOSAL_SEED: &[u8] = b"proposal";
pub const MAX_LENGTH_TITLE: usize = 256;
pub const MAX_LENGTH_IMAGE: usize = 256;
pub const MAX_LENGTH_SUBTITLE: usize = 256;
pub const MAX_LENGTH_TAGS: usize = 256;
pub const LENGTH_TRANSACTION_HASH: usize = 88;
