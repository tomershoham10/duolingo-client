import "./globals.css";
import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import SideBar from "./components/Navigation/StudentSideBar/page";
import { UserProvider, useUserRole } from "./utils/context/UserContext";

const nunito = Nunito({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Train App",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <UserProvider>
                <body
                    className={`${nunito.className} flex mx-auto`}
                    suppressHydrationWarning={true}
                >
                    {children}
                </body>
            </UserProvider>
        </html>
    );
}
