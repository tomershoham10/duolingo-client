"use client";

import { useContext } from "react";
import { PopupContext } from "@/app/utils/context/PopupContext";
import useStore from "../store/useStore";
import { useUserStore, TypesOfUser } from "../store/stores/useUserStore";

const Dashboard: React.FC = () => {
    const userRole = useStore(useUserStore, (state) => state.userRole);

    const { selectedPopup } = useContext(PopupContext);
    return (
        <>
            {userRole === TypesOfUser.ADMIN ? (
                <div className="flex flex-col">
                    <div>Dashboard Admin {selectedPopup}</div>
                </div>
            ) : (
                <div className="flex flex-col">
                    <div>Dashboard Not Admin</div>
                </div>
            )}
        </>
    );
};

export default Dashboard;
