"use client";
import AdminSideBar from "../components/Navigation/AdminSideBar/page";
import NavBar from "@/app/components/Navigation/NavBar/page";
import CreateNewUser from "../popups/CreateNewUser/page";
import CreateNewUnit from "@/app/popups/CreateNewUnit/page";
import Alert from "../components/Alert/page";
import InfoBar from "../components/InfoBar/page";
import useStore from "../store/useStore";
import { useUserStore, TypesOfUser } from "../store/stores/useUserStore";
import { useRouter } from "next/navigation";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const userRole = useStore(useUserStore, (state) => state.userRole);
    console.log(userRole);
    return (
        <div className="flex flex-row w-full h-screen">
            {userRole === TypesOfUser.ADMIN ? (
                <>
                    <Alert />
                    <AdminSideBar />
                    <CreateNewUser />
                    <CreateNewUnit />
                    <div className="flex flex-col w-full h-screen">
                        <NavBar />
                        <div className="flex flex-row h-full w-full justify-between overflow-hidden">
                            {children}
                            <InfoBar />
                        </div>
                    </div>
                </>
            ) : (
                <>
                    {userRole === TypesOfUser.LOGGEDOUT ? (
                        router.push("/login")
                    ) : (
                        <h1>PERMISSION DENIED!</h1>
                    )}
                </>
            )}
        </div>
    );
}
