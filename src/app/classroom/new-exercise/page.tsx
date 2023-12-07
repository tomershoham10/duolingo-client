'use client';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { getTargetsList } from '@/app/API/classes-service/targets/functions';
import Dropdown, { DropdownSizes } from '@/app/components/Dropdown/page';
import Textbox, { FontSizes } from '@/app/components/Textbox/page';
import useStore from '@/app/store/useStore';
import { TargetType, useTargetStore } from '@/app/store/stores/useTargetStore';

import { TiPlus } from 'react-icons/ti';
import { TbTargetArrow } from 'react-icons/tb';

import { AlertSizes, useAlertStore } from '@/app/store/stores/useAlertStore';
import Upload, { UploadRef } from '@/app/components/Upload/page';
import Slider from '@/app/components/Slider/page';
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import SortableItem from '@/app/components/SortableItem/page';
import { FaRegTrashAlt } from 'react-icons/fa';

interface TimeBuffersType {
  timeBuffer: number;
  grade: number;
}

const NewExercise: React.FC = () => {
  const targetsList = useStore(useTargetStore, (state) => state.targets);
  const addAlert = useAlertStore.getState().addAlert;

  const [selectedTargetIndex, setSelectedTargetIndex] = useState<number>(-1);
  const [showPlaceholder, setShowPlaceholder] = useState<boolean>(true);
  const [targetFromDropdown, setTargetFromDropdown] =
    useState<TargetType | null>(null);
  const [relevant, setRelevant] = useState<TargetType[]>([]);
  const [answersList, setAnswersList] = useState<TargetType[]>([]);

  const [difficultyLevel, setDifficultyLevel] = useState<number>(0);

  const [recordLength, setRecordLength] = useState<number>(0);

  const [timeBuffers, setTimeBuffers] = useState<TimeBuffersType[]>();

  const [rangeIndex, setRangeIndex] = useState<number>(0);

  const [timeBufferRangeValues, setTimeBufferRangeValues] = useState<number[]>(
    []
  );

  const [time, setTime] = useState<number>();
  const [grade, setGrade] = useState<number | ''>('');

  const [grabbedRelevantId, setGrabbedRelevantId] =
    useState<string>('released');
  const [grabbedAnswerId, setGrabbedAnswerId] = useState<string>('released');
  const uploadRef = useRef<UploadRef>(null);

  useEffect(() => {
    const fetchTargets = async () => {
      await getTargetsList();
    };
    const targetData = localStorage.getItem('targetsList');
    if (!targetData) {
      fetchTargets();
    }
  }, []);

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

  const handleRangeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDifficultyLevel(parseFloat(event.target.value));
  };

  useEffect(() => {
    console.log('relevant', relevant);
  }, [relevant]);
  //   useEffect(() => {
  //     console.log('timeBufferRangeValues', timeBufferRangeValues);
  //     for (let i = 0; i < timeBufferRangeValues.length; i++) {
  //       if (timeBufferRangeValues[i] > timeBufferRangeValues[i + 1]) {
  //         console.log('not ok', i);
  //       }
  //     }
  //   }, [timeBufferRangeValues]);

  useEffect(() => {
    console.log('difficultyLevel', difficultyLevel);
  }, [difficultyLevel]);

  useEffect(() => {
    console.log('rangeIndex', rangeIndex);
  }, [rangeIndex]);

  const handleFileChange = (file: File | null) => {
    console.log('Selected file:', file);
  };
  const handleFileLength = (minutes: number | null) => {
    console.log('file length:', minutes);
    minutes ? setRecordLength(minutes) : null;
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

  useEffect(() => {
    console.log(
      'timeBufferRangeValues',
      timeBufferRangeValues,
      timeBufferRangeValues[timeBufferRangeValues.length - 1],
      timeBufferRangeValues[timeBufferRangeValues.length - 1] === recordLength
    );
  }, [timeBufferRangeValues, recordLength]);

  return (
    <div className='flex w-full flex-col overflow-auto p-4 tracking-wide text-duoGray-darkest'>
      <div className='mx-auto w-[80%] 3xl:w-[65%]'>
        <div className='mb-3 mt-5 text-4xl font-extrabold uppercase'>
          create new exercise
        </div>
        <div>
          <span className='my-3 text-2xl font-bold'>Description:</span>
          <div className='my-3'>
            <Textbox
              isEditMode={false}
              fontSizeProps={FontSizes.MEDIUM}
              placeHolder={'Add desription...'}
            />
          </div>
        </div>
        <div className='bg w-full'>
          <span className='my-3 text-2xl font-bold'>Targets list:</span>
          {targetsList ? (
            <div className='my-3 flex w-fit flex-row items-center justify-between gap-3'>
              <Dropdown
                placeholder={'targets'}
                items={targetsList.map((target) => target.name)}
                value={
                  showPlaceholder
                    ? null
                    : targetFromDropdown
                      ? targetFromDropdown.name
                      : null
                }
                onChange={handleTargetsDropdown}
                size={DropdownSizes.DEFAULT}
                className='w-[15rem] 3xl:w-[20rem]'
              />

              <div className='group my-3 flex cursor-pointer flex-row items-center justify-start'>
                <button
                  className='flex h-9 w-9 items-center justify-center rounded-full bg-duoGray-lighter text-2xl group-hover:w-fit group-hover:rounded-2xl group-hover:bg-duoGray-hover group-hover:px-2 group-hover:py-3'
                  onClick={addTargetToRelevant}
                >
                  <TiPlus />
                  <span className='ml-1 hidden text-base font-semibold group-hover:block'>
                    relevant
                  </span>
                </button>
              </div>

              <div className='group my-3 flex cursor-pointer flex-row items-center justify-start'>
                <button
                  className='flex h-9 w-9 items-center justify-center rounded-full bg-duoGray-lighter text-2xl group-hover:w-fit group-hover:rounded-2xl group-hover:bg-duoGray-hover group-hover:px-2 group-hover:py-3'
                  onClick={addTargetToAnswersList}
                >
                  <TbTargetArrow />
                  <span className='ml-1 hidden text-base font-semibold group-hover:block'>
                    add answer
                  </span>
                </button>
              </div>
            </div>
          ) : null}
        </div>
        <div>
          <div>
            <span className='my-3 text-2xl font-bold'>Relevant:</span>

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
                            className='flex w-full items-center justify-center text-duoGray-darkest'
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
          </div>
        </div>
        <div>
          <div>
            <span className='my-3 text-2xl font-bold'>Answers:</span>
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
                            className='flex w-full items-center justify-center text-duoGray-darkest'
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
          </div>
        </div>

        <div className='flex w-full flex-col'>
          <span className='my-3 text-2xl font-bold'>difficulty level:</span>
          <Slider
            isMultiple={false}
            min={0}
            max={10}
            step={0.5}
            value={difficultyLevel}
            onChange={handleRangeChange}
          />
        </div>
        <span className='my-3 text-2xl font-bold'>Files</span>

        <div>
          <Upload
            ref={uploadRef}
            onFileChange={handleFileChange}
            fileLength={handleFileLength}
          />
        </div>
        <span>sonolist</span>

        <div>
          <div className='relative flex flex-col items-start justify-center'>
            <span className='my-3 text-2xl font-bold'>Time Buffers:</span>

            <button
              onClick={() => {
                console.log('clicked');
                console.log(
                  '100 check',
                  timeBufferRangeValues[timeBufferRangeValues.length - 1]
                );
                if (
                  timeBufferRangeValues[timeBufferRangeValues.length - 1] ===
                  recordLength
                ) {
                  console.log('alert');
                  addAlert('no good', AlertSizes.small);
                  return;
                } else {
                  setRangeIndex(rangeIndex + 1);
                  setTimeBufferRangeValues((prevValues) => [
                    ...prevValues,
                    recordLength,
                  ]);
                }
              }}
              disabled={recordLength > 0 ? false : true}
            >
              Add Input
            </button>
            <div className='mt-6 pb-[5rem]'>
              <Slider
                isMultiple={true}
                numberOfSliders={rangeIndex}
                min={0}
                max={recordLength}
                step={1 / 6}
                value={timeBufferRangeValues}
                onChange={handleTimeBufferRange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewExercise;
