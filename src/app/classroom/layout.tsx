"use client";
import AdminSideBar from "../components/Navigation/AdminSideBar/page";
import NavBar from "@/app/components/Navigation/NavBar/page";
import { CourseProvider } from "../utils/context/CourseConext";
import { PopupProvider } from "../utils/context/PopupContext";
import CreateNewUser from "../popups/CreateNewUser/page";
import Alert from "../components/Alert/page";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <CourseProvider>
            <PopupProvider>
                <section className="flex flex-row w-full">
                    <Alert />
                    <CreateNewUser />
                    <AdminSideBar />
                    <div className="flex flex-col w-full">
                        <NavBar />
                        {children}
                    </div>
                </section>
            </PopupProvider>
        </CourseProvider>
    );
}
