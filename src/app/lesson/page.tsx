"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { library } from "@fortawesome/fontawesome-svg-core";
import {
    FSAType,
    ResultType,
    getExercisesData,
} from "@/app/API/classes-service/lessons/functions";
import Button, { Color } from "@/app/components/Button/page";
import ProgressBar from "@/app/components/ProgressBar/page";
import { useEffect, useMemo, useState } from "react";
import useStore from "../store/useStore";
import { useUserStore } from "../store/stores/useUserStore";
import {
    getAnswersByExerciseId,
    getResultByUserAndFSAId,
    getRelevantByFSAId,
} from "../API/classes-service/exercises/FSA/functions";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import { TbClockHour12 } from "react-icons/tb";
import {
    getResultsByLessonAndUser,
    startExercise,
    submitExercise,
} from "../API/classes-service/results/functions";
import Dropdown, { DropdownSizes } from "../components/Dropdown/page";
import { TargetType, useTargetStore } from "../store/stores/useTargetStore";
import { getTargetsList } from "../API/classes-service/targets/functions";

library.add(faClock);

export default function Page() {
    const nextLessonId = useStore(useUserStore, (state) => state.nextLessonId);
    const userId = useStore(useUserStore, (state) => state.userId);

    const targetsList = useStore(useTargetStore, (state) => state.targets);

    const [exercisesData, setExercisesData] = useState<FSAType[]>([]);
    const [lessonResults, setLessonResults] = useState<ResultType[]>();
    const [exercisesIds, setExercisesIds] = useState<string[]>([]);
    const [currentExercise, setCurrentExercise] = useState<FSAType>();
    const [relevant, setRelevant] = useState<TargetType[]>([]);
    const [currentAnswers, setCurrentAnswers] = useState<TargetType[]>([]);
    const [currentResult, setCurrentResult] = useState<ResultType>();

    const [isExerciseStarted, setIsExerciseStarted] = useState<boolean>(false);

    const [timeRemaining, setTimeRemaining] = useState<{
        minutes: number;
        seconds: number;
    }>({ minutes: 0, seconds: 0 });

    const [selectedTarget, setSelectedTarget] = useState<number>();

    useEffect(() => {
        const fetchTargets = async () => {
            await getTargetsList();
        };
        const targetData = localStorage.getItem("targetsList");
        if (!targetData) {
            fetchTargets();
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            if (nextLessonId) {
                const response = await getExercisesData(nextLessonId);
                if (response.status === 500) {
                    setExercisesData([]);
                }
                setExercisesData(response);
            }
        };

        const fetchResultsList = async () => {
            if (nextLessonId && userId) {
                const response = await getResultsByLessonAndUser(
                    nextLessonId,
                    userId,
                );
                if (response) {
                    setLessonResults(response);
                }
            }
        };

        fetchData();
        fetchResultsList();
    }, [nextLessonId, userId]);

    useEffect(() => {
        exercisesData.map((exercise) =>
            !exercisesIds.includes(exercise._id)
                ? setExercisesIds((prevList) => [...prevList, exercise._id])
                : null,
        );
    }, [exercisesData]);

    useEffect(() => {
        if (lessonResults && exercisesData && exercisesData.length > 0) {
            if (lessonResults.length === 0) {
                setCurrentExercise(exercisesData[0]);
            } else {
                if (lessonResults[lessonResults.length - 1].score === -1) {
                    setCurrentExercise(exercisesData[lessonResults.length - 1]);
                    setCurrentResult(lessonResults[lessonResults.length - 1]);
                } else {
                    setCurrentExercise(exercisesData[lessonResults.length]);
                    setCurrentResult(undefined);
                }
            }
        }
    }, [exercisesData, lessonResults]);

    useEffect(() => {
        const fetchRelevantData = async () => {
            if (currentExercise) {
                const currentExerciseId = currentExercise._id;
                const response = await getRelevantByFSAId(currentExerciseId);
                if (response) setRelevant(response);
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

        // const fetchResultData = async () => {
        //     if (currentExercise && userId) {
        //         const currentExerciseId = currentExercise._id;
        //         const response = await getResultByUserAndFSAId(
        //             currentExerciseId,
        //             userId,
        //         );
        //         if (response !== 404) setCurrentResult(response);
        //     }
        // };

        fetchRelevantData();
        fetchAnswersData();
        // fetchResultData();
    }, [currentExercise, userId, isExerciseStarted]);

    useEffect(() => {
        if (currentResult && currentExercise) {
            if (currentResult.exerciseId === currentExercise._id) {
                if (currentResult.date && currentResult.score === -1) {
                    setIsExerciseStarted(true);
                } else setIsExerciseStarted(false);
            } else setIsExerciseStarted(false);
        } else setIsExerciseStarted(false);
    }, [currentResult, currentExercise]);

    useEffect(() => {
        console.log("nextLessonId", nextLessonId);
    }, [nextLessonId]);

    useEffect(() => {
        console.log("exercisesData", exercisesData);
    }, [exercisesData]);

    useEffect(() => {
        console.log("lessonResults", lessonResults);
    }, [lessonResults]);

    useEffect(() => {
        console.log("exercisesIds", exercisesIds);
    }, [exercisesIds]);

    useEffect(() => {
        console.log("currentExercise", currentExercise);
    }, [currentExercise]);

    useEffect(() => {
        console.log("relevant", relevant);
    }, [relevant]);

    useEffect(() => {
        console.log("currentAnswers", currentAnswers);
    }, [currentAnswers]);

    useEffect(() => {
        console.log("currentResult", currentResult);
    }, [currentResult]);

    useEffect(() => {
        console.log("isExerciseStarted", isExerciseStarted);
    }, [isExerciseStarted]);

    useEffect(() => {
        if (currentExercise) {
            const totalMinutesForExercise =
                currentExercise.firstTimeBuffer +
                currentExercise.secondTimeBuffer;

            setTimeRemaining({ minutes: totalMinutesForExercise, seconds: 0 });
        }
    }, [currentExercise]);

    useEffect(() => {
        if (
            currentExercise &&
            currentExercise.firstTimeBuffer &&
            currentExercise.secondTimeBuffer &&
            currentResult &&
            isExerciseStarted
        ) {
            console.log("started");
            const totalMinutesForExercise =
                currentExercise.firstTimeBuffer +
                currentExercise.secondTimeBuffer;

            const startDate = currentResult.date;
            const timerInterval = setInterval(() => {
                setTimeRemaining(() => {
                    const newTimeRemaining = calculateTimeRemaining(
                        startDate,
                        totalMinutesForExercise,
                    );
                    if (
                        newTimeRemaining.minutes === 0 &&
                        newTimeRemaining.seconds === 0
                    ) {
                        clearInterval(timerInterval); // Stop the loop when time is up
                    }
                    return newTimeRemaining;
                });
            }, 1000);

            return () => clearInterval(timerInterval);
        }
    }, [currentExercise, currentResult, isExerciseStarted]);

    useEffect(() => {
        console.log("timeRemaining", timeRemaining);
    }, [timeRemaining]);

    const startCurrentExercise = async (
        nextLessonId: string,
        exerciseId: string,
        userId: string,
    ) => {
        const response = await startExercise(nextLessonId, exerciseId, userId);
        if (response) {
            console.log("clicked");
            setIsExerciseStarted(true);
        }
    };

    const submitCurrentExercise = async (
        exerciseId: string,
        userId: string,
    ) => {
        if (currentResult) {
            const resultId = currentResult._id;
            const response = await submitExercise(resultId, exerciseId, userId);
            if (response) {
            }
        }
    };

    const calculateTimeRemaining = (pastDate: Date, minutes: number) => {
        const exerciseStartDate = new Date(pastDate).getTime();

        const finalTime = new Date(exerciseStartDate);
        finalTime.setMinutes(finalTime.getMinutes() + minutes);

        const now = new Date().getTime();

        const isTimePassed = finalTime.getTime() - now;
        console.log("isTimePassed", isTimePassed);
        if (isTimePassed <= 0) {
            // If the finalTime is in the past, set timeRemaining to 0
            return { minutes: 0, seconds: 0 };
        }

        const minutesRemaining = Math.floor(
            (isTimePassed % (1000 * 60 * 60)) / (1000 * 60),
        );
        const secondsRemaining = Math.floor(
            (isTimePassed % (1000 * 60)) / 1000,
        );

        return {
            minutes: minutesRemaining,
            seconds: secondsRemaining,
        };
    };

    return (
        <div className="relative w-full">
            {nextLessonId && currentExercise && relevant && userId ? (
                <div className="absolute inset-x-0 inset-y-0 w-full">
                    <div
                        className="absolute grid gap-0 h-screen
                    grid-cols-1 p-0 overflow-hidden w-full  top-0 left-0"
                        id="lesson-grid"
                    >
                        <div className="h-2">
                            <ProgressBar
                                totalNumOfExercises={exercisesIds.length}
                                numOfExercisesMade={exercisesIds.indexOf(
                                    currentExercise._id,
                                )}
                            />
                        </div>
                        <div className="flex flex-row w-full outline-none ">
                            <div className="relative w-[80%] h-full outline-none">
                                <div className="absolute h-full w-full font-semibold text-xl text-duoGray-darkest">
                                    <div className="grid grid-rows-[min-content] justify-center items-start text-center w-[80%] mx-auto 3xl:h-fit">
                                        <div className="w-full text-left">
                                            {currentExercise.description}
                                        </div>
                                        <span className="flex items-end mt-10 font-extrabold text-2xl tracking-wider">
                                            Relevant list:
                                        </span>
                                        <div
                                            className={`self-center items-end w-full mx-auto flex flex-row my-4 cursor-default`}
                                            // grid grid-col-1 gap-[5rem]
                                        >
                                            {relevant.map(
                                                (
                                                    relevantTarget,
                                                    relevantTargetIndex,
                                                ) => (
                                                    <div
                                                        key={
                                                            relevantTargetIndex
                                                        }
                                                        className="flex flex-row items-end self-end mr-5"
                                                    >
                                                        <div className="relative flex items-center self-end">
                                                            <div
                                                                className={
                                                                    " border-2 border-b-4 rounded-xl w-[8rem] py-4 border-border-duoGray-regular font-bold text-duoGray-dark text-lg"
                                                                }

                                                                // ${
                                                                // absolute cursor-pointer hover:bg-duoGray-lighter active:border-b-2 active:translate-y-[1px]
                                                                //     relevantTargetIndex ===
                                                                //     selectedTarget
                                                                //         ? "bg-duoBlue-lightest border-duoBlue-dark text-duoBlue-text"
                                                                //         : "border-border-duoGray-regular hover:bg-duoGray-lighter"
                                                                // }
                                                            >
                                                                {/* <span
                                                                    className={`
                                                                h-[30px] w-[30px] border-2 rounded-lg absolute left-3 inline-flex items-center justify-center shrink-0 text-lg font-bold text-duoGray-dark`}
                                                                    // ${
                                                                    //     relevantTargetIndex ===
                                                                    //     selectedTarget
                                                                    //         ? "border-duoBlue-dark text-duoBlue-text"
                                                                    //         : ""
                                                                    // }
                                                                    // `}
                                                                >
                                                                    {relevantTargetIndex +
                                                                        1}
                                                                </span> */}

                                                                <span className="ml-[12px] mr-[14px] flex items-center justify-center relative text-center text-ellipsis">
                                                                    {
                                                                        relevantTarget.name
                                                                    }
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                        <span className="flex items-end mt-10 font-extrabold text-2xl tracking-wider">
                                            Select target:
                                        </span>
                                        {targetsList ? (
                                            <Dropdown
                                                placeholder={"target"}
                                                items={targetsList.map(
                                                    (target) => target.name,
                                                )}
                                                value={""}
                                                onChange={() => console.log("")}
                                                isDisabled={!isExerciseStarted}
                                                size={DropdownSizes.SMALL}
                                                className={
                                                    "w-[16rem] mt-5 z-10"
                                                }
                                            />
                                        ) : (
                                            <Dropdown
                                                placeholder={"target"}
                                                items={[""]}
                                                value={""}
                                                onChange={() => console.log("")}
                                                isDisabled={!isExerciseStarted}
                                                size={DropdownSizes.SMALL}
                                                className={
                                                    "w-[16rem] mt-5 z-10"
                                                }
                                            />
                                        )}
                                        {/* </div> */}
                                        {/* </div> */}
                                    </div>
                                </div>
                            </div>
                            <div className="h-full w-[20%] flex flex-col justify-start items-center text-center">
                                <div className="w-[80%] border-2 rounded-2xl py-6 px-4 text-duoGray-darker flex flex-col">
                                    <span className="font-extrabold  md:text-xl xl:text-2xl 3xl:mb-12 xl:mb-6  3xl:text-4xl">
                                        Unit 1 - Level 1
                                        <br className="3xl:text-4xl" />
                                        Lesson 1
                                    </span>
                                    <div className="font-bold flex flex-row items-center justify-center text-3xl 3xl:text-4xl">
                                        <TbClockHour12
                                            className={
                                                timeRemaining.minutes === 0 &&
                                                timeRemaining.seconds === 0
                                                    ? "text-duoRed-default fill-duoRed-light opacity-100 mx-2"
                                                    : isExerciseStarted
                                                    ? "animate-spin text-duoPurple-default fill-duoPurple-lighter opacity-100 mx-2"
                                                    : "text-duoPurple-default fill-duoPurple-lighter opacity-100 mx-2"
                                            }
                                            size={45}
                                        />
                                        <span className="">
                                            {timeRemaining.minutes < 10
                                                ? `0${timeRemaining.minutes}`
                                                : timeRemaining.minutes}
                                            :
                                            {timeRemaining.seconds < 10
                                                ? `0${timeRemaining.seconds}`
                                                : timeRemaining.seconds}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="relative flex items-center justify-center mb-5 3xl:mb-10">
                            <div className="absolute bottom-0 active:-translate-y-1">
                                {isExerciseStarted ? (
                                    <Button
                                        label={"SUBMIT"}
                                        color={Color.purple}
                                        style={
                                            "w-[15rem] 3xl:w-[20rem] text-2xl tracking-widest"
                                        }
                                        onClick={() => {
                                            submitCurrentExercise(
                                                currentExercise._id,
                                                userId,
                                            );
                                        }}
                                    />
                                ) : (
                                    <Button
                                        label={"START CLOCK"}
                                        color={Color.green}
                                        style={
                                            "w-[20rem] 3xl:w-[30rem] text-2xl tracking-widest"
                                        }
                                        onClick={() => {
                                            startCurrentExercise(
                                                nextLessonId,
                                                currentExercise._id,
                                                userId,
                                            );
                                        }}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div>lesson not found.</div>
            )}
        </div>
    );
}
