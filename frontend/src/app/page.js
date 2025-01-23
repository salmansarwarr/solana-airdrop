"use client";

import React, { useEffect } from "react";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import idl from "../assets/idl.json";
import { AnchorProvider } from "@coral-xyz/anchor";
import { toast } from "react-toastify";
import Navbar from "@/components/Navbar/Navbar";

const programId = new PublicKey(idl.address);
const network = clusterApiUrl("devnet");
const opts = {
    preflightCommitment: "confirmed",
};

const Home = () => {
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
                <Navbar toast={toast} />
            </div>
            <main className="relative min-h-screen">
                <img
                    src="/bg1.png"
                    alt=""
                    className="absolute top-0 left-0 w-full h-full object-cover -z-10"
                />

                <div className="relative h-full flex justify-center flex-col items-center px-4 py-20 md:py-[5%]">
                    {/* Flying Birds - Hidden on mobile, visible on larger screens */}
                    <img
                        src="/bird1.png"
                        className="w-[3rem] object-cover absolute hidden md:block left-[10%] top-[20%] hover:scale-110 transition-transform"
                        alt=""
                    />
                    <img
                        src="/bird1.png"
                        className="w-[3rem] object-cover absolute hidden md:block right-[20%] top-[35%] hover:scale-110 transition-transform"
                        alt=""
                    />
                    <img
                        src="/bird1.png"
                        className="w-[3rem] object-cover absolute hidden md:block right-[10%] top-[30%] hover:scale-110 transition-transform"
                        alt=""
                    />
                    <img
                        src="/bird1.png"
                        className="w-[3rem] object-cover absolute hidden md:block left-[30%] bottom-[25%] hover:scale-110 transition-transform"
                        alt=""
                    />
                    <img
                        src="/bird1.png"
                        className="w-[3rem] object-cover absolute hidden md:block top-[24%] left-[22%] hover:scale-110 transition-transform"
                        alt=""
                    />

                    {/* Main Content */}
                    <img
                        src="/Pump_Prr.png"
                        className="w-full max-w-[300px] sm:max-w-[450px] md:max-w-[650px]"
                        alt=""
                    />
                    <img
                        src="/bird1.png"
                        className="w-[10rem] sm:w-[14rem] md:w-[19rem] object-cover"
                        alt=""
                    />

                    {/* Address Box */}
                    <div className="w-full max-w-4xl mx-auto bg-white rounded-xl border-2 md:border-[4px] border-black p-2 md:p-4 flex justify-between items-center mt-4">
                        <span className="text-sm sm:text-xl md:text-3xl font-SF_Collegiate truncate mr-2">
                            A7LnmGzQjMoX4Q4iGrSYK8on6ifVJ45wLKPMjfmVpump
                        </span>
                        <div className="rounded-xl border-2 border-black-200 p-1 md:p-2 flex-shrink-0">
                            <svg
                                className="w-3 h-3 md:w-4 md:h-4 text-black"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
                                />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Fixed bottom bar */}
                <div className="fixed bottom-0 left-0 right-0 py-2 md:py-4 bg-white/20 backdrop-blur-sm overflow-x-auto">
                    <div className="flex justify-start md:justify-center gap-4 md:gap-[140px] items-center px-4 md:px-0 min-w-max">
                        {[1, 2, 3, 4, 5].map((item) => (
                            <article
                                key={item}
                                className="flex items-center gap-2 md:gap-3"
                            >
                                <img
                                    src="/bird1.png"
                                    className="w-[30px] md:w-[40px]"
                                    alt=""
                                />
                                <img
                                    src="/Pump_Prr.png"
                                    className="w-[60px] md:w-[80px]"
                                    alt=""
                                />
                            </article>
                        ))}
                    </div>
                </div>
            </main>
        </>
    );
};

export default Home;
