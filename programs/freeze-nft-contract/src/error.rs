use anchor_lang::prelude::*;

#[error_code]
pub enum ErrorCodes {
    #[msg("InvalidMint")]
    InvalidMint,
    #[msg("InvalidOwner")]
    InvalidOwner,
    #[msg("InvalidAmount")]
    InvalidAmount,
}