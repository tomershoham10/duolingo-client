"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { DndContext, DragEndEvent, closestCenter } from "@dnd-kit/core";
import {
    SortableContext,
    arrayMove,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { TbClockHour12 } from "react-icons/tb";
import { FaXmark } from "react-icons/fa6";
import { FiFlag } from "react-icons/fi";

// import { FaCircleXmark } from "react-icons/fa6";

import Button, { Color } from "@/app/components/Button/page";
import Alert from "@/app/components/Alert/page";
import ProgressBar from "@/app/components/ProgressBar/page";
import Dropdown, { DropdownSizes } from "@/app/components/Dropdown/page";

import useStore from "../store/useStore";
import { useUserStore } from "../store/stores/useUserStore";
import { TargetType, useTargetStore } from "../store/stores/useTargetStore";
import { AlertSizes, useAlertStore } from "../store/stores/useAlertStore";

import {
    FSAType,
    ResultType,
    getExercisesData,
} from "@/app/API/classes-service/lessons/functions";
import {
    getAnswersByExerciseId,
    getRelevantByFSAId,
} from "../API/classes-service/exercises/FSA/functions";
import {
    getResultsByLessonAndUser,
    startExercise,
    submitExercise,
} from "../API/classes-service/results/functions";
import { getTargetsList } from "../API/classes-service/targets/functions";
import SortableItem from "../components/SortableItem/page";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { updateNextLessonIdForUser } from "../API/users-service/users/functions";

library.add(faCircleXmark);
export default function Page() {
    const router = useRouter();

    const nextLessonId = useStore(useUserStore, (state) => state.nextLessonId);
    const userId = useStore(useUserStore, (state) => state.userId);
    const targetsList = useStore(useTargetStore, (state) => state.targets);

    const addAlert = useAlertStore.getState().addAlert;

    const [exercisesData, setExercisesData] = useState<FSAType[]>([]);
    const [lessonResults, setLessonResults] = useState<ResultType[]>();
    const [exercisesIds, setExercisesIds] = useState<string[]>([]);
    const [numOfExercisesMade, setNumOfExercisesMade] = useState<number>(0);
    const [currentExercise, setCurrentExercise] = useState<FSAType>();
    const [relevant, setRelevant] = useState<TargetType[]>([]);
    const [currentAnswers, setCurrentAnswers] = useState<TargetType[]>([]);
    const [currentResult, setCurrentResult] = useState<ResultType>();
    const [score, setScore] = useState<number>(0);

    const [isExerciseStarted, setIsExerciseStarted] = useState<boolean>(false);
    const [isExerciseFinished, setIsExerciseFinished] =
        useState<boolean>(false);

    const [timeRemaining, setTimeRemaining] = useState<{
        minutes: number;
        seconds: number;
    }>({ minutes: 0, seconds: 0 });

    const [selectedTargetIndex, setSelectedTargetIndex] = useState<number>(-1);
    const [targetsToSubmit, setTargetsToSubmit] = useState<
        { id: string; name: string }[]
    >([]);
    const [targetFromDropdown, setTargetFromDropdown] =
        useState<TargetType | null>(null);
    const [showPlaceholder, setShowPlaceholder] = useState<boolean>(true);

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
    }, [nextLessonId, userId, isExerciseStarted]);

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
        if (currentExercise) {
            // if (
            //     exercisesIds.indexOf(currentExercise._id) + 1 ===
            //         exercisesIds.length &&
            //     isExerciseFinished
            // ) {
            //     setNumOfExercisesMade(exercisesIds.length);
            // }
            // {
            console.log(
                isExerciseFinished,
                exercisesIds.indexOf(currentExercise._id),
            );
            if (!isExerciseFinished) {
                setNumOfExercisesMade(
                    exercisesIds.indexOf(currentExercise._id),
                );
            } else {
                setNumOfExercisesMade(
                    exercisesIds.indexOf(currentExercise._id) + 1,
                );
            }
            // }
        }

        fetchRelevantData();
        fetchAnswersData();
        // fetchResultData();
    }, [
        currentExercise,
        userId,
        isExerciseStarted,
        isExerciseFinished,
        exercisesIds,
    ]);

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
        console.log(
            "started1",
            currentExercise,
            currentExercise?.firstTimeBuffer,
            currentExercise?.secondTimeBuffer,
            currentResult,
            isExerciseStarted,
        );
        if (
            currentExercise &&
            currentExercise.firstTimeBuffer &&
            currentExercise.secondTimeBuffer &&
            currentResult &&
            isExerciseStarted &&
            !isExerciseFinished
        ) {
            console.log("started2");
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
    }, [currentExercise, currentResult, isExerciseStarted, isExerciseFinished]);

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

    const handleTargetsDropdown = (selectedTargetName: string) => {
        setSelectedTargetIndex(-1);
        setShowPlaceholder(false);

        if (targetsList) {
            const selectedTarget = targetsList.find(
                (target) => target.name === selectedTargetName,
            );

            if (selectedTarget) {
                console.log("TargetFromDropdown", selectedTarget);
                setTargetFromDropdown(selectedTarget);
            }
        }
    };

    const addTarget = () => {
        const targetsIdsList = targetsToSubmit.map((target) =>
            target ? target.id : null,
        );
        if (
            selectedTargetIndex !== -1 &&
            !targetsIdsList.includes(relevant[selectedTargetIndex]._id)
        ) {
            const _id = relevant[selectedTargetIndex]._id;
            const name = relevant[selectedTargetIndex].name;

            setTargetsToSubmit((pervTargets) => [
                ...pervTargets,
                { id: _id, name: name },
            ]);

            console.log("selectedTarget", relevant[selectedTargetIndex]);
            setSelectedTargetIndex(-1);

            // setShowPlaceholder(true);
        } else if (
            targetFromDropdown &&
            !targetsIdsList.includes(targetFromDropdown._id)
        ) {
            const _id = targetFromDropdown._id;
            const name = targetFromDropdown.name;

            setTargetsToSubmit((pervTargets) => [
                ...pervTargets,
                { id: _id, name: name },
            ]);
            // setTargetsToSubmit((pervTargets) => [
            //     ...pervTargets,
            //     targetFromDropdown,
            // ]);
            setTargetFromDropdown(null);
            setShowPlaceholder(true);
        } else {
            addAlert("The target has already been selected.", AlertSizes.small);
        }
    };
    const [grabbedTargetId, setGrabbedTargetId] = useState<string>();

    const handleDragMove = (event: DragEndEvent) => {
        const { active, over } = event;
        console.log("ids", active.id, over?.id);
        if (over && active.id !== over.id) {
            setTargetsToSubmit((items) => {
                console.log("items2", items);
                const ids = items.map((item) => item.id);
                const activeIndex = ids.indexOf(active.id as string);
                const overIndex = ids.indexOf(over.id as string);
                return arrayMove(items, activeIndex, overIndex);
            });
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setGrabbedTargetId("released");

        if (over && active.id !== over.id) {
            setTargetsToSubmit((items) => {
                const ids = items.map((item) => item.id);
                const activeIndex = ids.indexOf(active.id as string);
                const overIndex = ids.indexOf(over.id as string);
                return arrayMove(items, activeIndex, overIndex);
            });
        }
    };

    const submitCurrentExercise = async (
        exerciseId: string,
        userId: string,
    ) => {
        if (targetsToSubmit.length === 0) {
            addAlert("Please select a target.", AlertSizes.small);
            return;
        }
        if (currentResult && currentExercise) {
            const resultId = currentResult._id;
            console.log(
                "submit exercise",
                "resultId: ",
                resultId,
                "currentExercise: ",
                currentExercise,
                "userId: ",
                userId,
                "targetsToSubmit: ",
                targetsToSubmit,
                "timeRemaining: ",
                timeRemaining,
            );
            const answersIds = currentExercise.answers;
            const correctAnswers = targetsToSubmit.filter((target) =>
                answersIds.includes(target.id),
            );
            if (correctAnswers.length === 0) {
                //all tragets was guessed wrong
                setScore(0);
            } else if (correctAnswers.length === answersIds.length) {
                //all tragets was guessed right
                //need to check the order of the answers (? - maybe the order doesn't matter)
                // if the order was indeed matter + correct
            } else if (targetsToSubmit.length > answersIds.length) {
                //was correct but guessed more targets that needed
                //need to check the order of the answers
            } else if (correctAnswers.length < answersIds.length) {
                //was correct but didnt guessed all targets in the exercise
                //need to check the order of the answers
            }

            const resultToSubmit = {
                _id: resultId,
                userId: userId,
                lessonId: nextLessonId,
                exerciseId: currentExercise._id,
                answers: answersIds,
                score: score,
            };

            const response = await submitExercise(resultToSubmit);
            if (response) {
                setIsExerciseFinished(true);
                // const lengthOfLesson = exercisesData.length;
                // const indexOfCurrentExercise =
                //     exercisesData.indexOf(currentExercise);
                // console.log(
                //     "lengthOfLesson",
                //     lengthOfLesson,
                //     indexOfCurrentExercise,
                // );

                // if (lengthOfLesson === indexOfCurrentExercise + 1) {
                //     //finish lesson
                //     console.log("finished");
                //     addAlert("lesson finished", AlertSizes.small);
                // }
                // if (lengthOfLesson > indexOfCurrentExercise + 1) {
                //     setCurrentExercise(
                //         exercisesData[indexOfCurrentExercise + 1],
                //     );
                // }
            }
        }
    };

    const continueLesson = async () => {
        if (currentExercise && userId) {
            const lengthOfLesson = exercisesData.length;
            const indexOfCurrentExercise =
                exercisesData.indexOf(currentExercise);
            console.log(
                "lengthOfLesson",
                lengthOfLesson,
                indexOfCurrentExercise,
            );
            if (lengthOfLesson === indexOfCurrentExercise + 1) {
                //last exercise
                console.log("last exercise");
                const response = await updateNextLessonIdForUser(userId);
                console.log("last exercise- response", response);
                if (response) {
                    router.push("/learn");
                }
            } else {
                setCurrentExercise(exercisesData[indexOfCurrentExercise + 1]);
            }
        }
    };

    return (
        <div className="relative w-full">
            <Alert />
            {nextLessonId && currentExercise && relevant && userId ? (
                <div className="absolute inset-x-0 inset-y-0">
                    <div
                        className="absolute gap-0 w-full h-screen
                     p-0 overflow-hidden top-0 left-0"
                        id="lesson-grid"
                    >
                        <div className="w-full h-full" id="exrcise-grid">
                            <ProgressBar
                                totalNumOfExercises={exercisesIds.length}
                                numOfExercisesMade={numOfExercisesMade}
                            />
                            <div className="flex flex-row w-full outline-none">
                                <div className="relative w-full h-full outline-none">
                                    <div className="absolute h-full w-full font-semibold text-duoGray-darkest">
                                        <div className="grid grid-rows-[min-content] justify-center items-start text-center w-[80%] mx-auto 3xl:h-fit">
                                            <div className="w-full text-left sm:text-sm xl:text-xl 3xl:text-2xl">
                                                {currentExercise.description}
                                            </div>
                                            <span className="flex items-end sm:mt-6 xl:mt-10 font-extrabold sm:text-lg xl:text-2xl tracking-wider">
                                                Relevant list:
                                            </span>
                                            <div
                                                className={`self-center items-end w-full mx-auto flex flex-row mt-4 cursor-default`}
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
                                                                    className={`border-2 border-b-4 rounded-xl sm:min-w-[7rem] lg:min-w-[10rem] py-4 pl-[45px] pr-[30px] 
                                                                border-border-duoGray-regular font-bold flex flex-row justify-center items-center
                                                                text-lg  ${
                                                                    isExerciseStarted
                                                                        ? !isExerciseFinished
                                                                            ? "active:border-b-2 active:translate-y-[1px] cursor-pointer"
                                                                            : "cursor-default"
                                                                        : "cursor-default"
                                                                }
                                                               ${
                                                                   isExerciseStarted &&
                                                                   !isExerciseFinished &&
                                                                   relevantTargetIndex ===
                                                                       selectedTargetIndex
                                                                       ? "bg-duoBlue-lightest border-duoBlue-dark text-duoBlue-text"
                                                                       : "border-border-duoGray-regular hover:bg-duoGray-lighter text-duoGray-dark"
                                                               }
                                                                `}
                                                                    onClick={() => {
                                                                        if (
                                                                            !isExerciseFinished &&
                                                                            isExerciseStarted
                                                                        ) {
                                                                            setSelectedTargetIndex(
                                                                                relevantTargetIndex,
                                                                            );
                                                                            setTargetFromDropdown(
                                                                                null,
                                                                            );
                                                                        }
                                                                    }}
                                                                >
                                                                    <span
                                                                        className={`lg:h-[30px] lg:w-[30px] sm:h-[25px] sm:w-[25px] border-2 rounded-lg absolute left-3 
                                                                    inline-flex items-center justify-center shrink-0 sm:text-sm xl:text-xl font-bold                                                                     
                                                                    ${
                                                                        isExerciseStarted &&
                                                                        !isExerciseFinished &&
                                                                        relevantTargetIndex ===
                                                                            selectedTargetIndex
                                                                            ? "border-duoBlue-dark text-duoBlue-text"
                                                                            : "text-duoGray-dark"
                                                                    }
                                                                    `}
                                                                    >
                                                                        {relevantTargetIndex +
                                                                            1}
                                                                    </span>

                                                                    <span className="flex items-center justify-center relative text-center text-ellipsis sm:text-lg lg:text-xl">
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
                                            <span className="flex items-end sm:mt-6 xl:mt-10 font-extrabold sm:text-lg xl:text-2xl tracking-wider">
                                                Select target:
                                            </span>
                                            {targetsList ? (
                                                <Dropdown
                                                    placeholder={"target"}
                                                    items={targetsList.map(
                                                        (target) => target.name,
                                                    )}
                                                    value={
                                                        showPlaceholder
                                                            ? null
                                                            : targetFromDropdown
                                                            ? targetFromDropdown.name
                                                            : null
                                                    }
                                                    onChange={
                                                        handleTargetsDropdown
                                                    }
                                                    isDisabled={
                                                        !isExerciseStarted ||
                                                        isExerciseFinished
                                                    }
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
                                                    onChange={() =>
                                                        console.log("")
                                                    }
                                                    isDisabled={
                                                        !isExerciseStarted
                                                    }
                                                    size={DropdownSizes.SMALL}
                                                    className={
                                                        "w-[16rem] mt-5 z-10"
                                                    }
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col justify-start items-center right-0">
                            <div className="w-[80%] mt-5 border-2 rounded-2xl sm:py-2 sm:px-1 xl:py-6 xl:px-4 text-duoGray-darker flex text-center flex-col mb-3 3xl:mb-5">
                                <span className="font-extrabold lg:block sm:hidden md:text-xl xl:text-2xl 3xl:mb-12 xl:mb-6  3xl:text-4xl">
                                    Unit 1 - Level 1
                                    <br className="3xl:text-4xl" />
                                    Lesson 1
                                </span>
                                <div className="font-bold flex flex-row items-center justify-center sm:text-xl xl:text-2xl 3xl:text-4xl">
                                    <TbClockHour12
                                        className={
                                            timeRemaining.minutes === 0 &&
                                            timeRemaining.seconds === 0
                                                ? "text-duoRed-default fill-duoRed-light opacity-100 mx-2 sm:text-3xl xl:text-4xl"
                                                : isExerciseStarted &&
                                                  !isExerciseFinished
                                                ? "animate-spin text-duoPurple-default fill-duoPurple-lighter opacity-100 mx-2 sm:text-3xl xl:text-4xl"
                                                : "text-duoPurple-default fill-duoPurple-lighter opacity-100 mx-2 sm:text-3xl xl:text-4xl"
                                        }
                                    />
                                    <span className="font-extrabold">
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
                            {targetsToSubmit.length > 0 ? (
                                <div className="w-[80%] flex h-fit border-2 rounded-2xl py-6 px-4">
                                    <div className="w-full h-fit text-duoGray-darker flex flex-col justify-start items-center">
                                        <span className="w-full font-extrabold md:text-xl xl:text-2xl 3xl:mb-12 xl:mb-6 3xl:text-4xl self-start">
                                            Suspected targets
                                        </span>
                                        <div className="w-full h-fit">
                                            <div className="font-bold flex flex-col w-full h-fit items-center justify-center text-3xl 3xl:text-4xl">
                                                <DndContext
                                                    collisionDetection={
                                                        closestCenter
                                                    }
                                                    onDragStart={(
                                                        event: DragEndEvent,
                                                    ) => {
                                                        const { active } =
                                                            event;
                                                        setGrabbedTargetId(
                                                            active.id.toString(),
                                                        );
                                                    }}
                                                    onDragMove={handleDragMove}
                                                    onDragEnd={handleDragEnd}
                                                >
                                                    <SortableContext
                                                        items={targetsToSubmit}
                                                        strategy={
                                                            verticalListSortingStrategy
                                                        }
                                                    >
                                                        <div className="h-full w-full flex flex-col items-center justify-center">
                                                            {targetsToSubmit.map(
                                                                (
                                                                    targetObject,
                                                                    targetObjectIndex,
                                                                ) => (
                                                                    <SortableItem
                                                                        id={
                                                                            targetObject.id
                                                                        }
                                                                        name={
                                                                            targetObject.name
                                                                        }
                                                                        key={
                                                                            targetObjectIndex
                                                                        }
                                                                        isGrabbed={
                                                                            grabbedTargetId
                                                                                ? grabbedTargetId ===
                                                                                  targetObject.id
                                                                                : false
                                                                        }
                                                                        isDisabled={
                                                                            isExerciseFinished
                                                                        }
                                                                    />
                                                                ),
                                                            )}
                                                        </div>
                                                    </SortableContext>
                                                </DndContext>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : null}
                        </div>

                        <div
                            className={
                                isExerciseFinished
                                    ? score === 100
                                        ? "relative flex items-center justify-center col-span-2 bg-duoGreen-lighter"
                                        : score === 0
                                        ? "relative flex items-center justify-center col-span-2 bg-duoRed-lighter"
                                        : "relative flex items-center justify-center col-span-2 bg-duoOrange-lighter"
                                    : "relative flex items-center justify-center border-t-2 col-span-2"
                            }
                        >
                            <div
                                className={
                                    isExerciseStarted
                                        ? isExerciseFinished
                                            ? "absolute flex justify-between w-[55%] 3xl:w-[40%]"
                                            : "absolute flex justify-between w-[45%] 3xl:w-[30%]"
                                        : "absolute active:-translate-y-1"
                                }
                            >
                                {isExerciseFinished ? (
                                    score === 100 ? (
                                        <>
                                            <Button
                                                label={"CONTINUE"}
                                                color={Color.PURPLE}
                                                style={
                                                    "w-[20rem] 3xl:w-[30rem] text-2xl tracking-widest"
                                                }
                                                onClick={() => {
                                                    console.log("continue 100");
                                                }}
                                            />
                                        </>
                                    ) : score === 0 ? (
                                        <>
                                            <div className="flex flex-row h-full">
                                                <FaXmark className="pop-animation rounded-full bg-white fill-duoRed-buttonBorder text-7xl p-2 mr-4" />
                                                <div className="abolute flex flex-col justify-between text-duoRed-default">
                                                    <div>
                                                        <span className="text-2xl font-extrabold">
                                                            Correct answers:
                                                        </span>
                                                        <div className="text-md">
                                                            <ul>
                                                                {currentAnswers.map(
                                                                    (
                                                                        answer,
                                                                        answerKey,
                                                                    ) => (
                                                                        <li
                                                                            key={
                                                                                answerKey
                                                                            }
                                                                        >
                                                                            {answerKey !==
                                                                            0
                                                                                ? `, ${answer.name}`
                                                                                : answer.name}
                                                                        </li>
                                                                    ),
                                                                )}
                                                            </ul>
                                                        </div>
                                                        <button className="flex flex-row justify-start items-center">
                                                            <FiFlag className="-scale-x-100 mr-2" />
                                                            <span> report</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            <Button
                                                label={"CONTINUE"}
                                                color={Color.RED}
                                                style={
                                                    "w-[15rem] 3xl:w-[22rem] text-2xl tracking-widest"
                                                }
                                                onClick={continueLesson}
                                            />
                                        </>
                                    ) : (
                                        <>
                                            <Button
                                                label={"CONTINUE"}
                                                color={Color.ORANGE}
                                                style={
                                                    "w-[20rem] 3xl:w-[30rem] text-2xl tracking-widest"
                                                }
                                                onClick={() => {
                                                    console.log(
                                                        "continue 0<score<100",
                                                    );
                                                }}
                                            />
                                        </>
                                    )
                                ) : isExerciseStarted ? (
                                    <>
                                        <Button
                                            label={"ADD TARGET"}
                                            color={Color.BLUE}
                                            style={
                                                "w-[15rem] 3xl:w-[20rem] flex-none text-2xl tracking-widest"
                                            }
                                            onClick={() => {
                                                addTarget();
                                            }}
                                        />
                                        <Button
                                            label={"SUBMIT"}
                                            color={Color.GREEN}
                                            style={
                                                "w-[15rem] 3xl:w-[20rem] text-2xl flex-none tracking-widest"
                                            }
                                            onClick={() => {
                                                submitCurrentExercise(
                                                    currentExercise._id,
                                                    userId,
                                                );
                                            }}
                                        />
                                    </>
                                ) : (
                                    <Button
                                        label={"START CLOCK"}
                                        color={Color.PURPLE}
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
