use anchor_lang::prelude::*;

use crate::schemas::{Identifier};
use crate::constants::*;
use crate::error::*;

#[derive(Accounts)]
pub struct CreateIdentifier<'info> {
    #[account(
        init,
        seeds = [b"v1", IDENTIFIER_SEED.as_ref(), payer.key().as_ref()],
        bump,
        space = Identifier::space(),
        payer = payer
    )]
    pub identifier: Account<'info, Identifier>,

    #[account(mut)]
    pub payer: Signer<'info>,

    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

pub fn handler(
    ctx: Context<CreateIdentifier>
) -> Result<()> {
    let identifier = &mut ctx.accounts.identifier;
    identifier.payer = ctx.accounts.payer.key();
    identifier.count = 0;
    Ok(())
}