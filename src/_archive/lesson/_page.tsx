// 'use client';
// import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
// import { useRouter } from 'next/navigation';

// import { FaCheck, FaXmark } from 'react-icons/fa6';
// import { FiFlag } from 'react-icons/fi';

// import Button, { ButtonColors } from '@/components/Button/page';
// import ProgressBar from '@/components/ProgressBar/page';

// import useStore from '../store/useStore';
// import { useUserStore } from '../store/stores/useUserStore';
// import { AlertSizes, useAlertStore } from '../store/stores/useAlertStore';

// import { getExercisesData } from '@/app/API/classes-service/lessons/functions';
// import {
//   getResultsByLessonAndUser,
//   startExercise,
// } from '../API/classes-service/results/functions';
// import { updateNextLessonIdForUser } from '../API/users-service/users/functions';
// import {
//   lessonAction,
//   lessonReducer,
// } from '@/reducers/studentView/lessonReducer';
// import { draggingAction, draggingReducer } from '@/reducers/dragReducer';
// import submitCurrentExercise, {
//   submitCurrentExerciseParams,
// } from '../_utils/functions/lessonPage/submitCurrentExercise';
// import pRetry from 'p-retry';
// import { faFileArrowDown } from '@fortawesome/free-solid-svg-icons';
// import LessonInfo from '@/components/InfoBar/LessonInfo/page';
// import { useFetchTargets } from '../_utils/hooks/useFechTargets';

// const Lesson: React.FC = () => {
//   const router = useRouter();

//   const userStore = {
//     nextLessonId: useStore(useUserStore, (state) => state.nextLessonId),
//     userId: useStore(useUserStore, (state) => state.userId),
//   };
//   const addAlert = useAlertStore.getState().addAlert;
//   const targetsList = useFetchTargets();

//   const exerciseRef = useRef<HTMLDivElement | null>(null);
//   const infoBarRef = useRef<HTMLDivElement | null>(null);

//   const initialLessonState = {
//     exercisesData: [],
//     lessonResults: [],
//     exercisesIds: [],
//     numOfExercisesMade: 0, //0
//     currentExercise: null,
//     isExerciseStarted: false, //false
//     isExerciseFinished: false, //false
//     isExerciseSubmitted: false, //false
//     fadeEffect: true, //true
//   };

//   const [lessonState, lessonDispatch] = useReducer(
//     lessonReducer,
//     initialLessonState
//   );

//   const [isLoading, setIsLoading] = useState<boolean>(false);

//   const fetchData = useCallback(async () => {
//     const response = await pRetry(
//       () =>
//         userStore.nextLessonId
//           ? getExercisesData(userStore.nextLessonId)
//           : null,
//       {
//         retries: 5,
//       }
//     );
//     if (response && response.length > 0) {
//       console.log('SET_EXERCISES_DATA', response);
//       lessonDispatch({
//         type: lessonAction.SET_EXERCISES_DATA,
//         payload: response,
//       });
//     }
//   }, [userStore.nextLessonId]);

//   const fetchResultsList = useCallback(async () => {
//     const response = await pRetry(
//       () =>
//         userStore.nextLessonId && userStore.userId
//           ? getResultsByLessonAndUser(userStore.nextLessonId, userStore.userId)
//           : null,
//       {
//         retries: 5,
//       }
//     );
//     response
//       ? lessonDispatch({
//           type: lessonAction.SET_LESSON_RESULTS,
//           payload: response,
//         })
//       : null;
//   }, [userStore.nextLessonId, userStore.userId]);

//   useEffect(() => {
//     fetchData();
//     fetchResultsList();
//   }, [fetchData, fetchResultsList, userStore.nextLessonId, userStore.userId]);

//   useEffect(() => {
//     lessonState.exercisesData.forEach((exercise) =>
//       !lessonState.exercisesIds.includes(exercise._id)
//         ? lessonDispatch({
//             type: lessonAction.ADD_EXERCISE_ID,
//             payload: exercise._id,
//           })
//         : null
//     );
//   }, [lessonState.exercisesData, lessonState.exercisesIds]);

