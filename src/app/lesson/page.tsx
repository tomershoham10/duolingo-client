"use client";
import {
    FSAType,
    getExercisesData,
} from "@/app/API/classes-service/lessons/functions";
import Button, { Color } from "@/app/components/Button/page";
import ProgressBar from "@/app/components/ProgressBar/page";
import { useEffect, useState } from "react";
import useStore from "../store/useStore";
import { useUserStore } from "../store/stores/useUserStore";
import { getAnswersByExerciseId, getOptionsByExerciseId } from "../API/classes-service/exercises/FSA/functions";

export default function Page() {
    const nextLessonId = useStore(useUserStore, (state) => state.nextLessonId);

    const [exercisesData, setExercisesData] = useState<FSAType[]>([]);
    const [exercisesIds, setExercisesIds] = useState<string[]>([]);
    const [currentExercise, setCurrentExercise] = useState<FSAType>();
    const [currentOptions, setCurrentOptions] = useState<[]>([]);
    const [currentAnswers, setCurrentAnswers] = useState<[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            if (nextLessonId) {
                const response = await getExercisesData(nextLessonId);
                if (response.status === 500) {
                    setExercisesData([]);
                }
                setExercisesData(response);
                setCurrentExercise(response[0]);
            }
        };
        fetchData();
    }, [nextLessonId]);

    useEffect(() => {
        console.log("exercisesData", exercisesData);
        exercisesData.map((exercise) =>
            !exercisesIds.includes(exercise._id)
                ? setExercisesIds((pervList) => [...pervList, exercise._id])
                : null,
        );
    }, [exercisesData]);

    useEffect(() => {
        const fetchOptionsData = async () => {
            if (currentExercise) {
                const currentExerciseId = currentExercise._id;
                const response =
                    await getOptionsByExerciseId(currentExerciseId);
                if (response) setCurrentOptions(response);
            }
        };
        const fetchAnswersData = async () => {
            if (currentExercise) {
                const currentExerciseId = currentExercise._id;
                const response =
                    await getAnswersByExerciseId(currentExerciseId);
                if (response) setCurrentAnswers(response);
            }
        };
        fetchOptionsData();
        fetchAnswersData();
    }, [currentExercise]);

    useEffect(() => {
        console.log("currentExercise", currentExercise);
    }, [currentExercise]);

    useEffect(() => {
        console.log("exercisesIds", exercisesIds);
    }, [exercisesIds]);

    return (
        <div className="w-[85%] h-full flex flex-col justify-center mx-auto">
            {nextLessonId && currentExercise ? (
                <div className="w-full h-full flex flex-col justify-between items-center pb-12">
                    <div className="flex flex-col items-center">
                        <ProgressBar
                            totalNumOfExercises={exercisesIds.length}
                            numOfExercisesMade={exercisesIds.indexOf(
                                currentExercise._id,
                            )}
                        />
                        <div className="w-[85%] font-semibold text-xl text-duoGray-darkest">
                            <div>{currentExercise.description}</div>
                            <div>
                                {currentExercise.options.map(
                                    (optionId, optionIdIndex) => (
                                        <p key={optionIdIndex}>{optionId}</p>
                                    ),
                                )}
                            </div>
                        </div>
                    </div>
                    <Button
                        label={"START CLOCK"}
                        color={Color.green}
                        style={"w-[20rem]"}
                    />
                </div>
            ) : (
                <div>lesson not found.</div>
            )}
        </div>
    );
}
