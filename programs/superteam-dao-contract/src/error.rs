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

    #[msg("The provided tags should be 256 characters long maximum.")]
    TagsTooLong,

    #[msg("The provided content should be 256 characters long maximum.")]
    TitleTooLong,

    #[msg("The provided subtitle should be 256 characters long maximum.")]
    SubtitleTooLong,

    #[msg("The provided image should be 256 characters long maximum.")]
    ImageTooLong,

    #[msg("The transaction hash is needed")]
    TransactionHashIsNotValid,

    #[msg("Proposal is invalid")]
    InvalidProposal,
}