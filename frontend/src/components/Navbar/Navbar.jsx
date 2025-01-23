"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { Menu } from "lucide-react";

const links = [
    { id: 1, title: "Introduction", url: "/introduction" },
    { id: 2, title: "Airdrop", url: "/airdrop" },
];

const socials = [
    { id: 1, title: "Twitter", filename: "Twitter.png" },
    { id: 2, title: "Telegram", filename: "Telegram.png" },
    { id: 3, title: "Globe", filename: "Globe.png" },
    { id: 4, title: "Eagle", filename: "Eagle.png" },
];

function truncateString(str, maxLength) {
    if (str.length > maxLength) {
        return str.substring(0, maxLength) + "...";
    }
    return str;
}

const Navbar = ({ toast, fetchBalance }) => {
    const pathname = usePathname();
    const [checkWalletConnected, setCheckWalletConnected] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const [walletAddress, setWalletAddress] = useState();

    const connectWallet = async () => {
        const { solana } = window;
        if (solana) {
            const response = await solana.connect();
            console.log(
                "Connected with public key:",
                response.publicKey.toString()
            );
            toast.success(
                `Connected with public key: ${response.publicKey.toString()}`
            );
            if (fetchBalance) {
                await fetchBalance();
            }
            setWalletAddress(response.publicKey.toString());
        }
    };

    return (
        <nav className="relative">
            {/* Main Navbar */}
            <div className="flex items-center justify-between px-[3%] h-[80px] bg-transparent">
                <Link href="/" className="left">
                    <img
                        src="/pumpLogo.png"
                        className="object-cover w-[150px]"
                        alt="Logo"
                    />
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex center">
                    {links.map((link) => (
                        <Link
                            key={link.id}
                            className="text-xl mx-4 font-SF_Collegiate hover:text-gray-600 transition-colors"
                            href={link.url}
                            style={{
                                color: "white", // Ensures text color is white
                                textShadow: `-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000`, // Black outline
                            }}
                        >
                            {link.title}
                        </Link>
                    ))}
                </div>

                {/* Desktop Right Section */}
                <div className="hidden md:block">
                    {pathname === "/about" ? (
                        <div className="flex items-center gap-1">
                            {socials.map((social) => (
                                <img
                                    key={social.id}
                                    src={`/${social.filename}`}
                                    className="object-cover w-[40px]"
                                    alt={social.title}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex items-center gap-1">
                            <button
                                onClick={connectWallet}
                                className="px-4 py-2 flex items-center font-outfit bg-[#ffffff] text-[#000000] font-bold rounded shadow-sm border border-black hover:bg-gray-100 transition-colors"
                            >
                                <img
                                    src="/wallet.png"
                                    className="w-[20px] mr-3"
                                    alt="wallet"
                                />
                                {!walletAddress
                                    ? "Connect Wallet"
                                    : truncateString(walletAddress, 10)}
                            </button>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden p-2 bg-gray-100 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    <Menu size={24} />
                </button>
            </div>

            {/* Mobile Menu */}
            <div
                className={`md:hidden absolute w-full bg-white transition-all duration-300 ease-in-out ${
                    isMenuOpen
                        ? "max-h-screen opacity-100"
                        : "max-h-0 opacity-0 overflow-hidden"
                }`}
            >
                <div className="px-4 py-2 shadow-lg">
                    {/* Mobile Navigation Links */}
                    <div className="flex flex-col space-y-3">
                        {links.map((link) => (
                            <Link
                                key={link.id}
                                className="text-lg font-SF_Collegiate hover:text-gray-600 transition-colors"
                                href={link.url}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {link.title}
                            </Link>
                        ))}
                    </div>

                    {/* Mobile Right Section */}
                    <div className="mt-4 pt-4 border-t">
                        {pathname === "/about" ? (
                            <div className="flex items-center gap-2">
                                {socials.map((social) => (
                                    <img
                                        key={social.id}
                                        src={`/${social.filename}`}
                                        className="object-cover w-[35px]"
                                        alt={social.title}
                                    />
                                ))}
                            </div>
                        ) : (
                            <button
                                onClick={connectWallet}
                                className="w-full px-4 py-2 flex items-center justify-center font-outfit bg-[#ffffff] text-[#000000] font-bold rounded shadow-sm border border-black hover:bg-gray-100 transition-colors"
                            >
                                <img
                                    src="/wallet.png"
                                    className="w-[20px] mr-3"
                                    alt="wallet"
                                />
                                {!walletAddress
                                    ? "Connect Wallet"
                                    : truncateString(walletAddress, 10)}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
