'use client';
import { useEffect, useReducer, useRef } from 'react';
import { useRouter } from 'next/navigation';

import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import { TbClockHour12 } from 'react-icons/tb';
import { FaCheck } from 'react-icons/fa6';
import { FaXmark } from 'react-icons/fa6';
import { FiFlag } from 'react-icons/fi';

import Button, { ButtonColors } from '@/components/Button/page';
import Alert from '@/components/Alert/page';
import ProgressBar from '@/components/ProgressBar/page';
import Dropdown, { DropdownSizes } from '@/components/Dropdown/page';

import useStore from '../store/useStore';
import { useUserStore } from '../store/stores/useUserStore';
import { useTargetStore } from '../store/stores/useTargetStore';
import { AlertSizes, useAlertStore } from '../store/stores/useAlertStore';

import { getExercisesData } from '@/app/API/classes-service/lessons/functions';
import {
  getAnswersByExerciseId,
  getRelevantByFSAId,
} from '../API/classes-service/exercises/FSA/functions';
import {
  getResultsByLessonAndUser,
  startExercise,
  submitExercise,
} from '../API/classes-service/results/functions';
import { getTargetsList } from '../API/classes-service/targets/functions';
import SortableItem from '@/components/SortableItem/page';
import { updateNextLessonIdForUser } from '../API/users-service/users/functions';
import {
  calculateTimeRemaining,
  lessonAction,
  lessonReducer,
} from '@/reducers/studentView/lessonReducer';
import { draggingAction, draggingReducer } from '@/reducers/dragReducer';
import DraggbleList, { Diractions } from '@/components/DraggableList/page';

