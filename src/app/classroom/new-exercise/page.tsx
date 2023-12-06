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

  const [recordLength, setRecordLength] = useState<number>();

  const [timeBuffers, setTimeBuffers] = useState<TimeBuffersType[]>();

  const [rangeIndex, setRangeIndex] = useState<number>(0);

  const [timeBufferRangeValues, setTimeBufferRangeValues] = useState<number[]>(
    []
  );

  const [time, setTime] = useState<number>();
  const [grade, setGrade] = useState<number | ''>('');

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
  useEffect(() => {
    console.log('timeBufferRangeValues', timeBufferRangeValues);
    for (let i = 0; i < timeBufferRangeValues.length; i++) {
      if (timeBufferRangeValues[i] > timeBufferRangeValues[i + 1]) {
        console.log('not ok', i);
      }
    }
  }, [timeBufferRangeValues]);

  useEffect(() => {
    console.log('difficultyLevel', difficultyLevel);
  }, [difficultyLevel]);

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
        i === index ? Number(e.target.value) : value
      );
    });
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
            {relevant.map((relevat, relevantIndex) => (
              <div key={relevantIndex}>{relevat.name}</div>
            ))}
          </div>
        </div>
        <div>
          <div>
            {answersList.map((answer, relevantIndex) => (
              <div key={relevantIndex}>{answer.name}</div>
            ))}
          </div>
        </div>
        <div className='flex w-full flex-col'>
          <div>
            {recordLength ? <></> : <span>disabled</span>}
            <span className='my-3 text-2xl font-bold'>Time Buffers:</span>
            <form>
              <label htmlFor='time-number'>time</label>
              <input
                type='number'
                min={0}
                onChange={(e) => setTime(Number(e.target.value))}
                id='time-number'
                className='border-2 focus:outline-none'
              />
              <label htmlFor='grade-number'>grade</label>
              <input
                type='number'
                min={0}
                max={100}
                id='grade-number'
                value={grade}
                onChange={(e) => {
                  const inputValue = Number(e.target.value);
                  if (
                    !isNaN(inputValue) &&
                    inputValue >= 0 &&
                    inputValue <= 100
                  ) {
                    setGrade(inputValue);
                  }
                }}
                className='border-2 focus:outline-none'
              />
              <button
                type='button'
                // onClick={addTimeBuffer}
                className='border-2 bg-slate-100'
              >
                submit
              </button>
            </form>
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
          <div className='relative'>
            {rangeIndex}
            {Array.from({ length: rangeIndex }).map((_, index) => (
              <input
                key={index}
                type='range'
                id={`range${index + 1}`}
                name={`range${index + 1}`}
                min='0'
                max='100'
                step='1'
                value={timeBufferRangeValues[index]}
                onChange={(e) => handleTimeBufferRange(e, index)}
                className='multi-range absolute'
              />
            ))}

            <Slider
              isMultiple={true}
              numberOfSliders={rangeIndex}
              min={0}
              max={100}
              step={1}
              value={timeBufferRangeValues}
              onChange={handleTimeBufferRange}
            />
          </div>
          <button
            onClick={() => {
              setRangeIndex(rangeIndex + 1);
              setTimeBufferRangeValues((prevValues) => [...prevValues, 0]);
            }}
          >
            Add Input
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewExercise;
