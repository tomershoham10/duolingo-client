'use client';
import { useState, useRef } from 'react';

import { useStore } from 'zustand';
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';

import { TargetType, useTargetStore } from '@/app/store/stores/useTargetStore';
import { AlertSizes, useAlertStore } from '@/app/store/stores/useAlertStore';

import Button, { Color } from '@/components/Button/page';
import Textbox, { FontSizes } from '@/components/Textbox/page';
import Dropdown, { DropdownSizes } from '@/components/Dropdown/page';

import { TiPlus } from 'react-icons/ti';
import { TbTargetArrow } from 'react-icons/tb';
import SortableItem from '@/components/SortableItem/page';
import { FaRegTrashAlt } from 'react-icons/fa';
import Slider from '@/components/Slider/page';
import { useContextMenuStore } from '@/app/store/stores/useContextMenuStore';
import { useInfoBarStore } from '@/app/store/stores/useInfoBarStore';

interface ExerciseSectionProps {
  record: any;
}

enum FSAFieldsType {
  DESCRIPTION = 'description',
  RELEVANT = 'relevant',
  ANSWERSLIST = 'answersList',
  DIFFICULTYLEVEL = 'difficultyLevel',
  RECORD = 'record',
  TIMEBUFFERS = 'timeBuffers',
  SELECTEDLESSON = 'selectedLesson',
}

