"use client";
import AdminSideBar from "../components/Navigation/AdminSideBar/page";
import NavBar from "@/app/components/Navigation/NavBar/page";
import CreateNewUser from "../popups/CreateNewUser/page";
import CreateNewUnit from "@/app/popups/CreateNewUnit/page";
import Alert from "../components/Alert/page";
import InfoBar from "../components/InfoBar/page";
import useStore from "../store/useStore";
import { useUserStore, TypesOfUser } from "../store/stores/useUserStore";
import StudentSideBar from "../components/Navigation/StudentSideBar/page";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const userRole = useStore(useUserStore, (state) => state.userRole);

    return (
        <div className="flex flex-row w-full h-screen">
            {userRole !== TypesOfUser.ADMIN ? (
                <>
                    <Alert />
                    <StudentSideBar />
                    <div className="flex flex-col w-full h-screen">
                        <div className="flex flex-row h-full w-full justify-between overflow-hidden">
                            {children}
                            <InfoBar />
                        </div>
                    </div>
                </>
            ) : (
                <>{userRole ? <h1>PERMISSION DENIED!</h1> : null}</>
            )}
        </div>
    );
}
