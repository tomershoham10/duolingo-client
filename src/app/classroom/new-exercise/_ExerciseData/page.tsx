'use client';
import { useState, useRef, useReducer, useEffect } from 'react';

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
  submitExerciseDataAction,
  submitExerciseReducer,
} from '@/reducers/submitExerciseDataReducer';
import { draggingAction, draggingReducer } from '@/reducers/dragReducer';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

library.add(faPlus);

enum FSAFieldsType {
  DESCRIPTION = 'description',
  RELEVANT = 'relevant',
  TIMEBUFFERS = 'timeBuffers',
}

const ExerciseDataSection: React.FC = () => {
  const updateExerciseToSubmit = {
    updateDescription: useCreateExerciseStore.getState().updateDescription,
  };
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

  const timeBufferGradeDivRef = useRef<HTMLDivElement | null>(null);

  const initialSubmitExerciseState = {
    description: undefined,
    relevant: [],
    unfilledFields: [],
  };

  const initialSubmitDraggingState = {
    itemsList: [],
  };

  const [submitExerciseState, submitExerciseDispatch] = useReducer(
    submitExerciseReducer,
    initialSubmitExerciseState
  );

  const [relevantDraggingState, relevantDraggingDispatch] = useReducer(
    draggingReducer,
    initialSubmitDraggingState
  );

  const [showPlaceholder, setShowPlaceholder] = useState<boolean>(true);
  const [targetFromDropdown, setTargetFromDropdown] =
    useState<TargetType | null>(null);
  const [selectedTargetIndex, setSelectedTargetIndex] = useState<number>(-1);
  //   const [relevant, setRelevant] = useState<TargetType[]>([]);
  const [grabbedRelevantId, setGrabbedRelevantId] =
    useState<string>('released');
  const [isAddBufferOpen, setIsAddBufferOpen] = useState<boolean>(false);
  const [gradeInput, setGradeInput] = useState<number | undefined>(undefined);
  const [timeBufferRangeValues, setTimeBufferRangeValues] = useState<number[]>([
    recordLength ? recordLength / 2 : 10,
  ]);
  const [timeBuffersScores, setTimeBuffersScores] = useState<number[]>([100]);
  const [rangeIndex, setRangeIndex] = useState<number>(1);
  const timeBufferGradeInputRef = useRef<HTMLInputElement | null>(null);

  const [unfilledFields, setUnfilledFields] = useState<FSAFieldsType[]>([]);

  const [addedValueLeftPerc, setAddedValueLeftPerc] = useState<number>(-1);

  const handleTargetsDropdown = (selectedTargetName: string) => {
    setSelectedTargetIndex(-1);
    setShowPlaceholder(false);

    if (targetsList) {
      const selectedTarget = targetsList.find(
        (target) => target.name === selectedTargetName
      );

      if (selectedTarget) {
        setTargetFromDropdown(selectedTarget);
      }
    }
  };

  const addTargetToRelevant = () => {
    if (targetFromDropdown) {
      const relevantIds = submitExerciseState.relevant.map(
        (target) => target._id
      );
      if (!relevantIds.includes(targetFromDropdown._id)) {
        submitExerciseDispatch({
          type: submitExerciseDataAction.SET_RELEVANT,
          payload: targetFromDropdown,
        });
      } else {
        addAlert('target already included.', AlertSizes.small);
      }
    } else {
      addAlert('please select a target.', AlertSizes.small);
    }
  };

  const handleRelevantDragMove = (event: DragEndEvent) => {
    const { active, over } = event;

    // if (over && active.id !== over.id) {
    //   setRelevant((items) => {
    //     const activeIndex = items
    //       .map((item) => item._id)
    //       .indexOf(active.id as string);
    //     const overIndex = items
    //       .map((item) => item._id)
    //       .indexOf(over.id as string);
    //     return arrayMove(items, activeIndex, overIndex);
    //   });
    // }

    const updatedRelevant = relevantDraggingDispatch({
      type: draggingAction.REARANGE_ITEMS_LIST,
      payload: {
        itemsList: submitExerciseState.relevant,
        active: active,
        over: over,
      },
    });

    if (updatedRelevant !== undefined) {
      submitExerciseDispatch({
        type: submitExerciseDataAction.SET_RELEVANT,
        payload: updatedRelevant,
      });
    }
  };

  const handleRelevantDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setGrabbedRelevantId('released');
    const updatedRelevant = relevantDraggingDispatch({
      type: draggingAction.REARANGE_ITEMS_LIST,
      payload: {
        itemsList: submitExerciseState.relevant,
        active: active,
        over: over,
      },
    });

    if (updatedRelevant !== undefined) {
      submitExerciseDispatch({
        type: submitExerciseDataAction.SET_RELEVANT,
        payload: updatedRelevant,
      });
    }
    // if (over && active.id !== over.id) {
    //   setRelevant((items) => {
    //     const activeIndex = items
    //       .map((item) => item._id)
    //       .indexOf(active.id as string);
    //     const overIndex = items
    //       .map((item) => item._id)
    //       .indexOf(over.id as string);
    //     return arrayMove(items, activeIndex, overIndex);
    //   });
    // }
  };

  //   const removeRelevantItem = (itemId: string) => {
  //     // setRelevant(relevant.filter((item) => item._id != itemId));

  //     submitExerciseDispatch({
  //       type: submitExerciseDataAction.SET_RELEVANT,
  //       payload: submitExerciseState.relevant.filter(
  //         (item) => item._id != itemId
  //       ),
  //     });
  //   };

  const splicer = (index: number, newVal: number, oldArray: number[]) => {
    const newArray = [...oldArray];
    newArray.splice(index, 0, newVal);
    console.log('newArray', newVal, newArray);
    return newArray;
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
          setAddedValueLeftPerc(
            Math.round(100 * ((event.pageX - left) / (right - left)))
          );
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
    setTimeBufferRangeValues((prevArray) => {
      return prevArray.map((value, i) =>
        i === index
          ? Number(e.target.value) > prevArray[i + 1]
            ? prevArray[i + 1] - 1 / 6
            : Number(e.target.value) < prevArray[i - 1]
              ? prevArray[i - 1] + 1 / 6
              : Number(e.target.value)
          : value
      );
    });
  };

  const deleteTimeBuffer = (index: number) => {
    console.log('new exercise - deleteTimeBuffer - index', index);
    setRangeIndex(rangeIndex - 1);
    setTimeBufferRangeValues(
      timeBufferRangeValues.filter(
        (item) => item !== timeBufferRangeValues[index]
      )
    );
    setTimeBuffersScores(
      timeBuffersScores.filter((item) => item !== timeBuffersScores[index])
    );
  };

  const handleNewScore = (newScore: number, newTime: number) => {
    const minutesArrays = timeBufferRangeValues;
    const scoresArrays = timeBuffersScores;

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
    const scoresArrays = timeBuffersScores;
    console.log('scoresArrays', scoresArrays);
    const minutesArrays = timeBufferRangeValues;

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

  useEffect(() => {
    console.log('timeBufferRangeValues', timeBufferRangeValues);
  }, [timeBufferRangeValues]);

  useEffect(() => {
    console.log('rangeIndex', rangeIndex);
  }, [rangeIndex]);

  useEffect(() => {
    console.log('timeBuffersScores', timeBuffersScores);
  }, [timeBuffersScores]);
  timeBuffersScores;

  const addNewScoreBuffer = (
    pervScoreIndex: number,
    newScore: number,
    newTime: number
  ) => {
    console.log('pervScoreIndex', pervScoreIndex);
    setRangeIndex(rangeIndex + 1);

    setTimeBuffersScores((timeBuffersScores) => [
      ...timeBuffersScores,
      newScore,
    ]);

    setTimeBufferRangeValues((timeBufferRangeValues) => [
      ...timeBufferRangeValues,
      newTime,
    ]);
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
              value={submitExerciseState.description}
              onChange={(text: string) => {
                submitExerciseDispatch({
                  type: submitExerciseDataAction.SET_DESCRIPTION,
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
                    showPlaceholder
                      ? undefined
                      : targetFromDropdown
                        ? targetFromDropdown.name
                        : undefined
                  }
                  onChange={handleTargetsDropdown}
                  size={DropdownSizes.DEFAULT}
                />
              </div>

              <div className='group my-3 flex cursor-pointer flex-row items-center justify-start'>
                <button
                  className='flex h-9 w-9 items-center justify-center rounded-full bg-duoGray-lighter text-2xl group-hover:w-fit group-hover:rounded-2xl group-hover:bg-duoGray-hover group-hover:px-2 group-hover:py-3 dark:bg-duoGrayDark-light dark:group-hover:bg-duoGrayDark-lighter'
                  onClick={addTargetToRelevant}
                >
                  <TiPlus />
                  <span className='ml-1 hidden text-base font-extrabold group-hover:block'>
                    relevant
                  </span>
                </button>
              </div>

              {/* <div className='open-button group my-3 flex cursor-pointer flex-row items-center justify-start'>
                <button
                  className='open-button flex h-9 w-9 items-center justify-center rounded-full bg-duoGray-lighter text-2xl group-hover:w-fit group-hover:rounded-2xl group-hover:bg-duoGray-hover group-hover:px-2 group-hover:py-3 dark:bg-duoGrayDark-light dark:group-hover:bg-duoGrayDark-lighter'
                  onClick={addTargetToAnswersList}
                >
                  <TbTargetArrow />
                  <span className='ml-1 hidden text-base font-extrabold group-hover:block'>
                    add answer
                  </span>
                </button>
              </div> */}
            </div>
          ) : null}
        </div>

        <div className='mb-4'>
          <div>
            <span className='my-3 text-2xl font-bold'>Relevant:</span>
            {submitExerciseState.relevant.length > 0 ? (
              <div className='flex h-fit w-full flex-col items-start justify-between font-bold'>
                <DndContext
                  collisionDetection={closestCenter}
                  onDragStart={(event: DragEndEvent) => {
                    const { active } = event;
                    setGrabbedRelevantId(active.id.toString());
                  }}
                  onDragMove={handleRelevantDragMove}
                  onDragEnd={handleRelevantDragEnd}
                >
                  <SortableContext
                    items={submitExerciseState.relevant.map(
                      (target) => target._id
                    )}
                    strategy={horizontalListSortingStrategy}
                  >
                    <div className='flex flex-wrap gap-1'>
                      {submitExerciseState.relevant.map(
                        (target, relevantIndex) => (
                          <div
                            key={relevantIndex}
                            className='mb-2 flex w-[8rem] flex-row'
                          >
                            <SortableItem
                              id={target._id}
                              key={relevantIndex}
                              name={target.name}
                              isGrabbed={
                                grabbedRelevantId
                                  ? grabbedRelevantId === target._id
                                  : false
                              }
                              isDisabled={false}
                            />
                            {grabbedRelevantId !== target._id ? (
                              <button
                                onClick={() => {
                                  submitExerciseDispatch({
                                    type: submitExerciseDataAction.SET_RELEVANT,
                                    payload: target,
                                  });
                                  // removeRelevantItem(target._id);
                                }}
                                className='flex w-full items-center justify-center text-duoGray-darkest dark:text-duoBlueDark-text'
                              >
                                <FaRegTrashAlt />
                              </button>
                            ) : null}
                          </div>
                        )
                      )}
                    </div>
                  </SortableContext>
                </DndContext>
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

        <div className='mb-4'>
          <div>
            <span className={`my-3 text-2xl font-bold ${'' ? '' : ''}`}>
              Answers:
            </span>
            {!!answersList && answersList.length > 0 ? (
              <div className='flex h-fit w-full flex-col items-start justify-between font-bold'>
                <ul>
                  {!!answersList &&
                    answersList.map((answer, answerIndex) => (
                      <li
                        key={answerIndex}
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

          <div className='mt-6 w-full pb-[5rem] relative flex '>
            <Slider
              isMultiple={true}
              numberOfSliders={rangeIndex}
              min={0}
              max={!!recordLength ? recordLength : 10}
              onContextMenu={handleContextMenu}
              step={1 / 6}
              value={timeBufferRangeValues}
              tooltipsValues={timeBuffersScores}
              onChange={handleTimeBufferRange}
              deleteNode={(index) => deleteTimeBuffer(index)}
              addedValLeftPercentage={addedValueLeftPerc}
              onSave={(newScore, newTime) => handleNewScore(newScore, newTime)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default ExerciseDataSection;