//   useEffect(() => {
//     console.log(
//       'set exercise started check',
//       lessonState,
//       lessonState?.currentResult?.date && lessonState.currentResult.score === -1
//     );
//     if (lessonState.currentResult && lessonState.currentExercise) {
//       if (
//         lessonState.currentResult.exerciseId === lessonState.currentExercise._id
//       ) {
//         if (
//           lessonState.currentResult.date &&
//           lessonState.currentResult.score === -1
//         ) {
//           console.log('exercise started');
//           lessonDispatch({
//             type: lessonAction.START_TIMER,
//           });
//         } else
//           lessonDispatch({
//             type: lessonAction.SET_IS_EXERCISE_STARTED,
//             payload: false,
//           });
//       } else
//         lessonDispatch({
//           type: lessonAction.SET_IS_EXERCISE_STARTED,
//           payload: false,
//         });
//     } else
//       lessonDispatch({
//         type: lessonAction.SET_IS_EXERCISE_STARTED,
//         payload: false,
//       });
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [lessonState.currentResult]);

//   useEffect(() => {
//     console.log('!isExerciseFinished', !lessonState.isExerciseFinished);

//     if (!lessonState.isExerciseFinished) {
//       lessonDispatch({
//         type: lessonAction.SET_FADE_EFFECT,
//         payload: false,
//       });
//     }
//   }, [lessonState.isExerciseFinished]);

//   useEffect(() => {
//     console.log('fadeEffect', lessonState.fadeEffect);
//     const keyframes = [
//       { transform: 'translateX(15%)', opacity: 0 },
//       { transform: 'translateX(0)', opacity: 1 },
//     ];
//     const options = {
//       duration: 500,
//       iterations: 1,
//     };
//     if (lessonState.fadeEffect && exerciseRef.current) {
//       exerciseRef.current.animate(keyframes, options);
//     }
//     if (lessonState.fadeEffect && infoBarRef.current) {
//       infoBarRef.current.animate(keyframes, options);
//     }
//     lessonDispatch({
//       type: lessonAction.SET_FADE_EFFECT,
//       payload: false,
//     });
//   }, [lessonState.fadeEffect]);

//   useEffect(() => {
//     if (
//       lessonState.currentExercise &&
//       lessonState.currentExercise.type === ExercisesTypes.FSA
//     ) {
//       const currentExercise = lessonState.currentExercise as FsaType;
//       const timeBuffersMinutes = currentExercise.timeBuffers.map(
//         (timeBuffer) => timeBuffer.timeBuffer
//       );
//       const totalMinutesForExercise = timeBuffersMinutes.reduce(
//         (accumulator, currentValue) => accumulator + currentValue,
//         0
//       );
//       if (totalMinutesForExercise === Math.round(totalMinutesForExercise)) {
//         lessonDispatch({
//           type: lessonAction.UPDATE_TIME_REMAINING,
//           payload: { minutes: totalMinutesForExercise, seconds: 0 },
//         });
//       } else {
//         const minutes = Math.floor(totalMinutesForExercise);
//         const seconds = Math.floor(60 * (totalMinutesForExercise - minutes));
//         lessonDispatch({
//           type: lessonAction.UPDATE_TIME_REMAINING,
//           payload: { minutes: minutes, seconds: seconds },
//         });
//       }
//     }
//   }, [lessonState.currentExercise]);

