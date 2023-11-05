"use client";
import useStore from "../store/useStore";
import { usePopupStore } from "../store/stores/usePopupStore";

const Dashboard: React.FC = () => {
    const selectedPopup = useStore(
        usePopupStore,
        (state) => state.selectedPopup,
    );

    return (
        <div className="flex flex-col">
            <div>Dashboard Student {selectedPopup}</div>
        </div>
    );
};

export default Dashboard;
