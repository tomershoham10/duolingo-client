'use client';
import {
  FormEvent,
  InputHTMLAttributes,
  useEffect,
  useRef,
  useState,
} from 'react';
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
import {
  TypesOfCourses,
  useCourseStore,
} from '@/app/store/stores/useCourseStore';
import { UnitType, getUnits } from '@/app/API/classes-service/units/functions';
import Button, { Color } from '@/app/components/Button/page';
import {
  LevelType,
  getAllLevels,
} from '@/app/API/classes-service/levels/functions';
import {
  LessonType,
  getAllLessons,
} from '@/app/API/classes-service/lessons/functions';

interface TimeBuffersType {
  timeBuffer: number;
  grade: number;
}

const NewExercise: React.FC = () => {
  const targetsList = useStore(useTargetStore, (state) => state.targets);
  const coursesList = useStore(useCourseStore, (state) => state.coursesList);

  const addAlert = useAlertStore.getState().addAlert;

  const [description, setDescription] = useState<string | undefined>(undefined);
  const [selectedTargetIndex, setSelectedTargetIndex] = useState<number>(-1);
  const [showPlaceholder, setShowPlaceholder] = useState<boolean>(true);
  const [targetFromDropdown, setTargetFromDropdown] =
    useState<TargetType | null>(null);
  const [relevant, setRelevant] = useState<TargetType[]>([]);
  const [answersList, setAnswersList] = useState<TargetType[]>([]);

  const [difficultyLevel, setDifficultyLevel] = useState<number>(0);

  const [recordLength, setRecordLength] = useState<number>(0);

  const [timeBuffers, setTimeBuffers] = useState<TimeBuffersType[]>();

  const [isAddBufferOpen, setIsAddBufferOpen] = useState<boolean>(false);

  const [rangeIndex, setRangeIndex] = useState<number>(0);

  const [timeBufferRangeValues, setTimeBufferRangeValues] = useState<number[]>(
    []
  );

  const [gradeInput, setGradeInput] = useState<number | undefined>(undefined);

  const [timeBuffersScores, setTimeBuffersScores] = useState<number[]>([]);

  const [time, setTime] = useState<number>();
  const [grade, setGrade] = useState<number | ''>('');

  const [grabbedRelevantId, setGrabbedRelevantId] =
    useState<string>('released');
  const [grabbedAnswerId, setGrabbedAnswerId] = useState<string>('released');

  const [unitsList, setUnitsList] = useState<UnitType[]>();
  const [levelsList, setLevelsList] = useState<LevelType[]>();
  const [lessonsList, setLessonsList] = useState<LessonType[]>();

  const [selectedCourse, setSelectedCourse] = useState<{
    courseType: TypesOfCourses | undefined;
    courseId: string | undefined;
    unitsList: string[] | undefined;
  } | null>(null);

  const [selectedUnit, setSelectedUnit] = useState<UnitType | null>(null);

  //   const [selectedCourse, setSelectedCourse] = useState<{
  //     courseType: TypesOfCourses | undefined;
  //     courseId: string | undefined;
  //   } | null>(null);

  useEffect(() => {
    console.log('selectedCourse', selectedCourse);
  }, [selectedCourse]);

  useEffect(() => {
    console.log('selectedUnit', selectedUnit);
  }, [selectedUnit]);

  const uploadRef = useRef<UploadRef>(null);

  const timeBufferGradeInputRef = useRef<HTMLInputElement | null>(null);
  const timeBufferGradeDivRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchTargets = async () => {
      await getTargetsList();
    };
    const targetData = localStorage.getItem('targetsList');
    if (!targetData) {
      fetchTargets();
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (coursesList) {
        try {
          const resUnits = await getUnits();
          resUnits ? setUnitsList(resUnits) : null;
        } catch (error) {
          console.error('Error fetching units:', error);
        }
      }
    };

    fetchData();
  }, [coursesList]);

  useEffect(() => {
    const fetchData = async () => {
      if (unitsList) {
        try {
          const resLevels = await getAllLevels();
          resLevels ? setLevelsList(resLevels) : null;
        } catch (error) {
          console.error('Error fetching levels:', error);
        }
      }
    };
    fetchData();
  }, [unitsList]);

  useEffect(() => {
    const fetchData = async () => {
      if (levelsList) {
        try {
          const resLessons = await getAllLessons();
          resLessons ? setLessonsList(resLessons) : null;
        } catch (error) {
          console.error('Error fetching lessons:', error);
        }
      }
    };
    fetchData();
  }, [levelsList]);

  useEffect(() => {
    console.log('coursesList', coursesList);
  }, [coursesList]);

  useEffect(() => {
    console.log('unitsList', unitsList);
  }, [unitsList]);
  useEffect(() => {
    console.log('levelsList', levelsList);
  }, [levelsList]);
  useEffect(() => {
    console.log('lessonsList', lessonsList);
  }, [lessonsList]);

  useEffect(() => {
    console.log('gradeInput', gradeInput);
  }, [gradeInput]);

  const handleClickOutsideTimeBufferScore = (event: MouseEvent) => {
    if (
      timeBufferGradeDivRef.current &&
      !timeBufferGradeDivRef.current.contains(event.target as Node)
    ) {
      setIsAddBufferOpen(false);
    }
  };

  useEffect(() => {
    if (isAddBufferOpen) {
      document.addEventListener('mousedown', handleClickOutsideTimeBufferScore);
      return () => {
        document.removeEventListener(
          'mousedown',
          handleClickOutsideTimeBufferScore
        );
      };
    }
  }, [isAddBufferOpen]);

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

  const handleRangeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDifficultyLevel(parseFloat(event.target.value));
  };

  const handleFileChange = (file: File | null) => {
    // console.log('Selected file:', file);
  };
  const handleFileLength = (time: number | null) => {
    console.log('file length:', time);
    time ? setRecordLength(time) : null;
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

  const splicer = (index: number, newVal: number, oldArray: number[]) => {
    const newArray = [...oldArray];
    newArray.splice(index, 0, newVal);
    console.log('newArray', newVal, newArray);
    return newArray;
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

  const submitExercise = () => {
    console.log('submit');
    console.log('description', description);
    console.log('relevant', relevant);
    console.log('answers list', answersList);
    console.log('difficultyLevel', difficultyLevel);
  };

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
              value={description}
              onChange={setDescription}
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
                  <span className='ml-1 hidden text-base font-extrabold group-hover:block'>
                    relevant
                  </span>
                </button>
              </div>

              <div className='open-button group my-3 flex cursor-pointer flex-row items-center justify-start'>
                <button
                  className='open-button flex h-9 w-9 items-center justify-center rounded-full bg-duoGray-lighter text-2xl group-hover:w-fit group-hover:rounded-2xl group-hover:bg-duoGray-hover group-hover:px-2 group-hover:py-3'
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
        <div className='flex h-fit flex-col items-start justify-center'>
          <span className='text-2xl font-bold'>Upload files:</span>

          <div className='relative flex w-full flex-row items-start justify-between gap-3 3xl:w-[55%]'>
            <div className='relative w-full 3xl:w-[45%]'>
              <Upload
                label={'Choose a .wav file'}
                filesTypes={'.wav'}
                isMultiple={false}
                ref={uploadRef}
                onFileChange={handleFileChange}
                fileLength={handleFileLength}
              />
            </div>
            <div className='relative w-full 3xl:w-[45%]'>
              <Upload
                label={'Sonolist'}
                filesTypes={'image/*'}
                isMultiple={true}
                ref={uploadRef}
                onFileChange={handleFileChange}
              />
            </div>
          </div>
        </div>
        <div className='relative flex flex-col items-start justify-center'>
          <div className='my-3 flex w-fit flex-row items-center justify-between gap-3'>
            <span className='my-3 text-2xl font-bold'>Time Buffers:</span>

            <div
              ref={timeBufferGradeDivRef}
              className={`cursor-default' my-3 flex h-fit w-fit flex-row items-center justify-center rounded-full text-2xl ${
                isAddBufferOpen && recordLength > 0
                  ? ' bg-duoGray-light'
                  : ' bg-duoGray-lighter'
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
                  className='mr-1 h-5 w-8 border-b-[1px] border-duoGray-dark bg-transparent text-center font-extrabold text-duoGray-darkest focus:outline-none'
                />
              </div>
            </div>
          </div>

          {timeBufferRangeValues.length > 0 ? (
            <div className='mt-6 pb-[5rem]'>
              <Slider
                isMultiple={true}
                numberOfSliders={rangeIndex}
                min={0}
                max={recordLength}
                step={1 / 6}
                value={timeBufferRangeValues}
                tooltipsValues={timeBuffersScores}
                onChange={handleTimeBufferRange}
                deleteNode={(index) => deleteTimeBuffer(index)}
              />
            </div>
          ) : null}
        </div>
        <div>
          <span className='my-3 text-2xl font-bold'>Attach to a lessson:</span>
          <ul className='mb-12 mt-6 flex w-full flex-row items-center justify-start gap-5'>
            <li className='w-[8rem]'>
              <Dropdown
                placeholder={'COURSES'}
                items={
                  coursesList
                    ? coursesList.map((item) => item.courseType as string)
                    : []
                }
                value={selectedCourse?.courseType as string}
                onChange={(selectedCourseName) => {
                  if (coursesList) {
                    setSelectedCourse(
                      coursesList.filter(
                        (item) => item.courseType === selectedCourseName
                      )[0]
                    );
                  }
                }}
                size={DropdownSizes.SMALL}
              />
            </li>

            <li className='w-[8rem]'>
              <Dropdown
                placeholder={'UNITS'}
                items={
                  unitsList && selectedCourse
                    ? selectedCourse.unitsList
                      ? selectedCourse.unitsList.map((unit) =>
                          selectedCourse.unitsList
                            ? `unit ${
                                selectedCourse.unitsList.indexOf(unit) + 1
                              }`
                            : ''
                        )
                      : []
                    : []
                }
                value={selectedUnit ? selectedUnit._id : null}
                onChange={(selectedUnitId) => {
                  const unitIndex = Number(selectedUnitId.split(' ')[1]) - 1;
                  console.log('unitIndex', unitIndex);
                  if (unitsList) {
                    setSelectedUnit(
                      unitsList.filter((item) =>
                        selectedCourse && selectedCourse.unitsList
                          ? item._id === selectedCourse.unitsList[unitIndex]
                          : null
                      )[0]
                    );
                  }
                }}
                size={DropdownSizes.SMALL}
              />
            </li>
            <li className='w-[8rem]'>
              <Dropdown
                placeholder={'LEVELS'}
                items={
                  levelsList
                    ? levelsList
                        .map((unit) => unit._id)
                        .filter(
                          (unit) => selectedCourse?.levelsList?.includes(unit)
                        )
                    : []
                }
                value={null}
                onChange={() => {
                  console.log('LEVELS');
                }}
                size={DropdownSizes.SMALL}
              />
            </li>
            <li className='w-[8rem]'>
              <Dropdown
                placeholder={'LESSONS'}
                items={[]}
                value={null}
                onChange={() => {
                  console.log('LESSONS');
                }}
                size={DropdownSizes.SMALL}
              />
            </li>
          </ul>
        </div>
        <div className='relative flex items-center justify-center py-8'>
          <div className='absolute'>
            <Button
              label={'SUBMIT'}
              color={Color.BLUE}
              style={'w-[12rem]'}
              onClick={submitExercise}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewExercise;
