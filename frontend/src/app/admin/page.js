"use client";

import { AnchorProvider, BN, Program, utils, web3 } from "@coral-xyz/anchor";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import React, { useState } from "react";
import idl from "../../assets/idl.json";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

const programId = new PublicKey(idl.address);
const network = clusterApiUrl("devnet");
const opts = {
    preflightCommitment: "confirmed",
};

const Home = () => {
    const [recipients, setRecipients] = useState([{ address: "", amount: "" }]);
    const [message, setMessage] = useState("");
    const [totalTokensInput, setTotalTokensInput] = useState("");

    const getProvider = () => {
        const connection = new Connection(network, opts.preflightCommitment);
        const provider = new AnchorProvider(
            connection,
            window.solana,
            opts.preflightCommitment
        );
        return provider;
    };

    const initializeAirdrop = async () => {
        if (!totalTokensInput || isNaN(totalTokensInput)) {
            setMessage("Please enter a valid total tokens amount.");
            return;
        }

        const totalTokens = new BN(totalTokensInput);
        const provider = getProvider();
        const program = new Program(idl, provider);
        const [airdropPDA, bump] = PublicKey.findProgramAddressSync(
            [Buffer.from("airdrop")],
            programId
        );

        try {
            await program.methods
                .initializeAirdrop(totalTokens, bump)
                .accounts({
                    airdrop: airdropPDA,
                    admin: provider.publicKey,
                    systemProgram: web3.SystemProgram.programId,
                    tokenProgram: TOKEN_PROGRAM_ID,
                })
                .rpc();
            setMessage(
                `Airdrop initialized with address ${airdropPDA.toString()}`
            );
        } catch (error) {
            console.error(error);
            setMessage("Failed to initialize airdrop.");
        }
    };

    const setAllocation = async () => {
        const provider = getProvider();
        const program = new Program(idl, provider);
        const [airdropPDA, _] = PublicKey.findProgramAddressSync(
            [Buffer.from("airdrop")],
            programId
        );

        try {
            const recipientData = recipients.map((recipient) => ({
                address: new PublicKey(recipient.address),
                amount: new BN(recipient.amount),
            }));

            await program.methods
                .setAllocation(recipientData)
                .accounts({
                    airdrop: airdropPDA,
                    admin: provider.publicKey,
                })
                .rpc();
            setMessage("Allocation set successfully!");
        } catch (error) {
            console.error(error);
            setMessage("Failed to set allocation.");
        }
    };

    const handleRecipientChange = (index, field, value) => {
        const updatedRecipients = [...recipients];
        updatedRecipients[index][field] = value;
        setRecipients(updatedRecipients);
    };

    const addRecipient = () => {
        setRecipients([...recipients, { address: "", amount: "" }]);
    };

    const removeRecipient = (index) => {
        setRecipients((prevRecipients) =>
            prevRecipients.filter((_, i) => i !== index)
        );
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
            <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6 mb-8">
                <h2 className="text-xl font-bold text-gray-700 mb-4">
                    Initialize Airdrop
                </h2>
                <input
                    type="number"
                    placeholder="Total Tokens"
                    value={totalTokensInput}
                    onChange={(e) => setTotalTokensInput(e.target.value)}
                    className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <button
                    onClick={initializeAirdrop}
                    className="w-full px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
                >
                    Initialize Airdrop
                </button>
                {message && (
                    <p className="mt-4 text-center text-sm font-medium text-gray-700">
                        {message}
                    </p>
                )}
            </div>

            <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
                <h2 className="text-xl font-bold text-gray-700 mb-4">
                    Set Allocation
                </h2>
                {recipients.map((recipient, index) => (
                    <div
                        key={index}
                        className="flex flex-col md:flex-row items-center mb-4 space-y-2 md:space-y-0 md:space-x-4"
                    >
                        <input
                            type="text"
                            placeholder="Recipient Address"
                            value={recipient.address}
                            onChange={(e) =>
                                handleRecipientChange(
                                    index,
                                    "address",
                                    e.target.value
                                )
                            }
                            className="w-full md:w-2/3 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                        <input
                            type="number"
                            placeholder="Amount"
                            value={recipient.amount}
                            onChange={(e) =>
                                handleRecipientChange(
                                    index,
                                    "amount",
                                    e.target.value
                                )
                            }
                            className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                        <button
                            onClick={() => removeRecipient(index)}
                            className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition duration-300"
                        >
                            Remove
                        </button>
                    </div>
                ))}
                <div className="flex justify-between mt-4">
                    <button
                        onClick={addRecipient}
                        className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition duration-300"
                    >
                        Add Recipient
                    </button>
                    <button
                        onClick={setAllocation}
                        className="px-4 py-2 bg-purple-500 text-white font-semibold rounded-lg shadow-md hover:bg-purple-600 transition duration-300"
                    >
                        Set Allocation
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Home;
