'use client';
import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import { TbClockHour12 } from 'react-icons/tb';
import { FaCheck, FaXmark } from 'react-icons/fa6';
import { FiFlag } from 'react-icons/fi';
// import { FaCopy } from "react-icons/fa";
import { FaCopy } from 'react-icons/fa6';

import Button, { ButtonColors } from '@/components/Button/page';
import ProgressBar from '@/components/ProgressBar/page';
import Dropdown, { DropdownSizes } from '@/components/Dropdown/page';

import useStore from '../store/useStore';
import { useUserStore } from '../store/stores/useUserStore';
import { useTargetStore } from '../store/stores/useTargetStore';
import { AlertSizes, useAlertStore } from '../store/stores/useAlertStore';

import { getExercisesData } from '@/app/API/classes-service/lessons/functions';
import {
  getAnswersByExerciseId,
  getRelevantByExerciseId,
} from '../API/classes-service/exercises/functions';
import {
  getResultsByLessonAndUser,
  startExercise,
} from '../API/classes-service/results/functions';
import { getTargetsList } from '../API/classes-service/targets/functions';
import { updateNextLessonIdForUser } from '../API/users-service/users/functions';
import {
  calculateTimeRemaining,
  lessonAction,
  lessonReducer,
} from '@/reducers/studentView/lessonReducer';
import { draggingAction, draggingReducer } from '@/reducers/dragReducer';
import DraggbleList, { Diractions } from '@/components/DraggableList/page';
import submitCurrentExercise, {
  submitCurrentExerciseParams,
} from '../utils/functions/lessonPage/submitCurrentExercise';
import { getEncryptedFileByName } from '../API/files-service/functions';
import { getZipPassword } from '../API/auth-service/functions';
import pRetry from 'p-retry';
import { faFileArrowDown } from '@fortawesome/free-solid-svg-icons';

