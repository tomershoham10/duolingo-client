'use client';
import { PopupsTypes, usePopupStore } from '@/app/store/stores/usePopupStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import SwitchButton from '@/components/SwitchButton/page';
import { useReducer } from 'react';
import {
  recordMetaAction,
  recordMetadataReducer,
} from '@/reducers/recordMetadataReducer';
import { useCreateExerciseStore } from '@/app/store/stores/useCreateExerciseStore';
import { formatNumberToMinutes } from '@/app/utils/functions/formatNumberToMinutes';
import Dropdown, { DropdownSizes } from '@/components/Dropdown/page';
import { useStore } from 'zustand';
import { SignatureTypes, SonarSystem } from '@/app/API/files-service/functions';
import { useTargetStore } from '@/app/store/stores/useTargetStore';
import { useSourceStore } from '@/app/store/stores/useSourceStore';
import Input, { InputTypes } from '@/components/Input/page';
import Slider from '@/components/Slider/page';
import Button, { ButtonColors } from '@/components/Button/page';
import { FilesTypes } from '../page';

library.add(faXmark);

interface RecordMetaEditProps {
  onSave: (type: FilesTypes, data: Partial<RecordMetadataType>) => void;
}

const RecordMetadata: React.FC<RecordMetaEditProps> = (props) => {
  const updateSelectedPopup = usePopupStore.getState().updateSelectedPopup;
  const targetsList = useStore(useTargetStore, (state) => state.targets);
  const sourcesList = useStore(useSourceStore, (state) => state.sources);

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
    source_id: '',
    is_in_italy: false,
    signature_type: SignatureTypes.PASSIVE,
    channels_number: 1,
    sonar_system: SonarSystem.DEMON,
    is_backround_vessels: false,
    aux: false,
  };

  const [recordMetaState, recordMetaDispatch] = useReducer(
    recordMetadataReducer,
    initialRecordMetaState
  );

  const handleRangeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    recordMetaDispatch({
      type: recordMetaAction.SET_DIFFICULTY_LEVEL,
      payload: Number(event.target.value),
    });
  };
  return (
    <div className='relative m-5 flex h-[35rem] w-[40rem] justify-center rounded-md bg-white p-5 dark:bg-duoGrayDark-darkest md:h-[35rem] xl:h-[35rem] xl:w-[55rem] 2xl:w-[57.5rem] 3xl:w-[70rem]'>
      <button
        onClick={() => {
          updateSelectedPopup(PopupsTypes.CLOSED);
        }}
        className='z-50 h-fit w-fit flex-none rounded-md text-duoGray-dark'
      >
        <FontAwesomeIcon className='fa-lg fa-solid flex-none' icon={faXmark} />
      </button>
      <div className='w-full items-start justify-start'>
        <div className='absolute left-0 flex h-10 w-full justify-center border-b-2 text-xl font-extrabold dark:border-duoBlueDark-text 3xl:h-12 3xl:text-2xl'>
          Add Metadata
        </div>
        <div className='mt-12 grid w-full grid-cols-2 grid-rows-5 gap-x-12 gap-y-2 px-4 py-4 3xl:gap-y-12'>
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
              Signature type:
            </span>
            <div className=' w-[12rem]'>
              <Dropdown
                isSearchable={false}
                placeholder={'Signature'}
                items={[
                  SignatureTypes.ACTIVE,
                  SignatureTypes.PASSIVE,
                  SignatureTypes.PASSIVEACTIVE,
                  SignatureTypes.TORPEDO,
                ]}
                onChange={(trans) =>
                  recordMetaDispatch({
                    type: recordMetaAction.SET_SIGNATURE_TYPE,
                    payload: trans as SignatureTypes,
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
            <div className='w-[12rem]'>
              <Dropdown
                isSearchable={false}
                placeholder={'S. system'}
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
            <div className='w-[12rem]'>
              <Dropdown
                isSearchable={true}
                placeholder={'Targets'}
                items={
                  targetsList ? targetsList.map((target) => target.name) : []
                }
                onChange={(targetName) =>
                  recordMetaDispatch({
                    type: recordMetaAction.SET_TARGETS_IDS,
                    payload: [
                      targetsList
                        ? targetsList.filter(
                            (target) => target.name === targetName
                          )[0]._id
                        : '',
                    ],
                  })
                }
                size={DropdownSizes.SMALL}
              />
            </div>
          </div>
          <div className='col-span-1 flex items-center justify-between'>
            <span className='text-lg font-bold opacity-80 3xl:text-xl'>
              Source:
            </span>
            <div className='w-[12rem]'>
              <Dropdown
                isSearchable={true}
                placeholder={'Source'}
                items={
                  sourcesList ? sourcesList.map((source) => source.name) : []
                }
                onChange={(sourceName) => {
                  if (sourcesList) {
                    const sourceId = sourcesList.filter(
                      (source) => source.name === sourceName
                    )[0]._id;
                    console.log(sourceId);
                    recordMetaDispatch({
                      type: recordMetaAction.SET_SOURCE_ID,
                      payload: sourceId,
                    });
                  }
                }}
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

          <div className='col-span-2 flex flex-row items-center justify-between gap-4 3xl:py-10'>
            <span className='min-w-fit text-lg font-bold opacity-80 3xl:text-xl'>
              difficulty level:
            </span>
            <div className='relative my-5 w-full'>
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

      <div className='absolute bottom-5 w-[33%] 2xl:w-[20%] 2xl:text-xl'>
        <Button
          label={'Save'}
          color={ButtonColors.BLUE}
          onClick={() => {
            props.onSave(FilesTypes.RECORD, recordMetaState);
            updateSelectedPopup(PopupsTypes.CLOSED);
          }}
        />
      </div>
    </div>
  );
};

export default RecordMetadata;
