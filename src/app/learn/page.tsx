"use client";
import useStore from "../store/useStore";
import { usePopupStore } from "../store/stores/usePopupStore";
import UserUnitSection from "../components/UnitSection/UserUnit/page";

const Dashboard: React.FC = () => {
    const selectedPopup = useStore(
        usePopupStore,
        (state) => state.selectedPopup,
    );

    return (
        <div className="w-full flex flex-col justify-start items-center">
            <UserUnitSection />
        </div>
    );
};

export default Dashboard;
