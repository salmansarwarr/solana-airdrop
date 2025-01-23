import Navbar from "@/components/Navbar/Navbar";
import React from "react";
import { toast } from "react-toastify";

const Introduction = () => {
    return (
        <>
            <div className="fixed top-0 left-0 right-0 z-50">
                <Navbar toast={toast} />
            </div>
            <main className="relative min-h-screen">
                <img
                    src="/bg3.png"
                    alt="Background"
                    className="absolute top-0 left-0 w-full h-full object-cover -z-10"
                />

                <aside className="lg:pt-[7%] pt-[16%] px-4 sm:px-6 md:px-8 flex flex-col items-center gap-6 md:gap-10 pb-8">
                    <h1
                        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-SF_Collegiate text-center"
                        style={{
                            color: "white", // Ensures text color is white
                            textShadow: `-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000`, // Black outline
                        }}
                    >
                        Introduction
                    </h1>

                    <div className="w-full max-w-5xl">
                        <div className="backdrop-blur-md bg-white/30 border-2 md:border-4 border-black rounded-lg p-2 md:p-3 shadow-xl">
                            <div className="text-black">
                                <article className="flex flex-col gap-2 md:gap-3 font-semibold font-outfit text-sm sm:text-base md:text-lg">
                                    <p className="leading-relaxed">
                                        <span className="font-bold">
                                            Pump Prr:{" "}
                                        </span>
                                        is the heartbeat of the Pump.fun DAO, a
                                        token created to redefine engagement in
                                        the crypto space by combining
                                        decentralized innovation with a playful,
                                        community driven approach. The token's
                                        purpose is to reward loyal Pump.fun
                                        website users who contribute to the
                                        platform's vibrant ecosystem. In 2024,
                                        tokens will be meticulously airdropped
                                        to selected users, emphasizing active
                                        participation, creativity, and
                                        commitment.
                                    </p>

                                    <p className="leading-relaxed">
                                        Inspired by the precision of a parrot
                                        picking the juiciest fruits, the airdrop
                                        process ensures fairness and
                                        exclusivity, rewarding those who embody
                                        the values of the DAO. But Pump Prr is
                                        more than just a reward mechanism it's a
                                        gateway to the Prr verse, a dynamic
                                        world where gaming, memes, NFTs, and
                                        collaborative projects come together to
                                        create an unparalleled user experience.
                                    </p>

                                    <p className="leading-relaxed">
                                        With features like Pump Royale battles,
                                        scavenger hunts, and the Meme-to-Earn
                                        initiative, PRR turns engagement into
                                        entertainment, fostering an interactive
                                        and rewarding ecosystem. The token also
                                        unlocks access to exclusive merchandise,
                                        evolving NFT companions, and
                                        community-driven events, making it a
                                        cornerstone of the Pump.fun movement.
                                    </p>

                                    <p className="leading-relaxed">
                                        By creating a platform that merges fun,
                                        financial opportunities, and
                                        decentralization, PRR sets a new
                                        standard for crypto projects. It invites
                                        users to explore, play, and thrive in a
                                        community where rewards and creativity
                                        go hand in hand. This isn't just another
                                        token; it's a revolution in how
                                        decentralized communities connect and
                                        grow.
                                    </p>
                                </article>
                            </div>
                        </div>
                    </div>

                    <p className="text-gray-300 text-lg sm:text-xl md:text-2xl text-center font-[300] font-outfit mt-auto">
                        © 2025 Pump Prrrrr All Rights Reserved.
                    </p>
                </aside>
            </main>
        </>
    );
};

export default Introduction;
