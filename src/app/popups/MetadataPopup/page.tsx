'use client';
import { useReducer, useEffect } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

import useStore from '@/app/store/useStore';
import { useAlertStore } from '@/app/store/stores/useAlertStore';
import { PopupsTypes, usePopupStore } from '@/app/store/stores/usePopupStore';
import { useCreateExerciseStore } from '@/app/store/stores/useCreateExerciseStore';
import { useTargetStore } from '@/app/store/stores/useTargetStore';

import Button, { ButtonColors } from '@/components/Button/page';
import SwitchButton from '@/components/SwitchButton/page';
import Dropdown, { DropdownSizes } from '@/components/Dropdown/page';
import Input, { InputTypes } from '@/components/Input/page';
import Slider from '@/components/Slider/page';
import Pagination from '@/components/Navigation/Pagination/page';

import {
  recordMetaAction,
  recordMetadataReducer,
} from '@/reducers/recordMetadataReducer';

import { formatNumberToMinutes } from '@/app/utils/functions/formatNumberToMinutes';
import { SonarSystem, Transmissions } from '@/app/API/files-service/functions';


library.add(faXmark);

interface MetadataProps {
  onSave: (data: Partial<RecordMetadataType>) => void;
}

const MetadataPopup: React.FC<MetadataProps> = (props) => {
  const selectedPopup = useStore(usePopupStore, (state) => state.selectedPopup);
  const updateSelectedPopup = usePopupStore.getState().updateSelectedPopup;

  const targetsList = useStore(useTargetStore, (state) => state.targets);

  const recordLength = useStore(
    useCreateExerciseStore,
    (state) => state.recordLength
  );

  const initialRecordMetaState: RecordMetadataType = {
    record_length: 0,
    sonograms_ids: [],
    difficulty_level: 0,
    targets_ids_list: [],
    operation: '',
    source: '',
    is_in_italy: false,
    transmission: Transmissions.PASSIVE,
    channels_number: 1,
    sonar_system: SonarSystem.DEMON,
    is_backround_vessels: false,
    aux: false,
  };

  const [recordMetaState, recordMetaDispatch] = useReducer(
    recordMetadataReducer,
    initialRecordMetaState
  );

  useEffect(() => {
    console.log('recordMetaState', recordMetaState);
  }, [recordMetaState]);

  useEffect(() => {
    !!recordLength
      ? recordMetaDispatch({
          type: recordMetaAction.SET_RECORD_LENGTH,
          payload: recordLength,
        })
      : null;
  }, [recordLength]);

  const handleRangeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    recordMetaDispatch({
      type: recordMetaAction.SET_DIFFICULTY_LEVEL,
      payload: Number(event.target.value),
    });
  };
  return (
    <div
      className={
        selectedPopup === PopupsTypes.RECORDMETADATA ||
        selectedPopup === PopupsTypes.SONOLISTMETADATA
          ? 'fixed left-0 top-0 z-20 flex h-screen w-screen items-center justify-center overflow-auto bg-[rgb(0,0,0)] bg-[rgba(0,0,0,0.4)] transition duration-200 ease-out'
          : 'z-0 opacity-0 transition duration-200 ease-in'
      }
    >
      {selectedPopup === PopupsTypes.RECORDMETADATA ? (
        <div className='relative m-5 flex h-[40rem] w-[40rem] justify-center rounded-md bg-white p-5 dark:bg-duoGrayDark-darkest xl:h-[40rem] xl:w-[55rem] 2xl:h-[50rem] 2xl:w-[70rem] 3xl:w-[80rem]'>
          <button
            onClick={() => {
              updateSelectedPopup(PopupsTypes.CLOSED);
            }}
            className='z-50 h-fit w-fit flex-none rounded-md text-duoGray-dark'
          >
            <FontAwesomeIcon
              className='fa-lg fa-solid flex-none'
              icon={faXmark}
            />
          </button>
          <div className='w-full items-start justify-start'>
            <div className='absolute left-0 flex h-10 w-full justify-center border-b-2 text-xl font-extrabold dark:border-duoBlueDark-text 3xl:h-12 3xl:text-2xl'>
              Add Metadata
            </div>
            <div className='grid-rows-8 mt-12 grid w-full grid-cols-2 gap-x-12 gap-y-6 px-4 py-4 3xl:gap-y-12'>
              <div className='col-span-1 flex items-center justify-between'>
                <span className='text-lg font-bold opacity-80 3xl:text-xl'>
                  Does the record included in Italkia?
                </span>

                <SwitchButton
                  onSwitch={(isChecked) =>
                    recordMetaDispatch({
                      type: recordMetaAction.SET_ITALY_STATUS,
                      payload: isChecked,
                    })
                  }
                />
              </div>

              <div className='col-span-1 flex items-center justify-start gap-4 2xl:justify-between'>
                <span className='text-lg font-bold opacity-80 3xl:text-xl'>
                  Record length:
                </span>
                <span className='text-xl font-bold tracking-wide 3xl:text-2xl'>
                  {!!recordLength
                    ? formatNumberToMinutes(recordLength)
                    : '00:00:00'}
                </span>
              </div>

              <div className='col-span-1 flex items-center justify-between'>
                <span className='text-lg font-bold opacity-80 3xl:text-xl'>
                  Transmission:
                </span>
                <div className=' w-[12rem]'>
                  <Dropdown
                    isSearchable={false}
                    placeholder={'transmission'}
                    items={['passive', 'active', 'both']}
                    onChange={(trans) =>
                      recordMetaDispatch({
                        type: recordMetaAction.SET_TRANSMISSION_TYPE,
                        payload: trans as Transmissions,
                      })
                    }
                    size={DropdownSizes.SMALL}
                  />
                </div>
              </div>

              <div className='col-span-1 flex items-center justify-between'>
                <span className='text-lg font-bold opacity-80 3xl:text-xl'>
                  Sonar system:
                </span>
                <div className='w-[14rem]'>
                  <Dropdown
                    isSearchable={false}
                    placeholder={'Sonar system'}
                    items={['demon', 'lofar']}
                    onChange={(sonarSys) =>
                      recordMetaDispatch({
                        type: recordMetaAction.SET_SONAR_SYSTEM,
                        payload: sonarSys as SonarSystem,
                      })
                    }
                    size={DropdownSizes.SMALL}
                  />
                </div>
              </div>

              <div className='col-span-1 flex items-center justify-between'>
                <span className='text-lg font-bold opacity-80 3xl:text-xl'>
                  No. of channels:
                </span>
                <div className='w-[12rem]'>
                  <Dropdown
                    isSearchable={false}
                    placeholder={'channels'}
                    items={['Mono', 'Stereo']}
                    onChange={(channel) =>
                      recordMetaDispatch({
                        type: recordMetaAction.SET_NUMBER_OF_CHANNELS,
                        payload: channel === 'Stereo' ? 2 : 1,
                      })
                    }
                    size={DropdownSizes.SMALL}
                  />
                </div>
              </div>

              <div className='col-span-1 flex items-center justify-between'>
                <span className='text-lg font-bold opacity-80 3xl:text-xl'>
                  Target:
                </span>
                <div className='w-[14rem]'>
                  <Dropdown
                    isSearchable={true}
                    placeholder={'Targets'}
                    items={
                      targetsList
                        ? targetsList.map((target) => target.name)
                        : []
                    }
                    onChange={(targetId) =>
                      recordMetaDispatch({
                        type: recordMetaAction.SET_TARGETS_IDS,
                        payload: [targetId],
                      })
                    }
                    size={DropdownSizes.SMALL}
                  />
                </div>
              </div>

              <div className='col-span-1 flex items-center justify-between'>
                <span className='text-lg font-bold opacity-80 3xl:text-xl'>
                  Operation name:
                </span>
                <div className='w-[12rem]'>
                  <Input
                    type={InputTypes.text}
                    value={recordMetaState.operation}
                    onChange={(text: string) =>
                      recordMetaDispatch({
                        type: recordMetaAction.SET_OPERATION_NAME,
                        payload: text,
                      })
                    }
                  />
                </div>
              </div>

              <div className='col-span-1 flex items-center justify-between'>
                <span className='text-lg font-bold opacity-80 3xl:text-xl'>
                  Source:
                </span>
                <div className='w-[12rem]'>
                  <Input
                    type={InputTypes.text}
                    value={recordMetaState.source}
                    onChange={(text: string) =>
                      recordMetaDispatch({
                        type: recordMetaAction.SET_SOURCE,
                        payload: text,
                      })
                    }
                  />
                </div>
              </div>
              <span></span>

              <div className='col-span-2 flex flex-row items-center justify-between gap-4 3xl:py-10'>
                <span className='min-w-fit text-lg font-bold opacity-80 3xl:text-xl'>
                  difficulty level:
                </span>
                <div className='relative w-full'>
                  <Slider
                    isMultiple={false}
                    min={0}
                    max={10}
                    step={0.5}
                    value={recordMetaState.difficulty_level}
                    onChange={handleRangeChange}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className='absolute bottom-4 w-[33%] 2xl:w-[20%] 2xl:text-xl'>
            <Button
              label={'Save'}
              color={ButtonColors.BLUE}
              onClick={() => props.onSave(recordMetaState)}
            />
          </div>
        </div>
      ) : selectedPopup === PopupsTypes.SONOLISTMETADATA ? (
        <div className='relative m-5 flex h-[40rem] w-[40rem] justify-center rounded-md bg-white p-5 dark:bg-duoGrayDark-darkest xl:h-[40rem] xl:w-[55rem] 2xl:h-[50rem] 2xl:w-[70rem] 3xl:w-[80rem]'>
          <Pagination
            components={{ button: Input }}
            subProps={{
              type: InputTypes.text,
              value: 'afs',
              onChange: () => console.log('try1'),
            }}
            onNext={{ try: () => true }}
          />
        </div>
      ) : null}
    </div>
  );
};

export default MetadataPopup;
