"use client";
import { useContext } from "react";
import { useUserRole } from "@/app/utils/context/UserContext";
import { PopupContext } from "@/app/utils/context/PopupContext";
import CreateNewUser from "../popups/CreateNewUser/page";

const Dashboard: React.FC = () => {
    const userRole = useUserRole();
    const { selectedPopup } = useContext(PopupContext);
    return (
        <>
            {userRole === "admin" ? (
                <div className="flex flex-col">
                    <div>Dashboard Admin {selectedPopup}</div>
                </div>
            ) : (
                <div>Dashboard Not Admin</div>
            )}
        </>
    );
};

export default Dashboard;