const Lesson: React.FC = () => {
  const router = useRouter();

  const userStore = {
    nextLessonId: useStore(useUserStore, (state) => state.nextLessonId),
    userId: useStore(useUserStore, (state) => state.userId),
  };
  const targetsList = useStore(useTargetStore, (state) => state.targets);
  const addAlert = useAlertStore.getState().addAlert;

  const exerciseRef = useRef<HTMLDivElement | null>(null);
  const infoBarRaf = useRef<HTMLDivElement | null>(null);

  const initialLessonState = {
    exercisesData: [],
    lessonResults: [],
    exercisesIds: [],
    numOfExercisesMade: 0, //0
    currentExercise: null,
    zipPassword: null,
    relevant: [],
    currentAnswers: [],
    currentResult: null,
    grabbedTargetId: null,
    totalScore: -1, //-1
    isExerciseStarted: false, //false
    isExerciseFinished: false, //false
    isExerciseSubmitted: false,
    timeRemaining: { minutes: 0, seconds: 0 }, //{ minutes: 0, seconds: 0 }
    selectedTargetIndex: -1, //-1,
    targetsToSubmit: [],
    targetFromDropdown: null,
    showPlaceholder: true, //true
    fadeEffect: true, //true
  };

  const [lessonState, lessonDispatch] = useReducer(
    lessonReducer,
    initialLessonState
  );

  const initialTargetsDraggingState = {
    grabbedItemId: 'released',
    itemsList: [],
  };

  const [targetsDraggingState, targetsDraggingDispatch] = useReducer(
    draggingReducer,
    initialTargetsDraggingState
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [downloadingFile, setDownloadingFile] = useState<boolean>(false);

  const fetchTargets = useCallback(async () => {
    // await getTargetsList();
    await pRetry(getTargetsList, {
      retries: 5,
    });
  }, []);

  useEffect(() => {
    if (!!!targetsList) {
      fetchTargets();
    }
  }, [fetchTargets, targetsList]);

  const fetchData = useCallback(async () => {
    // if (userStore.nextLessonId) {
    //   const response = await getExercisesData(userStore.nextLessonId);
    const response = await pRetry(
      () =>
        userStore.nextLessonId
          ? getExercisesData(userStore.nextLessonId)
          : null,
      {
        retries: 5,
      }
    );
    if (response && response.length > 0) {
      console.log('SET_EXERCISES_DATA', response);
      lessonDispatch({
        type: lessonAction.SET_EXERCISES_DATA,
        payload: response,
      });
      fetchRelevantData();
      fetchAnswersData();
    }
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userStore.nextLessonId]);

  const fetchResultsList = useCallback(async () => {
    // if (userStore.nextLessonId && userStore.userId) {
    //   const response = await getResultsByLessonAndUser(
    //     userStore.nextLessonId,
    //     userStore.userId
    //   );
    const response = await pRetry(
      () =>
        userStore.nextLessonId && userStore.userId
          ? getResultsByLessonAndUser(userStore.nextLessonId, userStore.userId)
          : null,
      {
        retries: 5,
      }
    );
    response
      ? lessonDispatch({
          type: lessonAction.SET_LESSON_RESULTS,
          payload: response,
        })
      : null;
    // }
  }, [userStore.nextLessonId, userStore.userId]);
  useEffect(() => {
    fetchData();
    fetchResultsList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userStore.nextLessonId, userStore.userId]);

  useEffect(() => {
    lessonState.exercisesData.map((exercise) =>
      !lessonState.exercisesIds.includes(exercise._id)
        ? lessonDispatch({
            type: lessonAction.ADD_EXERCISE_ID,
            payload: exercise._id,
          })
        : null
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonState.exercisesData]);

  useEffect(() => {
    if (
      lessonState.lessonResults &&
      lessonState.exercisesData &&
      lessonState.exercisesData.length > 0
    ) {
      const fetchZipPassword = async () => {
        // if (lessonState.currentExercise) {
        //   const password = await getZipPassword(
        //     lessonState.currentExercise.recordName
        //   );
        const password = await pRetry(
          () =>
            lessonState.currentExercise
              ? getZipPassword(lessonState.currentExercise.files[0].fileName)
              : null,
          {
            retries: 5,
          }
        );
        console.log('fetchZipPassword', password);
        lessonDispatch({
          type: lessonAction.SET_ZIP_PASSWORD,
          payload: password,
        });
        // }
      };
      console.log('lessonState.lessonResults', lessonState.lessonResults);
      fetchZipPassword();
      if (lessonState.lessonResults.length === 0) {
        console.log(
          'lessonState.exercisesData[0]',
          lessonState.exercisesData[0]
        );
        lessonDispatch({
          type: lessonAction.SET_CURRENT_EXERCISE,
          payload: lessonState.exercisesData[0],
        });
      } else {
        if (
          lessonState.lessonResults[lessonState.lessonResults.length - 1]
            .score === -1
        ) {
          lessonDispatch({
            type: lessonAction.SET_CURRENT_EXERCISE,
            payload:
              lessonState.exercisesData[lessonState.lessonResults.length - 1],
          });
          lessonDispatch({
            type: lessonAction.SET_CURRENT_RESULT,
            payload:
              lessonState.lessonResults[lessonState.lessonResults.length - 1],
          });
        } else {
          lessonDispatch({
            type: lessonAction.SET_CURRENT_EXERCISE,
            payload:
              lessonState.exercisesData[lessonState.lessonResults.length],
          });
          lessonDispatch({
            type: lessonAction.SET_CURRENT_RESULT,
            payload: null,
          });
        }
      }
    }
  }, [
    lessonState.currentExercise,
    lessonState.exercisesData,
    lessonState.lessonResults,
  ]);

  const fetchRelevantData = useCallback(async () => {
    if (lessonState.currentExercise) {
      const currentExerciseId = lessonState.currentExercise._id;
      //   const response = await getRelevantByExerciseId(currentExerciseId);
      const response = await pRetry(
        () => getRelevantByExerciseId(currentExerciseId),
        {
          retries: 5,
        }
      );

      response.length > 0
        ? lessonDispatch({
            type: lessonAction.SET_RELEVANT,
            payload: response,
          })
        : null;
    }
  }, [lessonState.currentExercise]);

  const fetchAnswersData = useCallback(async () => {
    if (lessonState.currentExercise) {
      const currentExerciseId = lessonState.currentExercise._id;
      //   const response = await getAnswersByExerciseId(currentExerciseId);
      const response = await pRetry(
        () => getAnswersByExerciseId(currentExerciseId),
        {
          retries: 5,
        }
      );
      response.length > 0
        ? lessonDispatch({
            type: lessonAction.SET_CURRENT_ANSWERS,
            payload: response,
          })
        : null;
    }
  }, [lessonState.currentExercise]);

  useEffect(() => {
    //   if (lessonState.currentExercise) {
    //     if (!lessonState.isExerciseFinished) {
    //       lessonDispatch({
    //         type: lessonAction.SET_NUM_OF_EXERCISES_MADE,
    //         payload: lessonState.exercisesIds.indexOf(
    //           lessonState.currentExercise._id
    //         ),
    //       });
    //     } else {
    //       lessonDispatch({
    //         type: lessonAction.SET_NUM_OF_EXERCISES_MADE,
    //         payload:
    //           lessonState.exercisesIds.indexOf(lessonState.currentExercise._id) +
    //           1,
    //       });
    //     }
    //   }

    fetchRelevantData();
    fetchAnswersData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    userStore.userId,
    lessonState.currentExercise,
    lessonState.isExerciseFinished,
    lessonState.exercisesIds,
  ]);

  useEffect(() => {
    console.log(
      'set exercise started check',
      lessonState,
      lessonState?.currentResult?.date && lessonState.currentResult.score === -1
    );
    if (lessonState.currentResult && lessonState.currentExercise) {
      if (
        lessonState.currentResult.exerciseId === lessonState.currentExercise._id
      ) {
        if (
          lessonState.currentResult.date &&
          lessonState.currentResult.score === -1
        ) {
          console.log('exercise started');
          lessonDispatch({
            type: lessonAction.START_TIMER,
          });
        } else
          lessonDispatch({
            type: lessonAction.SET_IS_EXERCISE_STARTED,
            payload: false,
          });
      } else
        lessonDispatch({
          type: lessonAction.SET_IS_EXERCISE_STARTED,
          payload: false,
        });
    } else
      lessonDispatch({
        type: lessonAction.SET_IS_EXERCISE_STARTED,
        payload: false,
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonState.currentResult]);

  useEffect(() => {
    console.log('!isExerciseFinished', !lessonState.isExerciseFinished);

    if (!lessonState.isExerciseFinished) {
      lessonDispatch({
        type: lessonAction.SET_FADE_EFFECT,
        payload: false,
      });
    }
  }, [lessonState.isExerciseFinished]);

  // useEffect(() => {
  //     console.log("userId", userId);
  // }, [userId]);
  // useEffect(() => {
  //     console.log("nextLessonId", nextLessonId);
  // }, [nextLessonId]);

  // useEffect(() => {
  //     console.log("exercisesData", exercisesData);
  // }, [exercisesData]);

  // useEffect(() => {
  //     console.log("lessonResults", lessonResults);
  // }, [lessonResults]);

  // useEffect(() => {
  //     console.log("exercisesIds", exercisesIds);
  // }, [exercisesIds]);

  // useEffect(() => {
  //     console.log("currentExercise", currentExercise);
  // }, [currentExercise]);

  // useEffect(() => {
  //     console.log("relevant", relevant);
  // }, [relevant]);

  // useEffect(() => {
  //     console.log("currentAnswers", currentAnswers);
  // }, [currentAnswers]);

  // useEffect(() => {
  //     console.log("currentResult", currentResult);
  // }, [currentResult]);

  // useEffect(() => {
  //     console.log("isExerciseStarted", isExerciseStarted);
  // }, [isExerciseStarted]);

  useEffect(() => {
    console.log('fadeEffect', lessonState.fadeEffect);
    const keyframes = [
      { transform: 'translateX(15%)', opacity: 0 },
      { transform: 'translateX(0)', opacity: 1 },
    ];
    const options = {
      duration: 500,
      iterations: 1,
    };
    if (lessonState.fadeEffect && exerciseRef.current) {
      exerciseRef.current.animate(keyframes, options);
    }
    if (lessonState.fadeEffect && infoBarRaf.current) {
      infoBarRaf.current.animate(keyframes, options);
    }
    lessonDispatch({
      type: lessonAction.SET_FADE_EFFECT,
      payload: false,
    });
  }, [lessonState.fadeEffect]);

  useEffect(() => {
    if (lessonState.currentExercise) {
      const timeBuffersMinutes = lessonState.currentExercise.timeBuffers.map(
        (timeBuffer) => timeBuffer.timeBuffer
      );
      const totalMinutesForExercise = timeBuffersMinutes.reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        0
      );
      if (totalMinutesForExercise === Math.round(totalMinutesForExercise)) {
        lessonDispatch({
          type: lessonAction.UPDATE_TIME_REMAINING,
          payload: { minutes: totalMinutesForExercise, seconds: 0 },
        });
      } else {
        const minutes = Math.floor(totalMinutesForExercise);
        const seconds = Math.floor(60 * (totalMinutesForExercise - minutes));
        lessonDispatch({
          type: lessonAction.UPDATE_TIME_REMAINING,
          payload: { minutes: minutes, seconds: seconds },
        });
      }
    }
  }, [lessonState.currentExercise]);

  useEffect(() => {
    if (
      lessonState.currentExercise &&
      lessonState.currentExercise.timeBuffers &&
      lessonState.currentResult &&
      lessonState.isExerciseStarted &&
      !lessonState.isExerciseFinished
    ) {
      const timeBuffersMinutes = lessonState.currentExercise.timeBuffers.map(
        (timeBuffer) => timeBuffer.timeBuffer
      );
      const totalMinutesForExercise = timeBuffersMinutes.reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        0
      );
      const startDate = lessonState.currentResult.date;
      const timerInterval = setInterval(() => {
        const newTimeRemaining = calculateTimeRemaining(
          startDate,
          totalMinutesForExercise
        );
        if (newTimeRemaining.minutes === 0 && newTimeRemaining.seconds === 0) {
          clearInterval(timerInterval); // Stop the loop when time is up
          lessonDispatch({
            type: lessonAction.STOP_TIMER,
          });
        } else {
          lessonDispatch({
            type: lessonAction.UPDATE_TIME_REMAINING,
            payload: newTimeRemaining,
          });
        }
      }, 1000);

      return () => clearInterval(timerInterval);
    }
  }, [
    lessonState.currentExercise,
    lessonState.currentResult,
    lessonState.isExerciseStarted,
    lessonState.isExerciseFinished,
  ]);

  const downloadRecord = useCallback(
    async (recordName: string, exerciseType: ExercisesTypes) => {
      try {
        //   const url = await getEncryptedFileByName(
        //     BucketsNames.RECORDS,
        //     recordName
        //   );
        setDownloadingFile(true);
        const url = await pRetry(
          () =>
            getEncryptedFileByName(
              BucketsNames.RECORDS,
              exerciseType,
              recordName
            ),
          {
            retries: 5,
          }
        );
        if (url) {
          const a = document.createElement('a');
          a.style.display = 'none';
          a.href = url;
          a.href = url;
          a.download = 'output.zip';
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          console.log('finished');
        }
        setDownloadingFile(false);
      } catch (err) {
        console.error(err);
      }
    },
    []
  );

  const startCurrentExercise = useCallback(
    async (nextLessonId: string, exerciseId: string, userId: string) => {
      setIsLoading(true);
      console.log('check1', lessonState.currentExercise);
      if (lessonState.currentExercise) {
        // const response = await startExercise(nextLessonId, exerciseId, userId);
        const response = await pRetry(
          () => startExercise(nextLessonId, exerciseId, userId),
          {
            retries: 5,
          }
        );
        console.log('startCurrentExercise callback', response);
        if (response) {
          console.log('starting timer');
          lessonDispatch({
            type: lessonAction.START_TIMER,
          });
          lessonDispatch({
            type: lessonAction.SET_CURRENT_RESULT,
            payload: {
              _id: response._id,
              userId: response.userId,
              date: response.date,
              exerciseId: response.exerciseId,
              answers: response.answers,
              score: response.score,
            },
          });
        }
        setIsLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const handleTargetsDropdown = useCallback(
    (selectedTargetName: string) => {
      lessonDispatch({
        type: lessonAction.SET_SELECTED_TARGET_INDEX,
        payload: -1,
      });

      lessonDispatch({ type: lessonAction.HIDE_PLACEHOLDER });

      if (targetsList) {
        const selectedTarget = targetsList.find(
          (target) => target.name === selectedTargetName
        );

        if (selectedTarget) {
          lessonDispatch({
            type: lessonAction.SET_TARGET_FROM_DROPDOWN,
            payload: selectedTarget,
          });
        }
      }
    },
    [targetsList]
  );

  const addTarget = useCallback(() => {
    const targetsIdsList = lessonState.targetsToSubmit.map((target) =>
      target ? target.id : null
    );
    if (
      lessonState.selectedTargetIndex !== -1 &&
      !targetsIdsList.includes(
        lessonState.relevant[lessonState.selectedTargetIndex]._id
      )
    ) {
      const _id = lessonState.relevant[lessonState.selectedTargetIndex]._id;
      const name = lessonState.relevant[lessonState.selectedTargetIndex].name;
      lessonDispatch({
        type: lessonAction.ADD_TARGET_TO_SUBMIT,
        payload: { id: _id, name: name },
      });

      targetsDraggingDispatch({
        type: draggingAction.ADD_ITEM,
        payload: { id: _id, name: name },
      });

      lessonDispatch({
        type: lessonAction.SET_TARGET_FROM_DROPDOWN,
        payload: null,
      });
      lessonDispatch({
        type: lessonAction.SET_SELECTED_TARGET_INDEX,
        payload: -1,
      });
    } else if (
      lessonState.targetFromDropdown &&
      !targetsIdsList.includes(lessonState.targetFromDropdown._id)
    ) {
      const _id = lessonState.targetFromDropdown._id;
      const name = lessonState.targetFromDropdown.name;
      lessonDispatch({
        type: lessonAction.ADD_TARGET_TO_SUBMIT,
        payload: { id: _id, name: name },
      });

      targetsDraggingDispatch({
        type: draggingAction.ADD_ITEM,
        payload: { id: _id, name: name },
      });

      lessonDispatch({
        type: lessonAction.SET_TARGET_FROM_DROPDOWN,
        payload: null,
      });
      lessonDispatch({
        type: lessonAction.SHOW_PLACEHOLDER,
      });
    } else {
      addAlert('The target has already been selected.', AlertSizes.small);
    }
  }, [
    addAlert,
    lessonState.relevant,
    lessonState.selectedTargetIndex,
    lessonState.targetFromDropdown,
    lessonState.targetsToSubmit,
  ]);

  const submitExercise = useCallback(
    async (params: submitCurrentExerciseParams) => {
      //   const response = await submitCurrentExercise(params);
      const response = await pRetry(() => submitCurrentExercise(params), {
        retries: 5,
      });
      if (response && !!lessonState.currentExercise) {
        lessonDispatch({ type: lessonAction.STOP_TIMER });
        lessonDispatch({
          type: lessonAction.SET_IS_EXERCISE_SUBMITTED,
          payload: true,
        });
        lessonDispatch({
          type: lessonAction.SET_NUM_OF_EXERCISES_MADE,
          payload:
            lessonState.exercisesIds.indexOf(lessonState.currentExercise._id) +
            1,
        });

        // fetchRelevantData();
        // fetchAnswersData();
      }
    },
    [lessonState.currentExercise, lessonState.exercisesIds]
  );

  const continueLesson = useCallback(async () => {
    if (lessonState.currentExercise) {
      const lengthOfLesson = lessonState.exercisesData.length;
      const indexOfCurrentExercise = lessonState.exercisesData.indexOf(
        lessonState.currentExercise
      );

      if (lengthOfLesson === indexOfCurrentExercise + 1) {
        //last exercise
        console.log('last exercise');
        // const response = await updateNextLessonIdForUser(userStore.userId);
        const response = await pRetry(
          () =>
            userStore.userId
              ? updateNextLessonIdForUser(userStore.userId)
              : null,
          {
            retries: 5,
          }
        );
        console.log('last exercise- response', response);
        if (!!response) {
          router.push('/learn');
        } else {
          addAlert('error while submitting the lesson', AlertSizes.small);
        }
      } else {
        lessonDispatch({
          type: lessonAction.UPDATE_NEXT_EXERCISE,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    lessonState.currentExercise,
    lessonState.exercisesData,
    userStore.userId,
  ]);

  return (
    <div className='relative w-full dark:text-duoGrayDark-lightest'>
      {userStore.nextLessonId &&
      lessonState.currentExercise &&
      lessonState.relevant &&
      userStore.userId ? (
        <div className='absolute inset-x-0 inset-y-0'>
          <div
            className='absolute left-0 top-0 h-screen
                     w-full gap-0 overflow-hidden p-0'
            id='lesson-grid'
          >
            <div className='h-full w-full' id='exrcise-grid'>
              <ProgressBar
                totalNumOfExercises={lessonState.exercisesIds.length}
                numOfExercisesMade={lessonState.numOfExercisesMade}
              />
              <div
                ref={exerciseRef} //main page
                className='flex w-full flex-row outline-none'
              >
                <div className='relative h-full w-full outline-none'>
                  <div className='absolute h-full w-full font-semibold text-duoGray-darkest dark:text-duoGrayDark-lightest'>
                    <div className='mx-auto grid w-[80%] grid-rows-[min-content] items-start justify-start 3xl:h-fit'>
                      <div className='w-full text-left sm:text-sm xl:text-xl 3xl:text-2xl'>
                        {lessonState.currentExercise.description}
                      </div>
                      <span className='font-extrabold tracking-wider sm:mt-6 sm:text-lg xl:mt-10 xl:text-2xl'>
                        Relevant list:
                      </span>
                      <div
                        className={`mx-auto mt-4 flex w-full cursor-default flex-row`}
                      >
                        {lessonState.relevant.map(
                          (relevantTarget, relevantTargetIndex) => (
                            <div
                              key={relevantTarget._id}
                              className='mr-5 flex flex-row items-end self-end'
                            >
                              <div className='relative '>
                                <div
                                  className={`border-border-duoGray-regular border-border-duoGray-regular group flex flex-row items-center justify-center rounded-xl border-2 border-b-4 py-4 pl-[45px] pr-[30px] text-lg font-bold text-duoGray-dark dark:border-duoGrayDark-light dark:bg-duoGrayDark-darkest dark:text-duoGrayDark-lightest sm:min-w-[7rem] lg:min-w-[10rem] ${
                                    lessonState.isExerciseStarted
                                      ? !lessonState.isExerciseSubmitted
                                        ? 'cursor-pointer active:translate-y-[1px] active:border-b-2'
                                        : 'cursor-default'
                                      : 'cursor-default'
                                  }
                                                               ${
                                                                 !lessonState.isExerciseStarted &&
                                                                 !lessonState.isExerciseSubmitted
                                                                   ? ''
                                                                   : lessonState.isExerciseStarted &&
                                                                       !lessonState.isExerciseSubmitted &&
                                                                       relevantTargetIndex ===
                                                                         lessonState.selectedTargetIndex
                                                                     ? 'cursor-pointer border-duoBlue-dark bg-duoBlue-lightest text-duoBlue-text dark:border-duoGrayDark-lighter dark:bg-duoGrayDark-midDark'
                                                                     : ' cursor-pointer hover:border-duoGray-buttonBorderHover hover:bg-duoGray-lighter group-hover:text-duoGray-darkText hover:dark:border-duoGrayDark-lighter hover:dark:bg-duoGrayDark-midDark'
                                                               }
                                                                `}
                                  onClick={() => {
                                    if (
                                      !lessonState.isExerciseSubmitted &&
                                      lessonState.isExerciseStarted
                                    ) {
                                      lessonDispatch({
                                        type: lessonAction.SET_SELECTED_TARGET_INDEX,
                                        payload: relevantTargetIndex,
                                      });
                                      lessonDispatch({
                                        type: lessonAction.SET_TARGET_FROM_DROPDOWN,
                                        payload: null,
                                      });
                                    }
                                  }}
                                >
                                  <span
                                    className={`absolute left-3 inline-flex shrink-0 items-center justify-center rounded-lg border-2 font-bold text-duoGray-dark dark:border-duoGrayDark-light dark:text-duoGrayDark-lightest sm:h-[25px] sm:w-[25px] sm:text-sm lg:h-[30px] lg:w-[30px] xl:text-xl
                                    ${
                                      !lessonState.isExerciseStarted &&
                                      !lessonState.isExerciseSubmitted
                                        ? ''
                                        : lessonState.isExerciseStarted &&
                                            !lessonState.isExerciseSubmitted &&
                                            relevantTargetIndex ===
                                              lessonState.selectedTargetIndex
                                          ? 'border-duoBlue-dark text-duoBlue-text'
                                          : 'group-hover:border-duoGray-buttonBorderHover group-hover:text-duoGray-darkText dark:group-hover:border-duoGrayDark-light dark:group-hover:text-duoGrayDark-lightest'
                                    }`}
                                  >
                                    {relevantTargetIndex + 1}
                                  </span>

                                  <span className='relative flex items-center justify-center text-ellipsis text-center sm:text-lg lg:text-xl'>
                                    {relevantTarget.name}
                                  </span>
                                </div>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                      <span className='font-extrabold tracking-wider sm:mt-6 sm:text-lg xl:mt-10 xl:text-2xl'>
                        Select target:
                      </span>
                      {targetsList ? (
                        <section className='w-[12rem]'>
                          <Dropdown
                            isSearchable={true}
                            placeholder={'target'}
                            items={targetsList.map((target) => target.name)}
                            value={
                              lessonState.showPlaceholder
                                ? undefined
                                : lessonState.targetFromDropdown
                                  ? lessonState.targetFromDropdown.name
                                  : undefined
                            }
                            onChange={handleTargetsDropdown}
                            isDisabled={
                              !lessonState.isExerciseStarted ||
                              lessonState.isExerciseSubmitted
                            }
                            size={DropdownSizes.SMALL}
                            className={'z-10 mt-5 w-[16rem]'}
                          />
                        </section>
                      ) : (
                        <Dropdown
                          isSearchable={false}
                          placeholder={'target'}
                          items={['']}
                          value={''}
                          onChange={() => console.log('')}
                          isDisabled={!lessonState.isExerciseSubmitted}
                          size={DropdownSizes.SMALL}
                          className={'z-10 mt-5 w-[16rem]'}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              ref={infoBarRaf} //info bar
              className='right-0 mx-auto flex flex-col items-center justify-start'
            >
              <div className='mb-3 mt-5 flex flex-col rounded-2xl border-2 text-center text-duoGray-darker dark:border-duoGrayDark-light dark:text-duoGrayDark-lightest sm:px-1 sm:py-2 xl:px-4 xl:py-6 3xl:mb-5'>
                <span className='font-extrabold sm:hidden md:text-xl lg:block xl:mb-6 xl:text-2xl 3xl:mb-12  3xl:text-4xl'>
                  Unit 1 - Level 1
                  <br className='3xl:text-4xl' />
                  Lesson 1
                </span>
                <div className='flex flex-row items-center justify-center font-bold sm:text-xl xl:text-2xl 3xl:text-4xl'>
                  <TbClockHour12
                    className={
                      lessonState.timeRemaining.minutes === 0 &&
                      lessonState.timeRemaining.seconds === 0
                        ? 'mx-2 fill-duoRed-light text-duoRed-default opacity-100 sm:text-3xl xl:text-4xl'
                        : lessonState.isExerciseStarted &&
                            !lessonState.isExerciseFinished
                          ? 'mx-2 animate-spin fill-duoPurple-lighter text-duoPurple-default opacity-100 sm:text-3xl xl:text-4xl'
                          : 'mx-2 fill-duoPurple-lighter text-duoPurple-default opacity-100 sm:text-3xl xl:text-4xl'
                    }
                  />
                  {lessonState.isExerciseFinished ? (
                    <span className='font-extrabold'>00:00</span>
                  ) : (
                    <span className='font-extrabold'>
                      {lessonState.timeRemaining.minutes < 10
                        ? `0${lessonState.timeRemaining.minutes}`
                        : lessonState.timeRemaining.minutes}
                      :
                      {lessonState.timeRemaining.seconds < 10
                        ? `0${lessonState.timeRemaining.seconds}`
                        : lessonState.timeRemaining.seconds}
                    </span>
                  )}
                </div>
              </div>
              {lessonState.isExerciseStarted ? (
                <section className='flex w-full flex-row items-center justify-center gap-3'>
                  <p className='text-base font-extrabold opacity-75'>
                    Password:
                  </p>
                  <button
                    className='flex flex-row items-center gap-1 leading-5  opacity-75 hover:opacity-95'
                    onClick={() => {
                      lessonState.zipPassword
                        ? navigator.clipboard.writeText(
                            lessonState.zipPassword.toString()
                          )
                        : null;
                    }}
                  >
                    <FaCopy />
                    <p>{lessonState.zipPassword}</p>
                  </button>
                </section>
              ) : null}

              {lessonState.targetsToSubmit.length > 0 ? (
                <div className='mx-auto w-full'>
                  <DraggbleList
                    items={targetsDraggingState.itemsList}
                    isDisabled={false}
                    draggingState={targetsDraggingState}
                    draggingDispatch={targetsDraggingDispatch}
                    diraction={Diractions.COL}
                  />
                </div>
              ) : null}
            </div>

            <div
              // ref={buttonsBarRef} //buttons bar
              className={`
                                ${
                                  lessonState.isExerciseFinished &&
                                  lessonState.isExerciseSubmitted
                                    ? lessonState.totalScore === 100
                                      ? 'relative col-span-2 flex w-full items-center justify-center bg-duoGreen-lighter dark:border-duoGrayDark-light dark:bg-duoGrayDark-dark'
                                      : lessonState.totalScore === 0
                                        ? 'relative col-span-2 flex items-center justify-center bg-duoRed-lighter dark:border-duoGrayDark-light dark:bg-duoGrayDark-dark'
                                        : 'relative col-span-2 flex items-center justify-center bg-duoYellow-light dark:border-duoGrayDark-light  dark:bg-duoGrayDark-dark'
                                    : 'relative col-span-2 flex items-center justify-center border-t-2 dark:border-duoGrayDark-light'
                                }`}
            >
              <div
                className={
                  lessonState.isExerciseStarted
                    ? lessonState.isExerciseFinished &&
                      lessonState.isExerciseSubmitted
                      ? 'absolute w-[40%] 3xl:w-[50%]'
                      : 'absolute flex w-[45%] justify-between 3xl:w-[30%]'
                    : 'absolute active:-translate-y-1'
                }
              >
                {lessonState.isExerciseFinished &&
                lessonState.isExerciseSubmitted ? (
                  <div className='absolute flex h-full w-full items-center justify-between'>
                    <div className='flex h-full flex-none flex-row items-center '>
                      {lessonState.totalScore === 100 ? (
                        <FaCheck className='pop-animation mr-4 rounded-full bg-white p-3 text-6xl text-duoGreen-darkText' />
                      ) : (
                        <FaXmark
                          className={`pop-animation mr-4 rounded-full bg-white p-3 text-6xl ${
                            lessonState.totalScore === 0
                              ? 'text-duoRed-default'
                              : 'text-duoYellow-darkest'
                          }`}
                        />
                      )}
                      <div
                        className={`flex flex-col ${
                          lessonState.totalScore === 100 ? 'xl:gap-2' : ''
                        }`}
                      >
                        <span
                          className={`text-2xl font-extrabold ${
                            lessonState.totalScore === 100
                              ? 'text-duoGreen-darkText'
                              : lessonState.totalScore === 0
                                ? 'text-duoRed-default'
                                : 'text-duoYellow-darkest'
                          }`}
                        >
                          {lessonState.totalScore === 100
                            ? 'Currect!'
                            : 'Correct answers:'}
                        </span>

                        {
                          <div
                            className={`text-md font-semibold ${
                              lessonState.totalScore === 0
                                ? 'text-duoRed-default'
                                : 'text-duoYellow-dark'
                            }`}
                          >
                            <ul>
                              {lessonState.totalScore !== 100
                                ? lessonState.currentAnswers.map(
                                    (answer, answerKey) => (
                                      <li key={answer._id}>
                                        {answerKey !== 0
                                          ? `, ${answer.name}`
                                          : answer.name}
                                      </li>
                                    )
                                  )
                                : null}
                            </ul>
                          </div>
                        }

                        <button
                          className={`flex flex-row items-center justify-start font-extrabold uppercase dark:opacity-70 ${
                            lessonState.totalScore === 100
                              ? 'text-duoGreen-text hover:text-duoGreen-midText'
                              : lessonState.totalScore === 0
                                ? 'text-duoRed-default'
                                : 'text-duoYellow-dark hover:text-duoYellow-darker'
                          }`}
                        >
                          <FiFlag className='mr-2 -scale-x-100' />
                          <span> report</span>
                        </button>
                      </div>
                    </div>

                    <Button
                      label={'CONTINUE'}
                      color={
                        lessonState.totalScore === 100
                          ? ButtonColors.GREEN
                          : lessonState.totalScore === 0
                            ? ButtonColors.RED
                            : ButtonColors.YELLOW
                      }
                      style={'w-[20rem] 3xl:w-[30rem] text-2xl tracking-widest'}
                      onClick={continueLesson}
                    />
                  </div>
                ) : lessonState.isExerciseStarted ? (
                  <>
                    {lessonState.currentExercise &&
                    lessonState.currentExercise.files &&
                    lessonState.currentExercise.files.length > 0 ? (
                      <Button
                        color={ButtonColors.PURPLE}
                        icon={faFileArrowDown}
                        style={'text-2xl tracking-widest'}
                        onClick={() => {
                          !!lessonState.currentExercise
                            ? downloadRecord(
                                lessonState.currentExercise.files[0].fileName,
                                lessonState.currentExercise.type
                              )
                            : null;
                        }}
                        isLoading={downloadingFile}
                      />
                    ) : null}
                    <Button
                      label={'ADD TARGET'}
                      color={ButtonColors.BLUE}
                      style={
                        'w-[15rem] 3xl:w-[20rem] flex-none text-2xl tracking-widest'
                      }
                      onClick={addTarget}
                    />
                    <Button
                      label={'SUBMIT'}
                      color={ButtonColors.GREEN}
                      style={
                        'w-[15rem] 3xl:w-[20rem] text-2xl flex-none tracking-widest'
                      }
                      onClick={() => {
                        const userId = userStore.userId;
                        const nextLessonId = userStore.nextLessonId;
                        userId !== undefined && nextLessonId !== undefined
                          ? submitExercise({
                              lessonState,
                              lessonDispatch,
                              addAlert,
                              userId,
                              nextLessonId,
                            })
                          : null;
                      }}
                    />
                  </>
                ) : (
                  <section className='flex flex-row items-center gap-6'>
                    {lessonState.currentExercise &&
                    lessonState.currentExercise.files &&
                    lessonState.currentExercise.files.length > 0 ? (
                      <Button
                        label={'DOWNLOAD REC'}
                        color={ButtonColors.PURPLE}
                        style={
                          'w-[20rem] 3xl:w-[30rem] text-2xl tracking-widest'
                        }
                        onClick={() => {
                          !!lessonState.currentExercise
                            ? downloadRecord(
                                lessonState.currentExercise.files[0].fileName,
                                lessonState.currentExercise.type
                              )
                            : null;
                        }}
                        isLoading={downloadingFile}
                      />
                    ) : null}
                    <Button
                      label={'START CLOCK'}
                      color={ButtonColors.PURPLE}
                      style={'w-[20rem] 3xl:w-[30rem] text-2xl tracking-widest'}
                      onClick={() => {
                        !!userStore.nextLessonId &&
                        !!userStore.userId &&
                        !!lessonState.currentExercise
                          ? startCurrentExercise(
                              userStore.nextLessonId,
                              lessonState.currentExercise._id,
                              userStore.userId
                            )
                          : null;
                      }}
                      isLoading={isLoading}
                    />
                  </section>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          lesson not found.
          {userStore.userId ? <h1>1</h1> : <h1>2</h1>}
        </div>
      )}
    </div>
  );
};

export default Lesson;
function async() {
  throw new Error('Function not implemented.');
}
