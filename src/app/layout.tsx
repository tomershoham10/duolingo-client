"use client";
import "./globals.css";
import type { Metadata } from "next";
import { usePathname } from "next/navigation";
import { Nunito } from "next/font/google";
import SideBar from "./components/SideBar/page";

const nunito = Nunito({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Train App",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    console.log(pathname);
    return (
        <html lang="en">
            <body
                className={`${nunito.className} flex mx-auto`}
                suppressHydrationWarning={true}
            >
                {pathname === "/Login" ? (
                    <></>
                ) : (
                    <SideBar authLevel={"admin"} />
                )}
                {children}
            </body>
        </html>
    );
}
