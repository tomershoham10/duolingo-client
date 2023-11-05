"use client";
import { getExercisesData } from "@/app/API/classes-service/lessons/functions";
import ProgressBar from "@/app/components/ProgressBar/page";
import { useEffect, useState } from "react";

enum DifficultyLevel {
    Easy = "Easy",
    Medium = "Medium",
    Hard = "Hard",
}

interface FSAType {
    _id: string;
    filesKeys: string[];
    difficultyLevel: DifficultyLevel;
    options: string[];
    answers: string[]; //my be 2 correct answers
    firstTimeBuffer: number; //in minutes
    secondTimeBuffer: number; //in minutes
    description: string;
    dateCreated: Date;
}

export default function Page({ params }: { params: { id: string } }) {
    const lessonId = params.id.toString();
    const [exercises, setExercises] = useState<FSAType[] | null>([]);
    const [currentExercise, setCurrentExercise] = useState<FSAType>();
    const [totalNumOfExercises, setTotalNumOfExercises] = useState<number>(0);
    const [numOfExercisesMade, setNumOfExercisesMade] = useState<number>(0);

    useEffect(() => {
        const fetchData = async () => {
            if (lessonId) {
                const results = await getExercisesData(lessonId);
                setExercises(results);
            }
        };
        fetchData();
    }, [lessonId]);

    useEffect(() => {
        exercises ? setTotalNumOfExercises(exercises.length) : null;
    }, [exercises]);

    useEffect(() => {
        exercises
            ? console.log(
                  Object.values(exercises)[numOfExercisesMade],
                  numOfExercisesMade,
              )
            : null;
        exercises ? setCurrentExercise(exercises[numOfExercisesMade]) : null;
    }, [exercises, numOfExercisesMade]);

    return exercises === null ? (
        <h1>ERROR FETCHING THE LESSON!</h1>
    ) : (
        <div className="flex flex-col w-full">
            <ProgressBar
                totalNumOfExercises={totalNumOfExercises}
                numOfExercisesMade={numOfExercisesMade}
            />
            {currentExercise ? <div>{currentExercise.description}</div> : null}
        </div>
    );
}
