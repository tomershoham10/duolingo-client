"use client";
import { LegacyRef, useEffect, useState } from "react";

import useStore from "@/app/store/useStore";
import { PopupsTypes, usePopupStore } from "@/app/store/stores/usePopupStore";
import Button, { Color } from "@/app/components/Button/page";
import { useRouter } from "next/navigation";

interface StartLessonPopup {
    numberOfLessonsMade: number | undefined;
    numberOfTotalLessons: number | undefined;
    nextLessonId: string | undefined;
    startLessonRef: LegacyRef<HTMLDivElement>;
}

const StartLessonPopup: React.FC<StartLessonPopup> = ({
    numberOfLessonsMade,
    numberOfTotalLessons,
    nextLessonId,
    startLessonRef,
}) => {
    console.log();
    const router = useRouter();

    const selectedPopup = useStore(
        usePopupStore,
        (state) => state.selectedPopup,
    );

    const [isOpen, setIsOpen] = useState<boolean>(false);

    useEffect(() => {
        selectedPopup === PopupsTypes.STARTLESSON
            ? setIsOpen(true)
            : setIsOpen(false);
    }, [selectedPopup]);
    console.log(
        "start lesson popup",
        numberOfLessonsMade && numberOfTotalLessons && nextLessonId,
    );

    return (
        <div
            className={`absolute z-20 top-[100%] left-1/2 ${
                isOpen ? "lesson-popup-open" : "lesson-popup-closed"
            }`}
            ref={startLessonRef}
            id="start-lesson"
        >
            <div className="relative">
                {numberOfLessonsMade && numberOfTotalLessons && nextLessonId ? (
                    numberOfLessonsMade === numberOfTotalLessons ? (
                        <div className="inline-flex">
                            <div className="absolute w-72 h-36 left-1/2 -translate-x-1/2 px-4 py-3 text-white font-extrabold tracking-wider bg-duoGreen-default rounded-2xl uppercase text-center">
                                <div className="absolute pt-2 pl-1 font-black">
                                    level up!
                                </div>
                                <Button
                                    label={"START"}
                                    color={Color.WHITE}
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
                        <div className="inline-flex">
                            <div className="absolute w-72 h-36 left-1/2 -translate-x-1/2 px-4 py-3 text-white font-extrabold tracking-wider bg-duoGreen-default rounded-2xl uppercase text-center">
                                <div className="absolute pt-2 pl-1 font-black">
                                    {`Lesson ${numberOfLessonsMade} of 
                                    ${numberOfTotalLessons}`}
                                </div>
                                <Button
                                    label={"START"}
                                    color={Color.WHITE}
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
                    )
                ) : null}
            </div>
        </div>
    );
};

export default StartLessonPopup;
