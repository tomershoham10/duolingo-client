'use client';
import { useState, useRef, useReducer, useEffect, useCallback } from 'react';

import { useStore } from 'zustand';
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';

import { useTargetStore } from '@/app/store/stores/useTargetStore';
import { AlertSizes, useAlertStore } from '@/app/store/stores/useAlertStore';

import Textbox, { FontSizes } from '@/components/Textbox/page';
import Dropdown, { DropdownSizes } from '@/components/Dropdown/page';

import { TiPlus } from 'react-icons/ti';
import { TbTargetArrow } from 'react-icons/tb';
import SortableItem from '@/components/SortableItem/page';
import { FaRegTrashAlt } from 'react-icons/fa';
import Slider from '@/components/Slider/page';
import { useContextMenuStore } from '@/app/store/stores/useContextMenuStore';
import { useInfoBarStore } from '@/app/store/stores/useInfoBarStore';
import { useCreateExerciseStore } from '@/app/store/stores/useCreateExerciseStore';
import {
  exerciseDataAction,
  exerciseDataReducer,
} from '@/reducers/exerciseDataReducer';
import { draggingAction, draggingReducer } from '@/reducers/dragReducer';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import {
  TimeBuffersAction,
  timeBuffersReducer,
} from '@/reducers/timeBuffersReducer';
import DraggbleList, { Diractions } from '@/components/DraggableList/page';
import PlusButton from '@/components/PlusButton/page';

library.add(faPlus);

enum FSAFieldsType {
  DESCRIPTION = 'description',
  RELEVANT = 'relevant',
  TIMEBUFFERS = 'timeBuffers',
}