//   useEffect(() => {
//     if (
//       lessonState.currentExercise &&
//       lessonState.currentExercise.type === ExercisesTypes.FSA &&
//       lessonState.currentResult &&
//       lessonState.isExerciseStarted &&
//       !lessonState.isExerciseFinished
//     ) {
//       const currentExercise = lessonState.currentExercise as FsaType;
//       const timeBuffersMinutes = currentExercise.timeBuffers.map(
//         (timeBuffer) => timeBuffer.timeBuffer
//       );
//       const totalMinutesForExercise = timeBuffersMinutes.reduce(
//         (accumulator, currentValue) => accumulator + currentValue,
//         0
//       );
//       const startDate = lessonState.currentResult.date;
//       const timerInterval = setInterval(() => {
//         const newTimeRemaining = calculateTimeRemaining(
//           startDate,
//           totalMinutesForExercise
//         );
//         if (newTimeRemaining.minutes === 0 && newTimeRemaining.seconds === 0) {
//           clearInterval(timerInterval); // Stop the loop when time is up
//           lessonDispatch({
//             type: lessonAction.STOP_TIMER,
//           });
//         } else {
//           lessonDispatch({
//             type: lessonAction.UPDATE_TIME_REMAINING,
//             payload: newTimeRemaining,
//           });
//         }
//       }, 1000);

//       return () => clearInterval(timerInterval);
//     }
//   }, [
//     lessonState.currentExercise,
//     lessonState.currentResult,
//     lessonState.isExerciseStarted,
//     lessonState.isExerciseFinished,
//   ]);

//   const startCurrentExercise = useCallback(
//     async (nextLessonId: string, exerciseId: string, userId: string) => {
//       setIsLoading(true);
//       console.log('check1', lessonState.currentExercise);
//       if (lessonState.currentExercise) {
//         // const response = await startExercise(nextLessonId, exerciseId, userId);
//         const response = await pRetry(
//           () => startExercise(nextLessonId, exerciseId, userId),
//           {
//             retries: 5,
//           }
//         );
//         console.log('startCurrentExercise callback', response);
//         if (response) {
//           console.log('starting timer');
//           lessonDispatch({
//             type: lessonAction.START_TIMER,
//           });
//           lessonDispatch({
//             type: lessonAction.SET_CURRENT_RESULT,
//             payload: {
//               _id: response._id,
//               userId: response.userId,
//               date: response.date,
//               exerciseId: response.exerciseId,
//               answers: response.answers,
//               score: response.score,
//             },
//           });
//         }
//         setIsLoading(false);
//       }
//     },
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//     []
//   );

//   const initialTargetsDraggingState = {
//     grabbedItemId: 'released',
//     itemsList: [],
//   };

//   const [targetsDraggingState, targetsDraggingDispatch] = useReducer(
//     draggingReducer,
//     initialTargetsDraggingState
//   );

//   const handleTargetsDropdown = useCallback(
//     (selectedTargetName: string) => {
//       lessonDispatch({
//         type: lessonAction.SET_SELECTED_TARGET_INDEX,
//         payload: -1,
//       });

//       lessonDispatch({ type: lessonAction.HIDE_PLACEHOLDER });

//       if (targetsList) {
//         const selectedTarget = targetsList.find(
//           (target) => target.name === selectedTargetName
//         );

//         if (selectedTarget) {
//           lessonDispatch({
//             type: lessonAction.SET_TARGET_FROM_DROPDOWN,
//             payload: selectedTarget,
//           });
//         }
//       }
//     },
//     [targetsList]
//   );

//   const addTarget = useCallback(() => {
//     const targetsIdsList = lessonState.targetsToSubmit.map((target) =>
//       target ? target.id : null
//     );
//     if (
//       lessonState.selectedTargetIndex !== -1 &&
//       !targetsIdsList.includes(
//         lessonState.relevant[lessonState.selectedTargetIndex]._id
//       )
//     ) {
//       const _id = lessonState.relevant[lessonState.selectedTargetIndex]._id;
//       const name = lessonState.relevant[lessonState.selectedTargetIndex].name;
//       lessonDispatch({
//         type: lessonAction.ADD_TARGET_TO_SUBMIT,
//         payload: { id: _id, name: name },
//       });

//       targetsDraggingDispatch({
//         type: draggingAction.ADD_ITEM,
//         payload: { id: _id, name: name },
//       });

