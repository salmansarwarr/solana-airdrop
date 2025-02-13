import "./globals.css";
import Navbar from "@/components/Navbar/Navbar";
import localFont from "next/font/local";
import { ToastContainer, toast } from "react-toastify";

const sfCollegiate = localFont({
    src: [
        {
            path: "../Utils/Fonts/SF_Collegiate_Solid.ttf",
            weight: "400",
            style: "normal",
        },
    ],
    variable: "--font-sf-collegiate",
});

export const metadata = {
    title: "Airdrop",
    description: "Generated by create next app",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={`${sfCollegiate.variable} relative`}>
                <ToastContainer />
                {children}
            </body>
        </html>
    );
}
