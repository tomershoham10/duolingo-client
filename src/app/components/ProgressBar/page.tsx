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
                        className="h-full rounded-2xl bg-duoGreen-default"
                        style={{ width: `${newwidth}%` }}
                    >
                        {" "}
                        {newwidth}
                    </div>
                </div>
            ) : null}
        </div>
    );
};
export default ProgressBar;