//       lessonDispatch({
//         type: lessonAction.SET_TARGET_FROM_DROPDOWN,
//         payload: null,
//       });
//       lessonDispatch({
//         type: lessonAction.SET_SELECTED_TARGET_INDEX,
//         payload: -1,
//       });
//     } else if (
//       lessonState.targetFromDropdown &&
//       !targetsIdsList.includes(lessonState.targetFromDropdown._id)
//     ) {
//       const _id = lessonState.targetFromDropdown._id;
//       const name = lessonState.targetFromDropdown.name;
//       lessonDispatch({
//         type: lessonAction.ADD_TARGET_TO_SUBMIT,
//         payload: { id: _id, name: name },
//       });

//       targetsDraggingDispatch({
//         type: draggingAction.ADD_ITEM,
//         payload: { id: _id, name: name },
//       });

//       lessonDispatch({
//         type: lessonAction.SET_TARGET_FROM_DROPDOWN,
//         payload: null,
//       });
//       lessonDispatch({
//         type: lessonAction.SHOW_PLACEHOLDER,
//       });
//     } else {
//       addAlert('The target has already been selected.', AlertSizes.small);
//     }
//   }, [
//     addAlert,
//     lessonState.relevant,
//     lessonState.selectedTargetIndex,
//     lessonState.targetFromDropdown,
//     lessonState.targetsToSubmit,
//   ]);

//   const submitExercise = useCallback(
//     async (params: submitCurrentExerciseParams) => {
//       //   const response = await submitCurrentExercise(params);
//       const response = await pRetry(() => submitCurrentExercise(params), {
//         retries: 5,
//       });
//       if (response && !!lessonState.currentExercise) {
//         lessonDispatch({ type: lessonAction.STOP_TIMER });
//         lessonDispatch({
//           type: lessonAction.SET_IS_EXERCISE_SUBMITTED,
//           payload: true,
//         });
//         lessonDispatch({
//           type: lessonAction.SET_NUM_OF_EXERCISES_MADE,
//           payload:
//             lessonState.exercisesIds.indexOf(lessonState.currentExercise._id) +
//             1,
//         });

//         // fetchAnswersData();
//       }
//     },
//     [lessonState.currentExercise, lessonState.exercisesIds]
//   );

//   const continueLesson = useCallback(async () => {
//     if (lessonState.currentExercise) {
//       const lengthOfLesson = lessonState.exercisesData.length;
//       const indexOfCurrentExercise = lessonState.exercisesData.indexOf(
//         lessonState.currentExercise
//       );

