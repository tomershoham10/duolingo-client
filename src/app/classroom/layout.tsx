"use client";
import AdminSideBar from "../components/Navigation/AdminSideBar/page";
import NavBar from "@/app/components/Navigation/NavBar/page";
import CreateNewUser from "../popups/CreateNewUser/page";
import CreateNewUnit from "@/app/popups/CreateNewUnit/page";
import Alert from "../components/Alert/page";
import InfoBar from "../components/InfoBar/page";
import useStore from "../store/useStore";
import { useUserStore, TypesOfUser } from "../store/stores/useUserStore";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const userRole = useStore(useUserStore, (state) => state.userRole);

    return (
        <section className="flex flex-row w-full">
            {userRole === TypesOfUser.ADMIN ? (
                <>
                    <Alert />
                    <AdminSideBar />
                    <CreateNewUser />
                    <CreateNewUnit />
                    <div className="flex flex-col w-full">
                        <NavBar />
                        <div className="flex flex-row w-full justify-between h-full">
                            {children}
                            <InfoBar />
                        </div>
                    </div>
                </>
            ) : (
                <>{userRole ? <h1>PERMISSION DENIED!</h1> : null}</>
            )}
        </section>
    );
}
