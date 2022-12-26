use anchor_lang::prelude::*;

#[error_code]
pub enum ErrorCodes {

    #[msg("Invalid sender")]
    SenderInvalidStateAccount,

    #[msg("Invalid recipient")]
    RecipientInvalidStateAccount,

    #[msg("Not enough lamport")]
    NotEnoughLamport,

    #[msg("Not enough spl token")]
    NotEnoughSplToken,

    #[msg("Invalid owner associated token account")]
    OwnerInvalidTokenAccount,

    #[msg("proposal is not pending")]
    StatusPendingInvalid,

    #[msg("Invalid owner account")]
    OwnerInvalidAccount,

    #[msg("Account is invalid")]
    InvalidAccount,

    #[msg("Mint Account is invalid")]
    InvalidMintAccount,
}