"use client";
import { useEffect, useState } from "react";

interface ProgressBarProps {
    totalNumOfExercises: number;
    numOfExercisesMade: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
    totalNumOfExercises,
    numOfExercisesMade,
}) => {
    const [newwidth, setNewwidth] = useState<string>("0");

    useEffect(() => {
        const width = (
            (100 * numOfExercisesMade) /
            totalNumOfExercises
        ).toString();
        setNewwidth(width);
    }, [totalNumOfExercises, numOfExercisesMade]);

    return (
        <div className="w-full px-10 py-5">
            {totalNumOfExercises > 0 ? (
                <div className="w-full rounded-2xl bg-duoGray-default h-4 text-transparent">
                    <div
                        className="relative h-full rounded-2xl bg-duoGreen-default flex justify-start items-center"
                        style={{
                            width: `${newwidth}%`,
                            transition: "width 0.5s ease-in-out 0.5s",
                        }}
                    >
                        <div className="w-[80%] mx-[10%] sm:w-[92%] sm:mx-[4%] md:w-full md:mx-2 mb-[2.5px]">
                            <div className="max-h-[5px] rounded-3xl w-full bg-duoGreen-light">
                                {" "}
                                {newwidth}
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
};
export default ProgressBar;