const ExerciseDataSection: React.FC = () => {
  const targetsList = useStore(useTargetStore, (state) => state.targets);
  const timeBufferGradeDivRef = useRef<HTMLDivElement | null>(null);
  const addAlert = useAlertStore.getState().addAlert;
  const toggleMenuOpen = useContextMenuStore.getState().toggleMenuOpen;
  const setCoordinates = useContextMenuStore.getState().setCoordinates;
  const setContent = useContextMenuStore.getState().setContent;

  const [description, setDescription] = useState<string | undefined>(undefined);
  const [showPlaceholder, setShowPlaceholder] = useState<boolean>(true);
  const [targetFromDropdown, setTargetFromDropdown] =
    useState<TargetType | null>(null);
  const [selectedTargetIndex, setSelectedTargetIndex] = useState<number>(-1);
  const [relevant, setRelevant] = useState<TargetType[]>([]);
  const [answersList, setAnswersList] = useState<TargetType[]>([]);
  const [grabbedRelevantId, setGrabbedRelevantId] =
    useState<string>('released');
  const [grabbedAnswerId, setGrabbedAnswerId] = useState<string>('released');
  const [isAddBufferOpen, setIsAddBufferOpen] = useState<boolean>(false);
  const [recordLength, setRecordLength] = useState<number>(0);
  const [gradeInput, setGradeInput] = useState<number | undefined>(undefined);
  const [timeBufferRangeValues, setTimeBufferRangeValues] = useState<number[]>(
    []
  );
  const [timeBuffersScores, setTimeBuffersScores] = useState<number[]>([]);
  const [rangeIndex, setRangeIndex] = useState<number>(0);
  const timeBufferGradeInputRef = useRef<HTMLInputElement | null>(null);

  const [unfilledFields, setUnfilledFields] = useState<FSAFieldsType[]>([]);

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
      const relevantIds = relevant.map((target) => target._id);
      if (!relevantIds.includes(targetFromDropdown._id)) {
        setRelevant((prevList) => [...prevList, targetFromDropdown]);
      } else {
        addAlert('target already included.', AlertSizes.small);
      }
    } else {
      addAlert('please select a target.', AlertSizes.small);
    }
  };

  const addTargetToAnswersList = () => {
    if (targetFromDropdown) {
      const answersIds = answersList.map((target) => target._id);
      if (!answersIds.includes(targetFromDropdown._id)) {
        setAnswersList((prevList) => [...prevList, targetFromDropdown]);
      } else {
        addAlert('target already included.', AlertSizes.small);
      }
    } else {
      addAlert('please select a target.', AlertSizes.small);
    }
  };

  const handleRelevantDragMove = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setRelevant((items) => {
        const activeIndex = items
          .map((item) => item._id)
          .indexOf(active.id as string);
        const overIndex = items
          .map((item) => item._id)
          .indexOf(over.id as string);
        return arrayMove(items, activeIndex, overIndex);
      });
    }
  };

  const handleRelevantDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setGrabbedRelevantId('released');

    if (over && active.id !== over.id) {
      setRelevant((items) => {
        const activeIndex = items
          .map((item) => item._id)
          .indexOf(active.id as string);
        const overIndex = items
          .map((item) => item._id)
          .indexOf(over.id as string);
        return arrayMove(items, activeIndex, overIndex);
      });
    }
  };

  const removeRelevantItem = (itemId: string) => {
    setRelevant(relevant.filter((item) => item._id != itemId));
  };

  const handleAnswerDragMove = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setAnswersList((items) => {
        const activeIndex = items
          .map((item) => item._id)
          .indexOf(active.id as string);
        const overIndex = items
          .map((item) => item._id)
          .indexOf(over.id as string);
        return arrayMove(items, activeIndex, overIndex);
      });
    }
  };

  const handleAnswerDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setGrabbedAnswerId('released');

    if (over && active.id !== over.id) {
      setAnswersList((items) => {
        const activeIndex = items
          .map((item) => item._id)
          .indexOf(active.id as string);
        const overIndex = items
          .map((item) => item._id)
          .indexOf(over.id as string);
        return arrayMove(items, activeIndex, overIndex);
      });
    }
  };

  const removeAnswerItem = (itemId: string) => {
    setAnswersList(answersList.filter((item) => item._id != itemId));
  };

  const splicer = (index: number, newVal: number, oldArray: number[]) => {
    const newArray = [...oldArray];
    newArray.splice(index, 0, newVal);
    console.log('newArray', newVal, newArray);
    return newArray;
  };

  const handleContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    toggleMenuOpen();
    setCoordinates({ pageX: event.pageX, pageY: event.pageY });
    setContent([
      {
        placeHolder: 'add',
        onClick: () => {
          console.log('clicked');
        },
      },
    ]);
    // Add your custom logic here
    console.log('Right-clicked!', event.pageX, event.pageY);
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

  return (
    <div className='mx-auto flex h-full w-[90%] flex-col p-4 tracking-wide text-duoGray-darkest dark:text-duoGrayDark-lightest'>
      <div className='mx-auto w-full'>
        <div>
          <span className='my-3 text-2xl font-bold'>Description:</span>
          <div className='mb-4 mt-3'>
            <Textbox
              isEditMode={false}
              fontSizeProps={FontSizes.MEDIUM}
              placeHolder={'Add desription...'}
              value={description}
              onChange={setDescription}
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

              <div className='open-button group my-3 flex cursor-pointer flex-row items-center justify-start'>
                <button
                  className={`open-button flex h-9 w-9 items-center justify-center rounded-full text-2xl group-hover:w-fit group-hover:rounded-2xl group-hover:px-2 group-hover:py-3 ${
                    unfilledFields.includes(FSAFieldsType.ANSWERSLIST)
                      ? 'bg-duoRed-lighter text-duoRed-default group-hover:bg-duoRed-light'
                      : 'bg-duoGray-lighter group-hover:bg-duoGray-hover dark:bg-duoGrayDark-light dark:group-hover:bg-duoGrayDark-lighter'
                  }`}
                  onClick={addTargetToAnswersList}
                >
                  <TbTargetArrow />
                  <span className='ml-1 hidden text-base font-extrabold group-hover:block'>
                    add answer
                  </span>
                </button>
              </div>
            </div>
          ) : null}
        </div>

        <div className='mb-4'>
          <div>
            <span className='my-3 text-2xl font-bold'>Relevant:</span>
            {relevant.length > 0 ? (
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
                    items={relevant.map((target) => target._id)}
                    strategy={horizontalListSortingStrategy}
                  >
                    <div className='flex flex-wrap gap-1'>
                      {relevant.map((target, relevantIndex) => (
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
                                removeRelevantItem(target._id);
                              }}
                              className='flex w-full items-center justify-center text-duoGray-darkest dark:text-duoBlueDark-text'
                            >
                              <FaRegTrashAlt />
                            </button>
                          ) : null}
                        </div>
                      ))}
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
            <span
              className={`my-3 text-2xl font-bold ${
                unfilledFields.includes(FSAFieldsType.ANSWERSLIST)
                  ? 'text-duoRed-default'
                  : ''
              }`}
            >
              Answers:
            </span>
            {answersList.length > 0 ? (
              <div className='flex h-fit w-full flex-col items-start justify-between font-bold'>
                <DndContext
                  collisionDetection={closestCenter}
                  onDragStart={(event: DragEndEvent) => {
                    const { active } = event;
                    setGrabbedAnswerId(active.id.toString());
                  }}
                  onDragMove={handleAnswerDragMove}
                  onDragEnd={handleAnswerDragEnd}
                >
                  <SortableContext
                    items={answersList.map((answer) => answer._id)}
                    strategy={horizontalListSortingStrategy}
                  >
                    <div className='flex flex-wrap gap-1'>
                      {answersList.map((answer, answerIndex) => (
                        <div
                          key={answerIndex}
                          className='mb-2 flex w-[8rem] flex-row'
                        >
                          <SortableItem
                            id={answer._id}
                            key={answerIndex}
                            name={answer.name}
                            isGrabbed={
                              grabbedAnswerId
                                ? grabbedAnswerId === answer._id
                                : false
                            }
                            isDisabled={false}
                          />
                          {grabbedAnswerId !== answer._id ? (
                            <button
                              onClick={() => {
                                removeAnswerItem(answer._id);
                              }}
                              className='flex w-full items-center justify-center text-duoGray-darkest dark:text-duoBlueDark-text'
                            >
                              <FaRegTrashAlt />
                            </button>
                          ) : null}
                        </div>
                      ))}
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

            <div
              ref={timeBufferGradeDivRef}
              className={`cursor-default' my-3 flex h-fit w-fit flex-row items-center justify-center rounded-full text-2xl ${
                isAddBufferOpen && recordLength > 0
                  ? unfilledFields.includes(FSAFieldsType.TIMEBUFFERS)
                    ? 'bg-duoRed-light text-duoRed-default'
                    : 'bg-duoGray-light dark:bg-duoGrayDark-lighter'
                  : unfilledFields.includes(FSAFieldsType.TIMEBUFFERS)
                    ? 'bg-duoRed-lighter text-duoRed-default'
                    : 'bg-duoGray-lighter dark:bg-duoGrayDark-light'
              }`}
            >
              <button
                className={`flex h-9 w-9 items-center justify-center   ${
                  recordLength === 0 ? 'cursor-default' : 'cursor-pointer'
                }`}
                onClick={() => {
                  console.log('clicked', isAddBufferOpen, gradeInput);
                  if (isAddBufferOpen) {
                    if (gradeInput) {
                      if (
                        timeBufferRangeValues[
                          timeBufferRangeValues.length - 1
                        ] === recordLength
                      ) {
                        console.log('alert');
                        addAlert('no good', AlertSizes.small);
                        return;
                      } else {
                        if (
                          gradeInput >
                          timeBuffersScores[timeBuffersScores.length - 1]
                        ) {
                          for (
                            let i: number = 0;
                            i < timeBuffersScores.length - 1;
                            i++
                          ) {
                            if (
                              gradeInput < timeBuffersScores[i] &&
                              gradeInput > timeBuffersScores[i + 1]
                            ) {
                              setRangeIndex(rangeIndex + 1);
                              setTimeBufferRangeValues(
                                splicer(
                                  i + 1,
                                  (timeBufferRangeValues[i] +
                                    timeBufferRangeValues[i + 1]) /
                                    2,
                                  timeBufferRangeValues
                                )
                              );
                              setTimeBuffersScores(
                                splicer(i + 1, gradeInput, timeBuffersScores)
                              );
                              setGradeInput(undefined);
                              timeBufferGradeInputRef.current
                                ? (timeBufferGradeInputRef.current.value = '')
                                : null;
                              setIsAddBufferOpen(!isAddBufferOpen);
                              return;
                            }
                          }
                        }

                        setRangeIndex(rangeIndex + 1);
                        setTimeBufferRangeValues((prevValues) => [
                          ...prevValues,
                          recordLength,
                        ]);
                        setTimeBuffersScores((prevValues) => [
                          ...prevValues,
                          gradeInput,
                        ]);
                        setGradeInput(undefined);
                        timeBufferGradeInputRef.current
                          ? (timeBufferGradeInputRef.current.value = '')
                          : null;
                        setIsAddBufferOpen(!isAddBufferOpen);
                        return;
                      }
                    } else {
                      addAlert('no good', AlertSizes.small);
                      return;
                    }
                  }
                  setIsAddBufferOpen(!isAddBufferOpen);
                }}
                disabled={recordLength === 0}
              >
                <TiPlus />
              </button>

              <div
                className={` ${
                  isAddBufferOpen && recordLength > 0
                    ? 'w-fit rounded-2xl px-2 text-base'
                    : 'hidden'
                }`}
              >
                <input
                  type='number'
                  value={gradeInput}
                  ref={timeBufferGradeInputRef}
                  onChange={(e) => setGradeInput(Number(e.target.value))}
                  className='mr-1 h-5 w-8 border-b-[1px] border-duoGray-dark bg-transparent text-center font-extrabold text-duoGray-darkest focus:outline-none dark:text-duoGrayDark-lightest'
                />
              </div>
            </div>
          </div>

          {timeBufferRangeValues.length > 0 ? (
            <div className='mt-6 w-full pb-[5rem]'>
              <Slider
                isMultiple={true}
                numberOfSliders={rangeIndex}
                min={0}
                max={recordLength}
                onContextMenu={handleContextMenu}
                step={1 / 6}
                value={timeBufferRangeValues}
                tooltipsValues={timeBuffersScores}
                onChange={handleTimeBufferRange}
                deleteNode={(index) => deleteTimeBuffer(index)}
              />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
export default ExerciseDataSection;
