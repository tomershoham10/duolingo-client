'use client';
import { useEffect, useState } from 'react';
import { getTargetsList } from '@/app/API/classes-service/targets/functions';
import Dropdown, { DropdownSizes } from '@/app/components/Dropdown/page';
import Textbox from '@/app/components/Textbox/page';
import useStore from '@/app/store/useStore';
import { TargetType, useTargetStore } from '@/app/store/stores/useTargetStore';

import { TiPlus } from 'react-icons/ti';
import { AlertSizes, useAlertStore } from '@/app/store/stores/useAlertStore';

const NewExercise: React.FC = () => {
  const targetsList = useStore(useTargetStore, (state) => state.targets);
  const addAlert = useAlertStore.getState().addAlert;

  const [selectedTargetIndex, setSelectedTargetIndex] = useState<number>(-1);
  const [showPlaceholder, setShowPlaceholder] = useState<boolean>(true);
  const [targetFromDropdown, setTargetFromDropdown] =
    useState<TargetType | null>(null);
  const [relevant, setRelevant] = useState<TargetType[]>([]);
  const [answersList, setAnswersList] = useState<TargetType[]>([]);

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
    // setShowPlaceholder(true);
    // setTargetFromDropdown(null);
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
    // setShowPlaceholder(true);
    // setTargetFromDropdown(null);
  };

  useEffect(() => {
    console.log('relevant', relevant);
  }, [relevant]);

  return (
    <div className='flex w-[40rem] flex-col overflow-auto p-4 tracking-wide text-duoGray-darkest'>
      <div className='text-4xl font-extrabold uppercase'>
        create new exercise
      </div>
      <div>
        <span>description</span>
        <div>
          <Textbox prevData={''} />
        </div>
      </div>
      <div>
        <span>Targets list:</span>
        {targetsList ? (
          <div className='flex w-[20rem] flex-row items-center justify-between'>
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
              className='w-full'
            />
          </div>
        ) : null}
      </div>
      <div>
        <div className='flex flex-row items-center justify-start'>
          <span>relevant</span>
          <button
            className='flex h-9 w-9 items-center justify-center rounded-full bg-duoGray-lighter text-2xl hover:bg-duoGray-hover'
            onClick={addTargetToRelevant}
          >
            <TiPlus />
          </button>
        </div>
        <div>
          {relevant.map((relevat, relevantIndex) => (
            <div key={relevantIndex}>{relevat.name}</div>
          ))}
        </div>
      </div>
      <div>
        <div className='flex flex-row items-center justify-start'>
          <span>currect answers</span>
          <button
            className='flex h-9 w-9 items-center justify-center rounded-full bg-duoGray-lighter text-2xl hover:bg-duoGray-hover'
            onClick={addTargetToAnswersList}
          >
            <TiPlus />
          </button>
        </div>
        <div>
          {answersList.map((answer, relevantIndex) => (
            <div key={relevantIndex}>{answer.name}</div>
          ))}
        </div>
      </div>
      <span>difficulty Level</span>
      <span>Time Buffers</span>
      <span>wav file</span>
      <span>sonolist</span>
    </div>
  );
};

export default NewExercise;
