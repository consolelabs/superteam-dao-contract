use anchor_lang::prelude::*;

#[error_code]
pub enum ErrorCodes {

    #[msg("Invalid sender")]
    SenderInvalidStateAccount,

    #[msg("Invalid receiver")]
    ReceiverInvalidStateAccount,

    #[msg("Invalid owner account")]
    OwnerInvalidAccount,

    #[msg("Account is invalid")]
    InvalidAccount,

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