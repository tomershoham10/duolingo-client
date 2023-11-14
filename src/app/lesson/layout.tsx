"use client";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <div className="flex flex-row w-full h-screen">{children}</div>;
}