export default function Page() {
  const router = useRouter();

  const userStore = {
    nextLessonId: useStore(useUserStore, (state) => state.nextLessonId),
    userId: useStore(useUserStore, (state) => state.userId),
  };
  const targetsList = useStore(useTargetStore, (state) => state.targets);
  const addAlert = useAlertStore.getState().addAlert;

  const exerciseRef = useRef<HTMLDivElement | null>(null);
  const infoBarRaf = useRef<HTMLDivElement | null>(null);
  // const buttonsBarRef = useRef<HTMLDivElement | null>(null);

  const initialLessonState = {
    exercisesData: [],
    lessonResults: [],
    exercisesIds: [],
    numOfExercisesMade: 0,
    currentExercise: undefined,
    relevant: [],
    currentAnswers: [],
    currentResult: undefined,
    grabbedTargetId: undefined,
    totalScore: -1,
    isExerciseStarted: false,
    isExerciseFinished: false,
    isTimerRunning: false,
    timeRemaining: { minutes: 0, seconds: 0 },
    selectedTargetIndex: -1,
    targetsToSubmit: [],
    targetFromDropdown: null,
    showPlaceholder: true,
    fadeEffect: true,
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

  useEffect(() => {
    const fetchTargets = async () => {
      await getTargetsList();
    };
    if (!!!targetsList) {
      fetchTargets();
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (userStore.nextLessonId) {
        const response = await getExercisesData(userStore.nextLessonId);
        response.length > 0
          ? lessonDispatch({
              type: lessonAction.SET_EXERCISES_DATA,
              payload: response,
            })
          : null;
      }
    };

    const fetchResultsList = async () => {
      if (userStore.nextLessonId && userStore.userId) {
        const response = await getResultsByLessonAndUser(
          userStore.nextLessonId,
          userStore.userId
        );

        response
          ? lessonDispatch({
              type: lessonAction.SET_LESSON_RESULTS,
              payload: response,
            })
          : null;
      }
    };

    fetchData();
    fetchResultsList();
  }, [userStore.nextLessonId, userStore.userId, lessonState.isExerciseStarted]);

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
      if (lessonState.lessonResults.length === 0) {
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
            payload: undefined,
          });
        }
      }
    }
  }, [lessonState.exercisesData, lessonState.lessonResults]);

  useEffect(() => {
    const fetchRelevantData = async () => {
      if (lessonState.currentExercise) {
        const currentExerciseId = lessonState.currentExercise._id;
        const response = await getRelevantByFSAId(currentExerciseId);
        response.length > 0
          ? lessonDispatch({
              type: lessonAction.SET_RELEVANT,
              payload: response,
            })
          : null;
      }
    };

    const fetchAnswersData = async () => {
      if (lessonState.currentExercise) {
        const currentExerciseId = lessonState.currentExercise._id;
        const response = await getAnswersByExerciseId(currentExerciseId);
        response.length > 0
          ? lessonDispatch({
              type: lessonAction.SET_CURRENT_ANSWERS,
              payload: response,
            })
          : null;
      }
    };

    if (lessonState.currentExercise) {
      if (!lessonState.isExerciseFinished) {
        lessonDispatch({
          type: lessonAction.SET_NUM_OF_EXERCISES_MADE,
          payload: lessonState.exercisesIds.indexOf(
            lessonState.currentExercise._id
          ),
        });
      } else {
        lessonDispatch({
          type: lessonAction.SET_NUM_OF_EXERCISES_MADE,
          payload:
            lessonState.exercisesIds.indexOf(lessonState.currentExercise._id) +
            1,
        });
      }
    }

    fetchRelevantData();
    fetchAnswersData();
  }, [
    userStore.userId,
    lessonState.currentExercise,
    lessonState.isExerciseStarted,
    lessonState.isExerciseFinished,
    lessonState.exercisesIds,
  ]);

  useEffect(() => {
    if (lessonState.currentResult && lessonState.currentExercise) {
      if (
        lessonState.currentResult.exerciseId === lessonState.currentExercise._id
      ) {
        if (
          lessonState.currentResult.date &&
          lessonState.currentResult.score === -1
        ) {
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
  }, [lessonState.currentResult, lessonState.currentExercise]);

  useEffect(() => {
    console.log(' !isExerciseFinished', !lessonState.isExerciseFinished);
    !lessonState.isExerciseFinished
      ? lessonDispatch({
          type: lessonAction.SET_FADE_EFFECT,
          payload: false,
        })
      : null;
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
        const seconds = 60 * (totalMinutesForExercise - minutes);
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

  const startCurrentExercise = async (
    nextLessonId: string,
    exerciseId: string,
    userId: string
  ) => {
    const response = await startExercise(nextLessonId, exerciseId, userId);
    if (response) {
      lessonDispatch({
        type: lessonAction.START_TIMER,
      });
    }
  };

  const handleTargetsDropdown = (selectedTargetName: string) => {
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
  };

  const addTarget = () => {
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
  };

  //   const handleDragMove = (event: DragEndEvent) => {
  //     const { active, over } = event;
  //     if (over && active.id !== over.id) {
  //       setTargetsToSubmit((items) => {
  //         const ids = items.map((item) => item.id);
  //         const activeIndex = ids.indexOf(active.id as string);
  //         const overIndex = ids.indexOf(over.id as string);
  //         return arrayMove(items, activeIndex, overIndex);
  //       });
  //     }
  //   };

  //   const handleDragEnd = (event: DragEndEvent) => {
  //     const { active, over } = event;
  //     setGrabbedTargetId('released');

  //     if (over && active.id !== over.id) {
  //       setTargetsToSubmit((items) => {
  //         const ids = items.map((item) => item.id);
  //         const activeIndex = ids.indexOf(active.id as string);
  //         const overIndex = ids.indexOf(over.id as string);
  //         return arrayMove(items, activeIndex, overIndex);
  //       });
  //     }
  //   };

  const submitCurrentExercise = async () => {
    let scoreByTargets: number = -1;
    let scoreByTime: number = -1;
    let totalScoreToSubmit: number = -1;
    if (lessonState.targetsToSubmit.length === 0) {
      addAlert('Please select a target.', AlertSizes.small);
      return;
    }
    if (lessonState.currentResult && lessonState.currentExercise) {
      const resultId = lessonState.currentResult._id;

      const answersIds = lessonState.currentExercise.answersList;
      console.log('answersIds', answersIds, answersIds.length);
      const correctAnswers = lessonState.targetsToSubmit.filter((target) =>
        answersIds.includes(target.id)
      );
      console.log('correctAnswers', correctAnswers);
      if (correctAnswers.length === 0) {
        //all tragets was guessed wrong
        totalScoreToSubmit = 0;
        scoreByTargets = 0;
      } else if (
        correctAnswers.length === answersIds.length &&
        lessonState.targetsToSubmit.length === answersIds.length
      ) {
        scoreByTargets = 100;
        console.log('scoreByTargets', scoreByTargets);
      } else if (lessonState.targetsToSubmit.length > answersIds.length) {
        const firstAnswer: string = correctAnswers[0].id;
        if (answersIds.indexOf(firstAnswer) === 0) {
          scoreByTargets = 90;

          console.log('scoreByTargets', scoreByTargets);
        } else {
          scoreByTargets = 80;
          console.log('scoreByTargets', scoreByTargets);
        }
      } else if (correctAnswers.length < answersIds.length) {
        scoreByTargets = 85;
        console.log('scoreByTargets', scoreByTargets);
      }
      const timeBuffersMinutes = lessonState.currentExercise.timeBuffers.map(
        (timeBuffer) => timeBuffer.timeBuffer
      );

      const totalMinutesForExercise = timeBuffersMinutes.reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        0
      );

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

      scoreByTime = 100;

      totalScoreToSubmit !== 0
        ? (totalScoreToSubmit = 0.6 * scoreByTargets + 0.4 * scoreByTime)
        : null;
      lessonDispatch({
        type: lessonAction.SET_TOTAL_SCORE,
        payload: totalScoreToSubmit,
      });
      if (
        totalScoreToSubmit === -1 ||
        scoreByTime === -1 ||
        scoreByTargets === -1
      ) {
        console.log(
          'error',
          totalScoreToSubmit === -1,
          scoreByTime === -1,
          scoreByTargets === -1
        );
        addAlert('error', AlertSizes.small);
        return;
      }

      const resultToSubmit = {
        _id: resultId,
        userId: userStore.userId,
        lessonId: userStore.nextLessonId,
        exerciseId: lessonState.currentExercise._id,
        answers: answersIds,
        score: totalScoreToSubmit,
      };

      const response = await submitExercise(resultToSubmit);
      if (response) {
        lessonDispatch({ type: lessonAction.STOP_TIMER });
      }
    }
  };

  const continueLesson = async () => {
    if (lessonState.currentExercise && userStore.userId) {
      const lengthOfLesson = lessonState.exercisesData.length;
      const indexOfCurrentExercise = lessonState.exercisesData.indexOf(
        lessonState.currentExercise
      );

      if (lengthOfLesson === indexOfCurrentExercise + 1) {
        //last exercise
        console.log('last exercise');
        const response = await updateNextLessonIdForUser(userStore.userId);
        console.log('last exercise- response', response);
        if (response) {
          router.push('/learn');
        }
      } else {
        lessonDispatch({
          type: lessonAction.SET_CURRENT_EXERCISE,
          payload: lessonState.exercisesData[indexOfCurrentExercise + 1],
        });
        lessonDispatch({
          type: lessonAction.SET_IS_EXERCISE_STARTED,
          payload: false,
        });
        lessonDispatch({
          type: lessonAction.SET_IS_EXERCISE_FINISHED,
          payload: false,
        });
        lessonDispatch({ type: lessonAction.SET_TOTAL_SCORE, payload: -1 });
        lessonDispatch({
          type: lessonAction.SET_TARGETS_TO_SUBMIT,
          payload: [],
        });
      }
    }
  };

  return (
    <div className='relative w-full'>
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
                  <div className='absolute h-full w-full font-semibold text-duoGray-darkest'>
                    <div className='mx-auto grid w-[80%] grid-rows-[min-content] items-start justify-center 3xl:h-fit'>
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
                              key={relevantTargetIndex}
                              className='mr-5 flex flex-row items-end self-end'
                            >
                              <div className='relative '>
                                <div
                                  className={`border-border-duoGray-regular group flex flex-row items-center justify-center rounded-xl border-2 border-b-4 py-4 pl-[45px] pr-[30px] text-lg font-bold sm:min-w-[7rem] lg:min-w-[10rem]  ${
                                    lessonState.isExerciseStarted
                                      ? !lessonState.isExerciseFinished
                                        ? 'cursor-pointer active:translate-y-[1px] active:border-b-2'
                                        : 'cursor-default'
                                      : 'cursor-default'
                                  }
                                                               ${
                                                                 lessonState.isExerciseStarted &&
                                                                 !lessonState.isExerciseFinished &&
                                                                 relevantTargetIndex ===
                                                                   lessonState.selectedTargetIndex
                                                                   ? 'border-duoBlue-dark bg-duoBlue-lightest text-duoBlue-text'
                                                                   : 'border-border-duoGray-regular text-duoGray-dark hover:border-duoGray-buttonBorderHover hover:bg-duoGray-lighter group-hover:text-duoGray-darkText'
                                                               }
                                                                `}
                                  onClick={() => {
                                    if (
                                      !lessonState.isExerciseFinished &&
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
                                    className={`absolute left-3 inline-flex shrink-0 items-center justify-center rounded-lg border-2 
                                                                    font-bold sm:h-[25px] sm:w-[25px] sm:text-sm lg:h-[30px] lg:w-[30px] xl:text-xl                                                                     
                                                                    ${
                                                                      lessonState.isExerciseStarted &&
                                                                      !lessonState.isExerciseFinished &&
                                                                      relevantTargetIndex ===
                                                                        lessonState.selectedTargetIndex
                                                                        ? 'border-duoBlue-dark text-duoBlue-text'
                                                                        : 'text-duoGray-dark group-hover:border-duoGray-buttonBorderHover group-hover:text-duoGray-darkText'
                                                                    }
                                                                    `}
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
                            lessonState.isExerciseFinished
                          }
                          size={DropdownSizes.SMALL}
                          className={'z-10 mt-5 w-[16rem]'}
                        />
                      ) : (
                        <Dropdown
                          isSearchable={false}
                          placeholder={'target'}
                          items={['']}
                          value={''}
                          onChange={() => console.log('')}
                          isDisabled={!lessonState.isExerciseStarted}
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
              className='right-0 flex flex-col items-center justify-start'
            >
              <div className='mb-3 mt-5 flex w-[80%] flex-col rounded-2xl border-2 text-center text-duoGray-darker sm:px-1 sm:py-2 xl:px-4 xl:py-6 3xl:mb-5'>
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
                  <span className='font-extrabold'>
                    {lessonState.timeRemaining.minutes < 10
                      ? `0${lessonState.timeRemaining.minutes}`
                      : lessonState.timeRemaining.minutes}
                    :
                    {lessonState.timeRemaining.seconds < 10
                      ? `0${lessonState.timeRemaining.seconds}`
                      : lessonState.timeRemaining.seconds}
                  </span>
                </div>
              </div>
              {lessonState.targetsToSubmit.length > 0 ? (
                <DraggbleList
                  items={targetsDraggingState.itemsList}
                  isDisabled={false}
                  draggingState={targetsDraggingState}
                  draggingDispatch={targetsDraggingDispatch}
                  diraction={Diractions.ROW}
                />
              ) : // <div className='flex h-fit w-[80%] rounded-2xl border-2 px-4 py-6'>
              //   <div className='flex h-fit w-full flex-col items-center justify-start text-duoGray-darker'>
              //     <span className='w-full self-start font-extrabold md:text-xl xl:mb-6 xl:text-2xl 3xl:mb-12 3xl:text-4xl'>
              //       Suspected targets
              //     </span>
              //     <div className='h-fit w-full'>
              //       <div className='flex h-fit w-full flex-col items-center justify-center text-3xl font-bold 3xl:text-4xl'>
              //         <DndContext
              //           collisionDetection={closestCenter}
              //           onDragStart={(event: DragEndEvent) => {
              //             const { active } = event;
              //             setGrabbedTargetId(active.id.toString());
              //           }}
              //           onDragMove={handleDragMove}
              //           onDragEnd={handleDragEnd}
              //         >
              //           <SortableContext
              //             items={lessonState.targetsToSubmit}
              //             strategy={verticalListSortingStrategy}
              //           >
              //             <div className='flex h-full w-full flex-col items-center justify-center'>
              //               {lessonState.targetsToSubmit.map(
              //                 (targetObject, targetObjectIndex) => (
              //                   <SortableItem
              //                     id={targetObject.id}
              //                     name={targetObject.name}
              //                     key={targetObjectIndex}
              //                     isGrabbed={
              //                       grabbedTargetId
              //                         ? grabbedTargetId === targetObject.id
              //                         : false
              //                     }
              //                     isDisabled={isExerciseFinished}
              //                   />
              //                 )
              //               )}
              //             </div>
              //           </SortableContext>
              //         </DndContext>
              //       </div>
              //     </div>
              //   </div>
              // </div>
              null}
            </div>

            <div
              // ref={buttonsBarRef} //buttons bar
              className={`
                                ${
                                  lessonState.isExerciseFinished
                                    ? lessonState.totalScore === 100
                                      ? 'relative col-span-2 flex w-full items-center justify-center bg-duoGreen-lighter'
                                      : lessonState.totalScore === 0
                                        ? 'relative col-span-2 flex items-center justify-center bg-duoRed-lighter'
                                        : 'relative col-span-2 flex items-center justify-center bg-duoYellow-light'
                                    : 'relative col-span-2 flex items-center justify-center border-t-2'
                                }`}
            >
              <div
                className={
                  lessonState.isExerciseStarted
                    ? lessonState.isExerciseFinished
                      ? 'absolute w-[60%] 3xl:w-[50%]'
                      : 'absolute flex w-[45%] justify-between 3xl:w-[30%]'
                    : 'absolute active:-translate-y-1'
                }
              >
                {lessonState.isExerciseFinished ? (
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
                                      <li key={answerKey}>
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
                          className={`flex flex-row items-center justify-start font-extrabold uppercase ${
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
                    <Button
                      label={'ADD TARGET'}
                      color={ButtonColors.BLUE}
                      style={
                        'w-[15rem] 3xl:w-[20rem] flex-none text-2xl tracking-widest'
                      }
                      onClick={() => {
                        addTarget();
                      }}
                    />
                    <Button
                      label={'SUBMIT'}
                      color={ButtonColors.GREEN}
                      style={
                        'w-[15rem] 3xl:w-[20rem] text-2xl flex-none tracking-widest'
                      }
                      onClick={submitCurrentExercise}
                    />
                  </>
                ) : (
                  <Button
                    label={'START CLOCK'}
                    color={ButtonColors.PURPLE}
                    style={'w-[20rem] 3xl:w-[30rem] text-2xl tracking-widest'}
                    onClick={() => {
                      userStore.nextLessonId &&
                      userStore.userId &&
                      lessonState.currentExercise
                        ? startCurrentExercise(
                            userStore.nextLessonId,
                            lessonState.currentExercise._id,
                            userStore.userId
                          )
                        : null;
                    }}
                  />
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
}
