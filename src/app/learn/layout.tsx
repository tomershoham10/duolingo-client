"use client";
import Alert from "../components/Alert/page";
import InfoBar from "../components/InfoBar/page";
import StudentSideBar from "../components/Navigation/StudentSideBar/page";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-row w-full h-screen">
            <Alert />
            <StudentSideBar />
            <div className="flex flex-col w-full h-screen">
                <div className="flex flex-row h-full w-full justify-between overflow-hidden">
                    {children}
                    <InfoBar />
                </div>
            </div>
        </div>
    );
}
