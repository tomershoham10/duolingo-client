// import { ExercisesTypes } from "@/app/API/classes-service/exercises/functions";
// import { submitExercise } from "@/app/API/classes-service/results/functions";
// import { AlertSizes } from "@/app/store/stores/useAlertStore";
// import { LessonDispatchAction, lessonAction, lessonType } from "@/reducers/studentView/lessonReducer";
// import pRetry from "p-retry";
// import { Dispatch } from "react";

// export interface submitCurrentExerciseParams {
//     lessonState: lessonType,
//     lessonDispatch: Dispatch<LessonDispatchAction>,
//     addAlert: (message: string, size: AlertSizes, actionLabel?: string | undefined, action?: (() => Promise<void>) | undefined) => void,
//     userId: string,
//     nextLessonId: string
// }

// const submitCurrentExercise = async (params: submitCurrentExerciseParams): Promise<ResultType | null> => {
//     const { lessonState,
//         lessonDispatch,
//         addAlert,
//         userId,
//         nextLessonId
//     } = params
//     let scoreByTargets: number = -1;
//     let scoreByTime: number = -1;
//     // let totalScoreToSubmit: number = -1;
//     let totalScoreToSubmit: number = 100;

//     if (lessonState.targetsToSubmit.length === 0) {
//         addAlert('Please select a target.', AlertSizes.small);
//         return null;
//     }

//     if (!!!lessonState.currentResult || !!!lessonState.currentExercise) {
//         return null;
//     }


//     const resultId = lessonState.currentResult._id;
//     let answersIds: string[] = []
//     if (lessonState.currentExercise.type === ExercisesTypes.FSA) {
//         const currentExercise = lessonState.currentExercise as FsaType;
//         answersIds = currentExercise.targetsList || [];
//     }
    // console.log('answersIds', answersIds, answersIds?.length);
    // const correctAnswers = lessonState.targetsToSubmit.filter((target) =>
    //     answersIds?.includes(target.id)
    // );
    // console.log('correctAnswers', correctAnswers);
    // if (correctAnswers.length === 0) {
    //     //all tragets was guessed wrong
    //     totalScoreToSubmit = 0;
    //     scoreByTargets = 0;
    // } else if (
    //     answersIds && correctAnswers.length === answersIds.length &&
    //     lessonState.targetsToSubmit.length === answersIds.length
    // ) {
    //     scoreByTargets = 100;
    //     console.log('scoreByTargets', scoreByTargets);
    // } else if (answersIds && lessonState.targetsToSubmit.length > answersIds.length) {
    //     const firstAnswer: string = correctAnswers[0].id;
    //     if (answersIds.indexOf(firstAnswer) === 0) {
    //         scoreByTargets = 90;

    //         console.log('scoreByTargets', scoreByTargets);
    //     } else {
    //         scoreByTargets = 80;
    //         console.log('scoreByTargets', scoreByTargets);
    //     }
    // } else if (answersIds && correctAnswers.length < answersIds.length) {
    //     scoreByTargets = 85;
    //     console.log('scoreByTargets', scoreByTargets);
    // }
    // const timeBuffersMinutes = lessonState.currentExercise.timeBuffers.map(
    //     (timeBuffer) => timeBuffer.timeBuffer
    // );

    // const totalMinutesForExercise = timeBuffersMinutes.reduce(
    //     (accumulator, currentValue) => accumulator + currentValue,
    //     0
    // );

    //   if (
    //     totalMinutesForExercise > timeRemaining.minutes &&
    //     timeRemaining.minutes + timeRemaining.seconds / 60 >=
    //       currentExercise.secondTimeBuffer
    //   ) {
    //     scoreByTime = 100;
    //   } else if (
    //     currentExercise.secondTimeBuffer > timeRemaining.minutes &&
    //     timeRemaining.minutes + timeRemaining.seconds >= 0
    //   ) {
    //     scoreByTime = 75;
    //   } else {
    //     scoreByTime = 60;
    //   }

    // scoreByTime = 100;

    // totalScoreToSubmit !== 0
    //     ? (totalScoreToSubmit = 0.6 * scoreByTargets + 0.4 * scoreByTime)
    //     : null;
    // lessonDispatch({
    //     type: lessonAction.SET_TOTAL_SCORE,
    //     payload: totalScoreToSubmit,
    // });
    // if (
    //     totalScoreToSubmit === -1 ||
    //     scoreByTime === -1 ||
    //     scoreByTargets === -1
    // ) {
    //     console.log(
    //         'error',
    //         totalScoreToSubmit === -1,
    //         scoreByTime === -1,
    //         scoreByTargets === -1
    //     );
    //     addAlert('error', AlertSizes.small);
    //     return null;
    // }

    // const resultToSubmit = {
    //     _id: resultId,
    //     userId: userId,
    //     lessonId: nextLessonId,
    //     exerciseId: lessonState.currentExercise._id,
    //     answers: answersIds,
    //     score: totalScoreToSubmit,
    // };

    // const response = await submitExercise(resultToSubmit);
    // const response = await pRetry(
    //     () => submitExercise(resultToSubmit),
    //     {
    //         retries: 5,
    //     }
    // );
    // return response;
    // if (response) {
    //     lessonDispatch({ type: lessonAction.STOP_TIMER });
    // }
// };

// export default submitCurrentExercise;