"use client";

import {
    clusterApiUrl,
    Connection,
    PublicKey,
    sendAndConfirmTransaction,
    Transaction,
} from "@solana/web3.js";
import React, { useEffect, useState } from "react";
import idl from "../../assets/idl.json";
import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { toast } from "react-toastify";
import {
    createAssociatedTokenAccountInstruction,
    getAccount,
    getAssociatedTokenAddress,
    TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import {
    taxRecieverAddress,
    tokenDecimals,
    tokenMintAddress,
} from "@/constants/constants";
import Navbar from "@/components/Navbar/Navbar";

const programId = new PublicKey(idl.address);
const network = clusterApiUrl("devnet");
const opts = {
    preflightCommitment: "confirmed",
};

const Airdrop = () => {
    const [walletConnected, setwalletConnected] = useState(false);
    const [claimedAirdrop, setClaimedAirdrop] = useState(false);
    const [walletAddress, setWalletAddress] = useState();
    const [checkBalanceBtn, setcheckBalanceBtn] = useState(false);
    const [eligibleBalance, setEligibleBalance] = useState(null);

    const getProvider = () => {
        const connection = new Connection(network, opts.preflightCommitment);
        const provider = new AnchorProvider(
            connection,
            window.solana,
            opts.preflightCommitment
        );
        return provider;
    };

    const checkIfTokenAccountExists = async (
        connection,
        receiverTokenAccountAddress
    ) => {
        // Check if the receiver's token account exists
        try {
            await getAccount(
                connection,
                receiverTokenAccountAddress,
                "confirmed",
                TOKEN_PROGRAM_ID
            );

            return true;
        } catch (error) {
            return false;
        }
    };

    const claim = async () => {
        const connection = new Connection(network, opts.preflightCommitment);
        const provider = getProvider();

        if (!provider.wallet?.publicKey) {
            toast.error("Please connect your wallet first");
            return;
        }

        const program = new Program(idl, provider);
        const [airdropPDA, bump] = PublicKey.findProgramAddressSync(
            [Buffer.from("airdrop")],
            programId
        );

        const mintAddress = new PublicKey(tokenMintAddress);

        try {
            const taxRecieverPubKey = new PublicKey(taxRecieverAddress);
            const userWallet = provider.wallet.publicKey;
            const userTokenAccount = await getAssociatedTokenAddress(
                mintAddress, // Replace with your token mint address
                userWallet
            );

            const taxRecieverTokenAccount = await getAssociatedTokenAddress(
                mintAddress,
                taxRecieverPubKey
            );

            const vault = await getAssociatedTokenAddress(
                mintAddress,
                airdropPDA,
                true
            );

            const isTokenAccountAlreadyMade = await checkIfTokenAccountExists(
                connection,
                userTokenAccount
            );

            const isTaxRecieverTokenAccountAlreadyMade =
                await checkIfTokenAccountExists(
                    connection,
                    taxRecieverTokenAccount
                );

            const isVaultTokenAccountExists = checkIfTokenAccountExists(
                connection,
                vault
            );

            if (isTokenAccountAlreadyMade) {
                console.log(
                    `Token account already exists at ${userTokenAccount}, no need to make it`
                );
            } else {
                console.log(
                    `Token account does not exist at ${userTokenAccount}, adding instruction to make it`
                );
                const ix = await createAssociatedTokenAccountInstruction(
                    userWallet,
                    userTokenAccount,
                    userWallet,
                    mintAddress
                );
                const transaction = new Transaction().add(ix);
                transaction.feePayer = userWallet;
                transaction.recentBlockhash = (
                    await connection.getLatestBlockhash()
                ).blockhash;

                // Sign and send the transaction
                const signedTransaction = await provider.wallet.signTransaction(
                    transaction
                );
                const txId = await connection.sendRawTransaction(
                    signedTransaction.serialize()
                );
                await connection.confirmTransaction(txId);
                console.log("Token account created:", txId);
            }

            if (isTaxRecieverTokenAccountAlreadyMade) {
                console.log(
                    `Token account for tax reciever already exists at ${taxRecieverTokenAccount}, no need to make it`
                );
            } else {
                console.log(
                    `Token account for tax reciever does not exist at ${taxRecieverTokenAccount}, adding instruction to make it`
                );
                const ix = await createAssociatedTokenAccountInstruction(
                    userWallet,
                    taxRecieverTokenAccount,
                    taxRecieverPubKey,
                    mintAddress
                );
                const transaction = new Transaction().add(ix);
                transaction.feePayer = userWallet;
                transaction.recentBlockhash = (
                    await connection.getLatestBlockhash()
                ).blockhash;

                // Sign and send the transaction
                const signedTransaction = await provider.wallet.signTransaction(
                    transaction
                );
                const txId = await connection.sendRawTransaction(
                    signedTransaction.serialize()
                );
                await connection.confirmTransaction(txId);
                console.log("Token account created:", txId);
            }

            if (isTokenAccountAlreadyMade) {
                console.log(
                    `Token account already exists at ${userTokenAccount}, no need to make it`
                );
            } else {
                console.log(
                    `Token account does not exist at ${userTokenAccount}, adding instruction to make it`
                );
                const ix = await createAssociatedTokenAccountInstruction(
                    userWallet,
                    userTokenAccount,
                    userWallet,
                    mintAddress
                );
                const transaction = new Transaction().add(ix);
                transaction.feePayer = userWallet;
                transaction.recentBlockhash = (
                    await connection.getLatestBlockhash()
                ).blockhash;

                // Sign and send the transaction
                const signedTransaction = await provider.wallet.signTransaction(
                    transaction
                );
                const txId = await connection.sendRawTransaction(
                    signedTransaction.serialize()
                );
                await connection.confirmTransaction(txId);
                console.log("Token account created:", txId);
            }

            if (isVaultTokenAccountExists) {
                console.log(
                    `Token account for vault already exists at ${vault}, no need to make it`
                );
            } else {
                console.log(
                    `Token account for vault does not exist at ${vault}, adding instruction to make it`
                );
                const ix = await createAssociatedTokenAccountInstruction(
                    userWallet,
                    vault,
                    airdropPDA,
                    mintAddress
                );
                const transaction = new Transaction().add(ix);
                transaction.feePayer = userWallet;
                transaction.recentBlockhash = (
                    await connection.getLatestBlockhash()
                ).blockhash;

                // Sign and send the transaction
                const signedTransaction = await provider.wallet.signTransaction(
                    transaction
                );
                const txId = await connection.sendRawTransaction(
                    signedTransaction.serialize()
                );
                await connection.confirmTransaction(txId);
                console.log("Token account created:", txId);
            }

            console.log({
                airdrop: airdropPDA.toString(),
                vault: vault.toString(),
                userTokenAccount: userTokenAccount.toString(),
                taxAccount: taxRecieverTokenAccount.toString(),
                user: userWallet.toString(),
                tokenProgram: TOKEN_PROGRAM_ID,
            });

            await program.methods
                .claim()
                .accounts({
                    airdrop: airdropPDA,
                    vault: vault,
                    userTokenAccount: userTokenAccount,
                    taxAccount: taxRecieverTokenAccount,
                    user: userWallet,
                    tokenProgram: TOKEN_PROGRAM_ID,
                })
                .rpc();

            toast.success("Airdrop claimed successfully!");
            setClaimedAirdrop(true);
            await fetchEligibleBalance();
        } catch (error) {
            console.error(error);
            console.log("Logs:", error.logs);
            toast.error("Failed to claim tokens.");
        }
    };

    const fetchEligibleBalance = async () => {
        try {
            const provider = getProvider();
            if (!provider.wallet?.publicKey) {
                toast.error("Please connect your wallet first");
                return;
            }

            const program = new Program(idl, provider);

            const [airdropPDA] = PublicKey.findProgramAddressSync(
                [Buffer.from("airdrop")],
                programId
            );

            const airdropAccount = await program.account.airdrop.fetch(
                airdropPDA
            );

            console.log(airdropAccount.allocations);

            // Find the user's allocation
            const allocation = airdropAccount.allocations.find(
                (alloc) =>
                    alloc.recipient.toBase58() ===
                    provider.wallet.publicKey.toBase58()
            );
            console.log(allocation.claimed);
            setEligibleBalance(
                allocation && !allocation.claimed
                    ? Number(allocation.amount.toString()) / 10 ** tokenDecimals
                    : 0
            );
            setcheckBalanceBtn(true);
        } catch (error) {
            console.log("Failed to fetch eligible balance:", error);
        }
    };

    const checkIfWalletIsConnected = async () => {
        try {
            const { solana } = window;
            if (solana) {
                if (solana.isPhantom) {
                    console.log("Phantom wallet found");
                    const response = await solana.connect({
                        onlyIfTrusted: true,
                    });
                    console.log(
                        "Connected with public key:",
                        response.publicKey.toString()
                    );
                    setWalletAddress(response.publicKey.toString());
                    await fetchEligibleBalance();
                }
            } else {
                alert("Solana wallet not found! Get a Phantom wallet");
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        const onLoad = async () => {
            await checkIfWalletIsConnected();
        };
        window.addEventListener("load", onLoad);
        return () => window.removeEventListener("load", onLoad);
    }, []);

    return (
        <>
            <div className="fixed top-0 left-0 right-0 z-50">
                <Navbar toast={toast} fetchBalance={fetchEligibleBalance} />
            </div>
            <main className="relative min-h-screen">
                <img
                    src="/bg2.png"
                    alt="Background"
                    className="absolute top-0 left-0 w-full h-full object-cover -z-10"
                />

                <aside className="lg:pt-[7%] pt-[16%] flex flex-col md:flex-row items-center justify-center gap-10 md:gap-32">
                    {/* Left Text */}
                    <article className="flex flex-col gap-3 items-center md:items-start text-center md:text-left">
                        <h1
                            className="font-outfit text-[50px] md:text-[130px] leading-tight font-bold text-white"
                            style={{
                                textShadow: `
                                -6px 0 0 #19362f, /* Left */
                                6px 0 0 #19362f, /* Right */
                                0 -6px 0 #19362f, /* Top */
                                0 6px 0 #19362f, /* Bottom */
                                -6px -6px 0 #19362f, /* Top-left */
                                6px -6px 0 #19362f, /* Top-right */
                                -6px 6px 0 #19362f, /* Bottom-left */
                                6px 6px 0 #19362f /* Bottom-right */
                            `,
                            }}
                        >
                            Take Your <br />
                            <span className="text-[#5ecb86]">AirDrop</span>
                        </h1>

                        <article className="flex flex-col gap-3 items-center md:items-start justify-start">
                            <button
                                disabled={
                                    !eligibleBalance || eligibleBalance == 0
                                }
                                onClick={claim}
                                className="px-6 py-2 font-outfit bg-[#5ECB86] text-black disabled:bg-[#909090] disabled:text-[#e5e5e5] disabled:cursor-not-allowed font-medium rounded shadow-sm border border-black w-[200px]"
                            >
                                Claim Your Airdrop
                            </button>

                            <div className="px-4 py-2 font-outfit text-white bg-[#19362f] font-bold rounded-lg shadow-md w-[200px] text-center border border-[#5ecb86]">
                                Eligible Tokens: {eligibleBalance || 0}
                            </div>
                        </article>
                    </article>

                    {/* Right Image */}
                    <img
                        src="/bird1.png"
                        className="w-[16rem] md:w-[20rem] object-contain"
                        alt="Bird"
                    />
                </aside>
            </main>
        </>
    );
};

export default Airdrop;
