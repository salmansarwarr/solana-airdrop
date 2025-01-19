import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Airdrop } from "../target/types/airdrop";
import { assert } from "chai";
import {
    createAccount,
    createAssociatedTokenAccount,
    createMint,
    getAssociatedTokenAddress,
    mintTo,
} from "@solana/spl-token";
import { Keypair, PublicKey } from "@solana/web3.js";

describe("airdrop", () => {
    anchor.setProvider(anchor.AnchorProvider.env());
    const program = anchor.workspace.Airdrop as Program<Airdrop>;
    const provider = anchor.AnchorProvider.env();

    const admin = Keypair.generate();
    let airdropPDA: PublicKey;
    let bump: number;
    const vault = Keypair.generate();
    const mint = Keypair.generate();
    const user = Keypair.generate();
    const userTokenAccount = Keypair.generate();

    before(async () => {
        // Fund admin
        const adminAirdrop = await provider.connection.requestAirdrop(
            admin.publicKey,
            2_000_000_000 // 2 SOL
        );
        await provider.connection.confirmTransaction(adminAirdrop);

        // Fund user
        const userAirdrop = await provider.connection.requestAirdrop(
            user.publicKey,
            1_000_000_000 // 1 SOL
        );
        await provider.connection.confirmTransaction(userAirdrop);

        // Create PDA
        [airdropPDA, bump] = PublicKey.findProgramAddressSync(
            [Buffer.from("airdrop")],
            program.programId
        );

        // Create mint
        const mint = await createMint(
            provider.connection,
            admin,
            admin.publicKey,
            null,
            9
        );

        // Create vault token account using ATA
        const vaultTokenAccount = await getAssociatedTokenAddress(
            mint,
            airdropPDA,
            true // allowOwnerOffCurve
        );

        await createAssociatedTokenAccount(
            provider.connection,
            admin,
            mint,
            airdropPDA,
            {
                commitment: "confirmed",
            },
            undefined,
            undefined,
            true // allowOwnerOffCurve
        );

        // Create user token account
        const userTokenAccount = await createAssociatedTokenAccount(
            provider.connection,
            admin,
            mint,
            user.publicKey
        );

        // Mint tokens to vault
        await mintTo(
            provider.connection,
            admin,
            mint,
            vaultTokenAccount,
            admin.publicKey,
            1_000_000_000
        );
    });

    it("Initializes the airdrop", async () => {
        const totalTokens = new anchor.BN(1_000_000_000);

        await program.methods
            .initializeAirdrop(totalTokens, bump)
            .accounts({
                airdrop: airdropPDA,
                admin: admin.publicKey,
                systemProgram: anchor.web3.SystemProgram.programId,
                tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
            })
            .signers([admin])
            .rpc();

        const airdropAccount = await program.account.airdrop.fetch(airdropPDA);
        assert.equal(
            airdropAccount.admin.toBase58(),
            admin.publicKey.toBase58()
        );
        assert.equal(
            airdropAccount.totalTokens.toString(),
            totalTokens.toString()
        );
        assert.equal(airdropAccount.claimedTokens.toString(), "0");
        assert.deepEqual(airdropAccount.allocations, []);
    });

    it("Sets allocations", async () => {
        const recipients = [
            {
                address: user.publicKey,
                amount: new anchor.BN(500_000_000),
            },
        ];

        await program.methods
            .setAllocation(recipients)
            .accounts({
                airdrop: airdropPDA,
                admin: admin.publicKey,
            })
            .signers([admin])
            .rpc();

        const airdropAccount = await program.account.airdrop.fetch(airdropPDA);
        const allocation = airdropAccount.allocations.find((alloc: any) =>
            alloc.address.equals(user.publicKey)
        );
        assert.isDefined(allocation);
        assert.equal(allocation.amount.toString(), "500000000");
    });

    it("Claims tokens", async () => {
        const initialUserBalance =
            await provider.connection.getTokenAccountBalance(
                userTokenAccount.publicKey
            );

        await program.methods
            .claim()
            .accounts({
                airdrop: airdropPDA,
                vault: vault.publicKey,
                userTokenAccount: userTokenAccount.publicKey,
                user: user.publicKey,
                tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
            })
            .signers([user])
            .rpc();

        const finalUserBalance =
            await provider.connection.getTokenAccountBalance(
                userTokenAccount.publicKey
            );

        assert.equal(
            Number(finalUserBalance.value.amount) -
                Number(initialUserBalance.value.amount),
            500_000_000
        );

        const airdropAccount = await program.account.airdrop.fetch(airdropPDA);
        assert.equal(airdropAccount.claimedTokens.toString(), "500000000");
    });

    it("Prevents claiming twice", async () => {
        try {
            await program.methods
                .claim()
                .accounts({
                    airdrop: airdropPDA,
                    vault: vault.publicKey,
                    userTokenAccount: userTokenAccount.publicKey,
                    user: user.publicKey,
                    tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
                })
                .signers([user])
                .rpc();
            assert.fail("Should have thrown an error");
        } catch (err) {
            assert.equal(err.error.errorCode.code, "NothingToClaim");
        }
    });
});