const ExerciseDataSection: React.FC = () => {
  const updateExerciseToSubmit = {
    answersList: useStore(useCreateExerciseStore, (state) => state.answersList),
    updateDescription: useCreateExerciseStore.getState().updateDescription,
    updateRelevant: useCreateExerciseStore.getState().updateRelevant,
    updateTimeBuffers: useCreateExerciseStore.getState().updateTimeBuffers,
  };

  console.log(
    'updateExerciseToSubmit.answersList',
    updateExerciseToSubmit.answersList
  );
  const addAlert = useAlertStore.getState().addAlert;
  const targetsList = useStore(useTargetStore, (state) => state.targets);
  const recordLength = useStore(
    useCreateExerciseStore,
    (state) => state.recordLength
  );
  const answersList = useStore(
    useCreateExerciseStore,
    (state) => state.answersList
  );
  const contextMenuStore = {
    toggleMenuOpen: useContextMenuStore.getState().toggleMenuOpen,
    setCoordinates: useContextMenuStore.getState().setCoordinates,
    setContent: useContextMenuStore.getState().setContent,
  };

  const initialExerciseDataState = {
    description: undefined,
    relevant: [],
    unfilledFields: [],
    showPlaceholder: true,
    targetFromDropdown: null,
  };

  const initialRelevantDraggingState = {
    grabbedItemId: 'released',
    itemsList: [],
  };

  const initialTimeBuffersState = {
    rangeIndex: 1,
    timeBuffersScores: [100],
    timeBufferRangeValues: [recordLength ? recordLength / 2 : 10],
    addedValueLeftPerc: -1,
  };

  const [exerciseDataState, exerciseDataDispatch] = useReducer(
    exerciseDataReducer,
    initialExerciseDataState
  );

  const [relevantDraggingState, relevantDraggingDispatch] = useReducer(
    draggingReducer,
    initialRelevantDraggingState
  );

  const [timeBuffersState, timeBuffersDispatch] = useReducer(
    timeBuffersReducer,
    initialTimeBuffersState
  );

  const [unfilledFields, setUnfilledFields] = useState<FSAFieldsType[]>([]);

  const setRelevant = useCallback(() => {
    exerciseDataDispatch({
      type: exerciseDataAction.SET_RELEVANT,
      payload: relevantDraggingState.itemsList,
    });
  }, [relevantDraggingState.itemsList]);

  useEffect(() => {
    setRelevant();
  }, [setRelevant]);

  const setExerciseStore = useCallback(() => {
    exerciseDataState.description
      ? updateExerciseToSubmit.updateDescription(exerciseDataState.description)
      : null;
    updateExerciseToSubmit.updateRelevant(
      exerciseDataState.relevant.map((item) => item.id)
    );
    updateExerciseToSubmit.updateTimeBuffers(
      timeBuffersState.timeBufferRangeValues.map((timeVal, timeValIndex) => ({
        timeBuffer: timeVal,
        grade: timeBuffersState.timeBuffersScores[timeValIndex],
      }))
    );
  }, [exerciseDataState, timeBuffersState]);

  useEffect(() => {
    setExerciseStore();
  }, [setExerciseStore]);

  const handleTargetsDropdown = (selectedTargetName: string) => {
    exerciseDataDispatch({
      type: exerciseDataAction.SET_SHOW_PLACE_HOLDER,
      payload: false,
    });

    if (targetsList) {
      const selectedTarget = targetsList.find(
        (target) => target.name === selectedTargetName
      );

      if (selectedTarget) {
        exerciseDataDispatch({
          type: exerciseDataAction.SET_TARGET_FROM_DROPDOWN,
          payload: selectedTarget,
        });
      }
    }
  };

  const addTargetToRelevant = () => {
    if (exerciseDataState.targetFromDropdown) {
      const relevantIds = exerciseDataState.relevant.map((target) => target.id);
      if (!relevantIds.includes(exerciseDataState.targetFromDropdown._id)) {
        exerciseDataDispatch({
          type: exerciseDataAction.ADD_RELEVANT,
          payload: {
            id: exerciseDataState.targetFromDropdown._id,
            name: exerciseDataState.targetFromDropdown.name,
          },
        });
        relevantDraggingDispatch({
          type: draggingAction.ADD_ITEM,
          payload: {
            id: exerciseDataState.targetFromDropdown._id,
            name: exerciseDataState.targetFromDropdown.name,
          },
        });
      } else {
        addAlert('target already included.', AlertSizes.small);
      }
    } else {
      addAlert('please select a target.', AlertSizes.small);
    }
  };

  const handleContextMenu = (
    event: React.MouseEvent<HTMLDivElement>,
    left: number,
    right: number
  ) => {
    event.preventDefault();
    contextMenuStore.toggleMenuOpen();
    contextMenuStore.setCoordinates({ pageX: event.pageX, pageY: event.pageY });
    contextMenuStore.setContent([
      {
        icon: faPlus,
        onClick: () => {
          console.log('clicked');

          timeBuffersDispatch({
            type: TimeBuffersAction.SET_ADDED_VALUE_LEFT_PERC,
            payload: Math.round(100 * ((event.pageX - left) / (right - left))),
          });

          contextMenuStore.toggleMenuOpen();
        },
      },
    ]);
    console.log(left, right, '%');
  };

  const handleTimeBufferRange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index?: number
  ) => {
    e.preventDefault();

    index !== undefined
      ? timeBuffersDispatch({
          type: TimeBuffersAction.EDIT_TIME_VALS_ARRAY,
          payload: { index: index, newVal: Number(e.target.value) },
        })
      : null;
  };

  const deleteTimeBuffer = (index: number) => {
    console.log('new exercise - deleteTimeBuffer - index', index);
    timeBuffersDispatch({
      type: TimeBuffersAction.SET_RANGE_INDEX,
      payload: timeBuffersState.rangeIndex - 1,
    });

    timeBuffersDispatch({
      type: TimeBuffersAction.DELETE_TIME_VAL,
      payload: index,
    });

    timeBuffersDispatch({
      type: TimeBuffersAction.SET_SCORES_ARRAY,
      payload: timeBuffersState.timeBuffersScores.filter(
        (item) => item !== timeBuffersState.timeBuffersScores[index]
      ),
    });
  };

  const handleNewScore = (newScore: number, newTime: number) => {
    const minutesArrays = timeBuffersState.timeBufferRangeValues;

    if (minutesArrays.includes(newTime) || minutesArrays[0] > newTime) {
      return false;
    }
    const pervScoreIndex = findPervScoreIndex(newScore, newTime);
    console.log('pervScoreIndex', pervScoreIndex);
    pervScoreIndex !== undefined
      ? addNewScoreBuffer(pervScoreIndex, newScore, newTime)
      : null;
  };

  const findPervScoreIndex = (
    newScore: number,
    newTime: number
  ): number | undefined => {
    const scoresArrays = timeBuffersState.timeBuffersScores;
    console.log('scoresArrays', scoresArrays);

    if (scoresArrays[scoresArrays.length - 1] > newScore) {
      console.log('scoresArrays.length-1', scoresArrays.length - 1);
      return scoresArrays.length - 1;
    }
    for (let i = scoresArrays.length - 1; i >= 0; i--) {
      console.log(i, scoresArrays[i], newScore, scoresArrays[i - 1]);
      console.log(
        'newScore > scoresArrays[i]',
        newScore > scoresArrays[i],
        'newScore < scoresArrays[i - 1]',
        newScore < scoresArrays[i - 1]
      );
      if (scoresArrays[i] < newScore && newScore < scoresArrays[i - 1]) {
        return i;
      }
    }
  };

  const addNewScoreBuffer = (
    pervScoreIndex: number,
    newScore: number,
    newTime: number
  ) => {
    console.log('pervScoreIndex', pervScoreIndex);
    timeBuffersDispatch({
      type: TimeBuffersAction.SET_RANGE_INDEX,
      payload: timeBuffersState.rangeIndex + 1,
    });

    timeBuffersDispatch({
      type: TimeBuffersAction.ADD_SCORE,
      payload: newScore,
    });

    timeBuffersDispatch({
      type: TimeBuffersAction.ADD_VAL_TIME_ARRAY,
      payload: newTime,
    });
  };

  return (
    <div className='mx-auto flex h-full w-full flex-col tracking-wide text-duoGray-darkest dark:text-duoGrayDark-lightest'>
      <div className='mx-auto w-full'>
        <div>
          <span className='my-3 text-2xl font-bold'>Description:</span>
          <div className='mb-4 mt-3'>
            <Textbox
              isEditMode={false}
              fontSizeProps={FontSizes.MEDIUM}
              placeHolder={'Add desription...'}
              value={exerciseDataState.description}
              onChange={(text: string) => {
                exerciseDataDispatch({
                  type: exerciseDataAction.SET_DESCRIPTION,
                  payload: text,
                });
                // setDescription(text);
                updateExerciseToSubmit.updateDescription(text);
              }}
            />
          </div>
        </div>
        <div className='w-full'>
          <span className='my-3 text-2xl font-bold'>Targets list:</span>
          {targetsList ? (
            <div className='mb-4 mt-3 flex w-fit flex-row items-center justify-between gap-3'>
              <div className='w-[15rem] 3xl:w-[20rem]'>
                <Dropdown
                  isSearchable={true}
                  placeholder={'targets'}
                  items={targetsList.map((target) => target.name)}
                  value={
                    exerciseDataState.showPlaceholder
                      ? undefined
                      : exerciseDataState.targetFromDropdown
                        ? exerciseDataState.targetFromDropdown.name
                        : undefined
                  }
                  onChange={handleTargetsDropdown}
                  size={DropdownSizes.DEFAULT}
                />
              </div>

              <PlusButton label={'relevant'} onClick={addTargetToRelevant} />

              {/* <div className='group my-3 flex cursor-pointer flex-row items-center justify-start'>
                <button
                  className='flex h-8 w-8 items-center justify-center rounded-full bg-duoGray-lighter text-2xl group-hover:w-fit group-hover:rounded-2xl group-hover:bg-duoGray-hover group-hover:px-2 group-hover:py-3 dark:bg-duoGrayDark-light dark:group-hover:bg-duoGrayDark-lighter lg:h-9 lg:w-9'
                  onClick={addTargetToRelevant}
                >
                  <TiPlus />
                  <span className='ml-1 hidden text-sm font-bold group-hover:block lg:text-base lg:font-extrabold'>
                    relevant
                  </span>
                </button>
              </div> */}
            </div>
          ) : null}
        </div>

        <div className='mb-4'>
          <div>
            <span className='my-3 text-2xl font-bold'>Relevant:</span>
            {relevantDraggingState.itemsList.length > 0 ? (
              <DraggbleList
                items={relevantDraggingState.itemsList}
                isDisabled={false}
                draggingState={relevantDraggingState}
                draggingDispatch={relevantDraggingDispatch}
                diraction={Diractions.ROW}
              />
            ) : (
              <>
                <br />
                <span className='font-semibold text-duoGray-dark opacity-70'>
                  please select a target.
                </span>
              </>
            )}
          </div>
        </div>

        <div className='mb-4'>
          <div>
            <span className={`my-3 text-2xl font-bold ${'' ? '' : ''}`}>
              Answers:
            </span>
            {!!answersList && answersList.length > 0 ? (
              <div className='flex h-fit w-full select-none flex-col items-start justify-between font-bold'>
                <ul>
                  {!!answersList &&
                    answersList.map((answer) => (
                      <li
                        key={
                          targetsList.filter(
                            (target) => target.name === answer
                          )[0]._id
                        }
                        className='flex h-[5rem] min-w-fit flex-none items-center justify-start'
                      >
                        <div className='border-border-duoGray-regular w-full flex-none cursor-default rounded-xl border-2 border-b-4 px-5 py-4 text-lg font-bold active:translate-y-[1px] active:border-b-2 dark:border-duoGrayDark-light'>
                          <span className='relative flex items-center justify-center text-ellipsis text-center'>
                            {!!targetsList.filter(
                              (target) => target.name === answer
                            )[0] ? (
                              targetsList.filter(
                                (target) => target.name === answer
                              )[0].name
                            ) : (
                              <span className='font-semibold text-duoGray-dark opacity-70'>
                                problem.
                              </span>
                            )}
                          </span>
                        </div>
                      </li>
                    ))}
                </ul>
              </div>
            ) : (
              <>
                <br />
                <span className='font-semibold text-duoGray-dark opacity-70'>
                  please select a target.
                </span>
              </>
            )}
          </div>
        </div>

        <div className='relative flex flex-col items-start justify-center'>
          <div className='my-3 flex w-fit flex-row items-center justify-between gap-3'>
            <span
              className={`my-3 text-2xl font-bold ${
                unfilledFields.includes(FSAFieldsType.TIMEBUFFERS)
                  ? 'text-duoRed-default'
                  : ''
              }`}
            >
              Time Buffers:
            </span>
          </div>

          <div className='relative mt-6 flex w-full pb-[5rem] '>
            <Slider
              isMultiple={true}
              numberOfSliders={timeBuffersState.rangeIndex}
              min={0}
              max={!!recordLength ? recordLength : 10}
              onContextMenu={handleContextMenu}
              step={1 / 6}
              value={timeBuffersState.timeBufferRangeValues}
              tooltipsValues={timeBuffersState.timeBuffersScores}
              onChange={handleTimeBufferRange}
              deleteNode={(index) => deleteTimeBuffer(index)}
              addedValLeftPercentage={timeBuffersState.addedValueLeftPerc}
              onSave={(newScore, newTime) => handleNewScore(newScore, newTime)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default ExerciseDataSection;
