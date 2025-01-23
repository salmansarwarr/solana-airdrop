use anchor_lang::prelude::*;
use anchor_spl::token::{ self, Token, Transfer };

declare_id!("9tR37zhsZ3EKajLjpHxLQwkSMeQ5SbWqZQKu5iPoGQVH");

#[program]
pub mod airdrop {
    use super::*;

    pub fn initialize_airdrop(
        ctx: Context<InitializeAirdrop>,
        total_tokens: u64,
        bump: u8
    ) -> Result<()> {
        let airdrop = &mut ctx.accounts.airdrop;
        airdrop.admin = ctx.accounts.admin.key();
        airdrop.total_tokens = total_tokens;
        airdrop.claimed_tokens = 0;
        airdrop.allocations = Vec::new();
        airdrop.bump = bump;
        Ok(())
    }

    pub fn set_allocation(ctx: Context<SetAllocation>, recipients: Vec<Recipient>) -> Result<()> {
        let airdrop = &mut ctx.accounts.airdrop;
        require!(ctx.accounts.admin.key() == airdrop.admin, CustomError::Unauthorized);

        for recipient in recipients {
            if
                let Some(allocation) = airdrop.allocations
                    .iter_mut()
                    .find(|alloc| alloc.recipient == recipient.address)
            {
                allocation.amount = recipient.amount;
            } else {
                airdrop.allocations.push(Allocation {
                    recipient: recipient.address,
                    amount: recipient.amount,
                    claimed: false,
                });
            }
        }

        Ok(())
    }

    pub fn claim(ctx: Context<Claim>) -> Result<()> {
        let user = ctx.accounts.user.key();

        let airdrop = &mut ctx.accounts.airdrop;

        // Find and update user allocation
        let allocation = airdrop.allocations
            .iter_mut()
            .find(|alloc| alloc.recipient == user && !alloc.claimed)
            .ok_or(CustomError::NothingToClaim)?;

        let amount = allocation.amount;
        allocation.claimed = true;

        // Update claimed tokens before transfer
        airdrop.claimed_tokens = airdrop.claimed_tokens
            .checked_add(amount)
            .ok_or(CustomError::Overflow)?;

        // Calculate tax (1%)
        let tax_in_tokens = amount.checked_div(100).ok_or(CustomError::Overflow)?;
        let net_amount = amount.checked_sub(tax_in_tokens).ok_or(CustomError::Overflow)?;

        let seeds = &[b"airdrop".as_ref(), &[airdrop.bump]];
        let signer_seeds = &[&seeds[..]];

        // Transfer tax in Tokens
        token::transfer(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.vault.to_account_info(),
                    to: ctx.accounts.tax_account.to_account_info(),
                    authority: ctx.accounts.airdrop.to_account_info(),
                },
                signer_seeds
            ),
            tax_in_tokens
        )?;

        // Transfer tokens

        token::transfer(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.vault.to_account_info(),
                    to: ctx.accounts.user_token_account.to_account_info(),
                    authority: ctx.accounts.airdrop.to_account_info(),
                },
                signer_seeds
            ),
            net_amount
        )?;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeAirdrop<'info> {
    #[account(init, payer = admin, space = 8 + Airdrop::SIZE, seeds = [b"airdrop".as_ref()], bump)]
    pub airdrop: Account<'info, Airdrop>,
    #[account(mut)]
    pub admin: Signer<'info>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct SetAllocation<'info> {
    #[account(mut)]
    pub airdrop: Account<'info, Airdrop>,
    #[account(mut)]
    pub admin: Signer<'info>,
}

#[derive(Accounts)]
pub struct Claim<'info> {
    #[account(mut)]
    pub airdrop: Account<'info, Airdrop>,
    /// CHECK: This is a token account, not an Anchor account, so it uses AccountInfo
    #[account(mut)]
    pub vault: AccountInfo<'info>,
    /// CHECK: This is a token account, not an Anchor account, so it uses AccountInfo
    #[account(mut)]
    pub user_token_account: AccountInfo<'info>,
    /// CHECK: Tax account for SOL transfers
    #[account(mut)]
    pub tax_account: AccountInfo<'info>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub token_program: Program<'info, Token>,
}

#[account]
pub struct Airdrop {
    pub admin: Pubkey,
    pub total_tokens: u64,
    pub claimed_tokens: u64,
    pub allocations: Vec<Allocation>,
    pub bump: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct Allocation {
    pub recipient: Pubkey,
    pub amount: u64,
    pub claimed: bool,
}

impl Airdrop {
    pub const SIZE: usize =
        32 + // admin: Pubkey
        8 + // total_tokens: u64
        8 + // claimed_tokens: u64
        4 +
        (32 + 8 + 1) * 100 + // allocations: Vec<(Pubkey, u64)>, assume 100 entries max
        1; // bump: u8
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct Recipient {
    pub address: Pubkey,
    pub amount: u64,
}

#[error_code]
pub enum CustomError {
    #[msg("Unauthorized access")]
    Unauthorized,
    #[msg("Nothing to claim")]
    NothingToClaim,
    #[msg("Overflow")]
    Overflow,
    #[msg("Insufficient funds")]
    InsufficientFunds,
}
