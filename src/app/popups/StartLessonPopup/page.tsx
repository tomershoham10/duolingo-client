"use client";
import { useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

import useStore from "@/app/store/useStore";
import { usePopupStore } from "@/app/store/stores/usePopupStore";
import Button, { Color } from "@/app/components/Button/page";
import { useRouter } from "next/navigation";

library.add(faXmark);

interface StartLessonPopup {
    numberOfLessonsMade: number | undefined;
    numberOfTotalLessons: number | undefined;
    nextLessonId: string | undefined;
}

const StartLessonPopup: React.FC<StartLessonPopup> = ({
    numberOfLessonsMade,
    numberOfTotalLessons,
    nextLessonId,
}) => {
    const router = useRouter();

    const selectedPopup = useStore(
        usePopupStore,
        (state) => state.selectedPopup,
    );
    const updateSelectedPopup = usePopupStore.getState().updateSelectedPopup;

    const startLessonElement = document.getElementById("start-lesson");
    const changecss = () => {
        if (startLessonElement) {
            startLessonElement.style.display = "none";
            startLessonElement.style.position = "fixed";
            startLessonElement.style.top = "0";
            startLessonElement.style.left = "0";
            startLessonElement.style.width = "100%";
            startLessonElement.style.height = "100%";
            startLessonElement.style.background = "rgba(0, 0, 0, 0.5)";
        }
    };
    return (
        <div className="absolute z-20 left-1/2" id="start-lesson">
            {selectedPopup === "START LESSON" ? (
                <div className="relative">
                    {numberOfLessonsMade &&
                    numberOfTotalLessons &&
                    nextLessonId ? (
                        numberOfLessonsMade === numberOfTotalLessons ? (
                            <div className="inline-flex ">
                                <div className="absolute bottom-full w-72 h-36 left-1/2 transform -translate-x-1/2 translate-y-[180%] px-4 py-3 text-white font-extrabold tracking-wider bg-duoGreen-default rounded-2xl uppercase text-center">
                                    <div className="absolute pt-2 pl-1 font-black">
                                        level up!
                                    </div>
                                    <Button
                                        label={"START"}
                                        color={Color.white}
                                        style={
                                            "relative inset-x-0 top-16 w-[90%] mx-auto"
                                        }
                                        onClick={() => router.push("/lesson")}
                                    />
                                    <div className="absolute left-1/2 top-full transform -translate-x-1/2 -translate-y-[945%] rotate-45 bg-duoGreen-default h-4 w-4 origin-center text-transparent rounded-sm">
                                        <div className="origin-center"></div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <p>
                                lesson {numberOfLessonsMade} of{" "}
                                {numberOfTotalLessons}
                            </p>
                        )
                    ) : null}
                </div>
            ) : null}
        </div>
    );
};

export default StartLessonPopup;
