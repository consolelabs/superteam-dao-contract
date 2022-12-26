use anchor_lang::prelude::*;

use crate::schemas::{Identifier};
use crate::constants::*;
use crate::error::*;

#[derive(Accounts)]
pub struct CreateIdentifier<'info> {
    #[account(
        init,
        seeds = [b"v1", IDENTIFIER_SEED.as_ref(), sender.key().as_ref()],
        bump,
        space = Identifier::space(),
        payer = sender
    )]
    pub identifier: Account<'info, Identifier>,

    #[account(mut)]
    pub sender: Signer<'info>,

    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

pub fn handler(
    ctx: Context<CreateIdentifier>
) -> Result<()> {
    let identifier = &mut ctx.accounts.identifier;
    identifier.sender = ctx.accounts.sender.key();
    identifier.count = 0;
    Ok(())
}