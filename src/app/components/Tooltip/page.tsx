"use client";
import { useEffect } from "react";
import useStore from "@/app/store/useStore";
import { PopupsTypes, usePopupStore } from "@/app/store/stores/usePopupStore";

const Tooltip: React.FC = () => {
    const selectedPopup = useStore(
        usePopupStore,
        (state) => state.selectedPopup,
    );

    useEffect(() => {
        const tooltipElement = document.getElementById("tooltip-main-div");

        if (tooltipElement && selectedPopup === PopupsTypes.CLOSED) {
            tooltipElement.classList.remove("tooltip");

            tooltipElement.classList.add("bounce-and-pop");
        }
    }, [selectedPopup]);
    return (
        <>
            {selectedPopup !== PopupsTypes.STARTLESSON ? (
                <div
                    id="tooltip-main-div"
                    className="tooltip absolute z-20 left-1/2"
                >
                    <div className="relative cursor-pointer">
                        <section className="inline-flex">
                            <div className="absolute px-3 py-2 bottom-full left-1/2 transform -translate-x-1/2 translate-y-[35%] text-white text-base font-extrabold tracking-wide bg-duoGreen-default rounded-xl border-2 border-white uppercase text-center">
                                <div>START</div>
                            </div>
                            <div className="absolute left-1/2 top-full transform -translate-x-1/2 -translate-y-[120%] rotate-45 bg-duoGreen-default h-4 w-4 origin-center text-transparent border-b-2 border-r-2 border-white rounded-sm">
                                <div className="origin-center"></div>
                            </div>
                        </section>
                    </div>
                </div>
            ) : null}
        </>
    );
};

export default Tooltip;
