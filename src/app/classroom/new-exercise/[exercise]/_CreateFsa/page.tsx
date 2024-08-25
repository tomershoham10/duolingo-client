'use client';
import { useReducer, useEffect, useCallback, lazy, useState } from 'react';
import { useRouter } from 'next/navigation';

import { useStore } from 'zustand';

const DraggbleList = lazy(() => import('@/components/DraggableList/page'));
import { draggingAction, draggingReducer } from '@/reducers/dragReducer';
import { Diractions } from '@/components/DraggableList/page';

import pRetry from 'p-retry';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import { useContextMenuStore } from '@/app/store/stores/useContextMenuStore';

import { useFetchTargets } from '@/app/_utils/hooks/useFechTargets';

import Slider from '@/components/Slider/page';
import Textbox, { FontSizes } from '@/components/Textbox/page';
import Dropdown, { DropdownSizes } from '@/components/Dropdown';
import PlusButton from '@/components/PlusButton/page';
import Button, { ButtonColors } from '@/components/Button/page';

import {
  TimeBuffersAction,
  timeBuffersReducer,
} from '@/reducers/timeBuffersReducer';

import {
  fsaDataAction,
  fsaDataReducer,
} from '@/reducers/adminView/create/fsaDataReducer';
import { useCreateFsaStore } from '@/app/store/stores/(createExercises)/useCreateFsaStore';
import { AlertSizes, useAlertStore } from '@/app/store/stores/useAlertStore';
import {
  createExercise,
  ExercisesTypes,
} from '@/app/API/classes-service/exercises/functions';

library.add(faPlus);

const CreateFsa: React.FC = () => {
  const router = useRouter();

  const addAlert = useAlertStore.getState().addAlert;
  const targetsList = useFetchTargets();
  const [isUploading, setIsUploading] = useState<boolean>(false);
  //   const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  const fileName = useStore(useCreateFsaStore, (state) => state.fileName);
  const recordLength = useStore(
    useCreateFsaStore,
    (state) => state.recordLength
  );

  const resetCreateFsaStore = useCreateFsaStore.getState().resetStore;

  const contextMenuStore = {
    toggleMenuOpen: useContextMenuStore.getState().toggleMenuOpen,
    setCoordinates: useContextMenuStore.getState().setCoordinates,
    setContent: useContextMenuStore.getState().setContent,
  };

  const initialFsaDataState = {
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

  const [fsaDataState, fsaDataDispatch] = useReducer(
    fsaDataReducer,
    initialFsaDataState
  );

  const [relevantDraggingState, relevantDraggingDispatch] = useReducer(
    draggingReducer,
    initialRelevantDraggingState
  );

  const [timeBuffersState, timeBuffersDispatch] = useReducer(
    timeBuffersReducer,
    initialTimeBuffersState
  );

  //   const [unfilledFields, setUnfilledFields] = useState<fsaFieldsType[]>([]);

  //   useEffect(() => {
  //     console.log('setting FileName', fileName);
  //     setSelectedFileName(fileName);
  //   }, [fileName]);

  const setRelevant = useCallback(() => {
    fsaDataDispatch({
      type: fsaDataAction.SET_RELEVANT,
      payload: relevantDraggingState.itemsList,
    });
  }, [relevantDraggingState.itemsList]);

  useEffect(() => {
    setRelevant();
  }, [setRelevant]);

  const handleTargetsDropdown = (selectedTargetName: string) => {
    fsaDataDispatch({
      type: fsaDataAction.SET_SHOW_PLACE_HOLDER,
      payload: false,
    });

    if (targetsList) {
      const selectedTarget = targetsList.find(
        (target) => target.name === selectedTargetName
      );

      if (selectedTarget) {
        fsaDataDispatch({
          type: fsaDataAction.SET_TARGET_FROM_DROPDOWN,
          payload: selectedTarget,
        });
      }
    }
  };

  const addTargetToRelevant = () => {
    if (fsaDataState.targetFromDropdown) {
      const relevantIds = fsaDataState.relevant.map((target) => target.id);
      if (!relevantIds.includes(fsaDataState.targetFromDropdown._id)) {
        fsaDataDispatch({
          type: fsaDataAction.ADD_RELEVANT,
          payload: {
            id: fsaDataState.targetFromDropdown._id,
            name: fsaDataState.targetFromDropdown.name,
          },
        });
        relevantDraggingDispatch({
          type: draggingAction.ADD_ITEM,
          payload: {
            id: fsaDataState.targetFromDropdown._id,
            name: fsaDataState.targetFromDropdown.name,
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

  const submit = useCallback(async () => {
    console.log('submit - fileName', fileName);
    if (fileName) {
      setIsUploading(true);
      const timeBuffers = timeBuffersState.timeBuffersScores.map(
        (score, index) => ({
          timeBuffer: timeBuffersState.timeBuffersScores[index],
          grade: score,
        })
      );

      const exerciseObject = {
        type: ExercisesTypes.FSA,
        timeBuffers: timeBuffers,
        description: fsaDataState.description,
        fileName: fileName,
        relevant: fsaDataState.relevant,
      };
      console.log('submit fsa exerciseObject', exerciseObject);

      const response = await pRetry(() => createExercise(exerciseObject), {
        retries: 5,
      });
      if (response) {
        addAlert('Exercise added successfully', AlertSizes.small);
        resetCreateFsaStore();
        router.push('/classroom');
      } else {
        addAlert('Error while createing an exercise', AlertSizes.small);
      }
    } else {
      addAlert('Please select a record', AlertSizes.small);
    }
    setIsUploading(false);
  }, [
    addAlert,
    fileName,
    fsaDataState.description,
    fsaDataState.relevant,
    resetCreateFsaStore,
    router,
    timeBuffersState.timeBuffersScores,
  ]);

  return (
    <div className='relative mx-auto flex h-full w-full flex-col tracking-wide text-duoGray-darkest dark:text-duoGrayDark-lightest'>
      <section>
        <span className='my-3 text-2xl font-bold'>Description:</span>
        <div className='mb-4 mt-3'>
          <Textbox
            isEditMode={false}
            fontSizeProps={FontSizes.MEDIUM}
            placeHolder={'Add desription...'}
            value={fsaDataState.description}
            onChange={(text: string) => {
              fsaDataDispatch({
                type: fsaDataAction.SET_DESCRIPTION,
                payload: text,
              });
            }}
          />
        </div>
      </section>
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
                  fsaDataState.showPlaceholder
                    ? undefined
                    : fsaDataState.targetFromDropdown
                      ? fsaDataState.targetFromDropdown.name
                      : undefined
                }
                onChange={handleTargetsDropdown}
                size={DropdownSizes.DEFAULT}
              />
            </div>

            <PlusButton label={'relevant'} onClick={addTargetToRelevant} />
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

      <div className='relative flex flex-col items-start justify-center'>
        <div className='my-3 flex w-fit flex-row items-center justify-between gap-3'>
          <span className={`'text-duoRed-default' my-3 text-2xl font-bold`}>
            Time Buffers:
          </span>
        </div>

        <div className='relative mt-6 flex w-full pb-[5rem]'>
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
      <section className='absolute bottom-6 w-[6rem]'>
        <Button
          color={ButtonColors.BLUE}
          isLoading={isUploading}
          loadingLabel={'Uploading...'}
          label='CREATE'
          onClick={submit}
        />
      </section>
    </div>
  );
};
export default CreateFsa;