//       if (lengthOfLesson === indexOfCurrentExercise + 1) {
//         //last exercise
//         console.log('last exercise');
//         // const response = await updateNextLessonIdForUser(userStore.userId);
//         const response = await pRetry(
//           () =>
//             userStore.userId
//               ? updateNextLessonIdForUser(userStore.userId)
//               : null,
//           {
//             retries: 5,
//           }
//         );
//         console.log('last exercise- response', response);
//         if (!!response) {
//           router.push('/learn');
//         } else {
//           addAlert('error while submitting the lesson', AlertSizes.small);
//         }
//       } else {
//         lessonDispatch({
//           type: lessonAction.UPDATE_NEXT_EXERCISE,
//         });
//       }
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [
//     lessonState.currentExercise,
//     lessonState.exercisesData,
//     userStore.userId,
//   ]);

//   return (
//     <div className='relative w-full dark:text-duoGrayDark-lightest'>
//       {userStore.nextLessonId &&
//       lessonState.currentExercise &&
//       lessonState.relevant &&
//       userStore.userId ? (
//         <div className='absolute inset-x-0 inset-y-0'>
//           <div
//             className='absolute left-0 top-0 h-screen w-full gap-0 overflow-hidden p-0'
//             id='lesson-grid'
//           >
//             <div className='h-full w-full' id='exrcise-grid'>
//               <ProgressBar
//                 totalNumOfExercises={lessonState.exercisesIds.length}
//                 numOfExercisesMade={lessonState.numOfExercisesMade}
//               />
//               <div
//                 ref={exerciseRef} //main page
//                 className='flex w-full flex-row outline-none'
//               >
//                 <div className='relative h-full w-full outline-none'>
//                   <div className='absolute h-full w-full font-semibold text-duoGray-darkest dark:text-duoGrayDark-lightest'></div>
//                 </div>
//               </div>
//             </div>

//             <LessonInfo
//               infoRef={infoBarRef}
//               exerciseType={lessonState.currentExercise.type}
//               timeRemaining={lessonState.timeRemaining}
//               isExerciseStarted={lessonState.isExerciseStarted}
//               isExerciseFinished={lessonState.isExerciseFinished}
//               targetsToSubmit={lessonState.targetsToSubmit}
//             />

//             <div
//               // ref={buttonsBarRef} //buttons bar
//               className={` ${
//                 lessonState.isExerciseFinished &&
//                 lessonState.isExerciseSubmitted
//                   ? lessonState.totalScore === 100
//                     ? 'relative col-span-2 flex w-full items-center justify-center bg-duoGreen-lighter dark:border-duoGrayDark-light dark:bg-duoGrayDark-dark'
//                     : lessonState.totalScore === 0
//                       ? 'relative col-span-2 flex items-center justify-center bg-duoRed-lighter dark:border-duoGrayDark-light dark:bg-duoGrayDark-dark'
//                       : 'relative col-span-2 flex items-center justify-center bg-duoYellow-light dark:border-duoGrayDark-light dark:bg-duoGrayDark-dark'
//                   : 'relative col-span-2 flex items-center justify-center border-t-2 dark:border-duoGrayDark-light'
//               }`}
//             >
//               <div
//                 className={
//                   lessonState.isExerciseStarted
//                     ? lessonState.isExerciseFinished &&
//                       lessonState.isExerciseSubmitted
//                       ? 'absolute w-[40%] 3xl:w-[50%]'
//                       : 'absolute flex w-[45%] justify-between 3xl:w-[30%]'
//                     : 'absolute active:-translate-y-1'
//                 }
//               >
//                 {lessonState.isExerciseFinished &&
//                 lessonState.isExerciseSubmitted ? (
//                   <div className='absolute flex h-full w-full items-center justify-between'>
//                     <div className='flex h-full flex-none flex-row items-center'>
//                       {lessonState.totalScore === 100 ? (
//                         <FaCheck className='pop-animation mr-4 rounded-full bg-white p-3 text-6xl text-duoGreen-darkText' />
//                       ) : (
//                         <FaXmark
//                           className={`pop-animation mr-4 rounded-full bg-white p-3 text-6xl ${
//                             lessonState.totalScore === 0
//                               ? 'text-duoRed-default'
//                               : 'text-duoYellow-darkest'
//                           }`}
//                         />
//                       )}
//                       <div
//                         className={`flex flex-col ${
//                           lessonState.totalScore === 100 ? 'xl:gap-2' : ''
//                         }`}
//                       >
//                         <span
//                           className={`text-2xl font-extrabold ${
//                             lessonState.totalScore === 100
//                               ? 'text-duoGreen-darkText'
//                               : lessonState.totalScore === 0
//                                 ? 'text-duoRed-default'
//                                 : 'text-duoYellow-darkest'
//                           }`}
//                         >
//                           {lessonState.totalScore === 100
//                             ? 'Currect!'
//                             : 'Correct answers:'}
//                         </span>

//                         {
//                           <div
//                             className={`text-md font-semibold ${
//                               lessonState.totalScore === 0
//                                 ? 'text-duoRed-default'
//                                 : 'text-duoYellow-dark'
//                             }`}
//                           >
//                             <ul>
//                               {lessonState.totalScore !== 100
//                                 ? lessonState.currentAnswers.map(
//                                     (answer, answerKey) => (
//                                       <li key={answer._id}>
//                                         {answerKey !== 0
//                                           ? `, ${answer.name}`
//                                           : answer.name}
//                                       </li>
//                                     )
//                                   )
//                                 : null}
//                             </ul>
//                           </div>
//                         }

//                         <button
//                           className={`flex flex-row items-center justify-start font-extrabold uppercase dark:opacity-70 ${
//                             lessonState.totalScore === 100
//                               ? 'text-duoGreen-text hover:text-duoGreen-midText'
//                               : lessonState.totalScore === 0
//                                 ? 'text-duoRed-default'
//                                 : 'text-duoYellow-dark hover:text-duoYellow-darker'
//                           }`}
//                         >
//                           <FiFlag className='mr-2 -scale-x-100' />
//                           <span> report</span>
//                         </button>
//                       </div>
//                     </div>

//                     <Button
//                       label={'CONTINUE'}
//                       color={
//                         lessonState.totalScore === 100
//                           ? ButtonColors.GREEN
//                           : lessonState.totalScore === 0
//                             ? ButtonColors.RED
//                             : ButtonColors.YELLOW
//                       }
//                       style={'w-[20rem] 3xl:w-[30rem] text-2xl tracking-widest'}
//                       onClick={continueLesson}
//                     />
//                   </div>
//                 ) : lessonState.isExerciseStarted ? (
//                   <>
//                     {lessonState.currentExercise &&
//                     lessonState.currentExercise.files &&
//                     lessonState.currentExercise.files.length > 0 ? (
//                       <Button
//                         color={ButtonColors.PURPLE}
//                         icon={faFileArrowDown}
//                         style={'text-2xl tracking-widest'}
//                         onClick={() => {
//                           !!lessonState.currentExercise
//                             ? downloadRecord(
//                                 lessonState.currentExercise.files[0].fileName,
//                                 lessonState.currentExercise.type
//                               )
//                             : null;
//                         }}
//                         isLoading={downloadingFile}
//                       />
//                     ) : null}
//                     <Button
//                       label={'ADD TARGET'}
//                       color={ButtonColors.BLUE}
//                       style={
//                         'w-[15rem] 3xl:w-[20rem] flex-none text-2xl tracking-widest'
//                       }
//                       onClick={addTarget}
//                     />
//                     <Button
//                       label={'SUBMIT'}
//                       color={ButtonColors.GREEN}
//                       style={
//                         'w-[15rem] 3xl:w-[20rem] text-2xl flex-none tracking-widest'
//                       }
//                       onClick={() => {
//                         const userId = userStore.userId;
//                         const nextLessonId = userStore.nextLessonId;
//                         userId !== undefined && nextLessonId !== undefined
//                           ? submitExercise({
//                               lessonState,
//                               lessonDispatch,
//                               addAlert,
//                               userId,
//                               nextLessonId,
//                             })
//                           : null;
//                       }}
//                     />
//                   </>
//                 ) : (
//                   <section className='flex flex-row items-center gap-6'>
//                     {lessonState.currentExercise &&
//                     lessonState.currentExercise.files &&
//                     lessonState.currentExercise.files.length > 0 ? (
//                       <Button
//                         label={'DOWNLOAD REC'}
//                         color={ButtonColors.PURPLE}
//                         style={
//                           'w-[20rem] 3xl:w-[30rem] text-2xl tracking-widest'
//                         }
//                         onClick={() => {
//                           !!lessonState.currentExercise
//                             ? downloadRecord(
//                                 lessonState.currentExercise.files[0].fileName,
//                                 lessonState.currentExercise.type
//                               )
//                             : null;
//                         }}
//                         isLoading={downloadingFile}
//                       />
//                     ) : null}
//                     <Button
//                       label={'START CLOCK'}
//                       color={ButtonColors.PURPLE}
//                       style={'w-[20rem] 3xl:w-[30rem] text-2xl tracking-widest'}
//                       onClick={() => {
//                         !!userStore.nextLessonId &&
//                         !!userStore.userId &&
//                         !!lessonState.currentExercise
//                           ? startCurrentExercise(
//                               userStore.nextLessonId,
//                               lessonState.currentExercise._id,
//                               userStore.userId
//                             )
//                           : null;
//                       }}
//                       isLoading={isLoading}
//                     />
//                   </section>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       ) : (
//         <div>
//           lesson not found.
//           {userStore.userId ? <h1>1</h1> : <h1>2</h1>}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Lesson;
