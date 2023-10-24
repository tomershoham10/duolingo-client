import "./globals.css";
import type { Metadata } from "next";
import { Nunito } from "next/font/google";
// import { Providers } from "./GlobalRedux/provider";
// import { UserProvider } from "./utils/context/UserContext";
import { AlertProvider } from "./utils/context/AlertContext";

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
            <AlertProvider>
                <body
                    className={`${nunito.className} flex mx-auto`}
                    suppressHydrationWarning={true}
                >
                    {children}
                </body>
            </AlertProvider>
        </html>
    );
}
