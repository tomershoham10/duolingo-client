'use client';
import { useReducer, useEffect, useCallback, lazy, Dispatch } from 'react';

const DraggbleList = lazy(() => import('@/components/DraggableList/page'));
import { draggingAction, draggingReducer } from '@/reducers/dragReducer';
import { Diractions } from '@/components/DraggableList/page';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import { useContextMenuStore } from '@/app/store/stores/useContextMenuStore';

import Slider from '@/components/Slider/page';
import Textbox, { FontSizes } from '@/components/Textbox/page';
import Dropdown, { DropdownSizes } from '@/components/Dropdown';
import PlusButton from '@/components/PlusButton/page';

import {
  TimeBuffersAction,
  TimeBuffersActionsList,
  TimeBuffersReducerType,
} from '@/reducers/timeBuffersReducer';

import {
  FsaDataAction,
  FsaDataActionsList,
  FsaDataType,
} from '@/reducers/adminView/(create)/fsaDataReducer';
// import { useCreateFsaStore } from '@/app/store/stores/(createExercises)/useCreateFsaStore';
import { AlertSizes, useAlertStore } from '@/app/store/stores/useAlertStore';
import { useFetchTargets } from '@/app/_utils/hooks/(dropdowns)/useFechTargets';

library.add(faPlus);

interface CreateFsaDataSectionProps {
  recordLength: number;
  fsaDataState: FsaDataType;
  fsaDataDispatch: Dispatch<FsaDataAction>;
  timeBuffersState: TimeBuffersReducerType;
  timeBuffersDispatch: Dispatch<TimeBuffersAction>;
}

const FsaData: React.FC<CreateFsaDataSectionProps> = (props) => {
  const {
    recordLength,
    fsaDataState,
    fsaDataDispatch,
    timeBuffersState,
    timeBuffersDispatch,
  } = props;

  console.log('FsaData props', props);

  const addAlert = useAlertStore.getState().addAlert;
  const targetsList = useFetchTargets()?.filter((target) => target.level === 3);

  const toggleMenuOpen = useContextMenuStore().toggleMenuOpen;
  const setCoordinates = useContextMenuStore().setCoordinates;
  const setContent = useContextMenuStore().setContent;

  //   #region initiating states

  const initialRelevantDraggingState = {
    grabbedItemId: 'released',
    itemsList: [],
  };

  const [relevantDraggingState, relevantDraggingDispatch] = useReducer(
    draggingReducer,
    initialRelevantDraggingState
  );
  //   #endregion

  //   const [unfilledFields, setUnfilledFields] = useState<fsaFieldsType[]>([]);

  //   useEffect(() => {
  //     console.log('setting FileName', fileName);
  //     setSelectedFileName(fileName);
  //   }, [fileName]);

  const setRelevant = useCallback(() => {
    fsaDataDispatch({
      type: FsaDataActionsList.SET_RELEVANT,
      payload: relevantDraggingState.itemsList,
    });
  }, [fsaDataDispatch, relevantDraggingState.itemsList]);

  useEffect(() => {
    setRelevant();
  }, [setRelevant]);

  const handleTargetsDropdown = useCallback(
    (selectedTargetName: string) => {
      fsaDataDispatch({
        type: FsaDataActionsList.SET_SHOW_PLACE_HOLDER,
        payload: false,
      });

      if (targetsList) {
        const selectedTarget = targetsList.find(
          (target) => target.name === selectedTargetName
        );

        if (selectedTarget) {
          fsaDataDispatch({
            type: FsaDataActionsList.SET_TARGET_FROM_DROPDOWN,
            payload: selectedTarget,
          });
        }
      }
    },
    [fsaDataDispatch, targetsList]
  );

  const addTargetToRelevant = useCallback(() => {
    if (fsaDataState.targetFromDropdown) {
      const relevantIds = fsaDataState.relevant.map((target) => target.id);
      if (!relevantIds.includes(fsaDataState.targetFromDropdown._id)) {
        fsaDataDispatch({
          type: FsaDataActionsList.ADD_RELEVANT,
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
  }, [
    addAlert,
    fsaDataDispatch,
    fsaDataState?.relevant,
    fsaDataState?.targetFromDropdown,
  ]);

  const handleContextMenu = useCallback(
    (event: React.MouseEvent<HTMLDivElement>, left: number, right: number) => {
      event.preventDefault();
      toggleMenuOpen();
      setCoordinates({
        pageX: event.pageX,
        pageY: event.pageY,
      });
      setContent([
        {
          icon: faPlus,
          onClick: () => {
            console.log('clicked');

            timeBuffersDispatch({
              type: TimeBuffersActionsList.SET_ADDED_VALUE_LEFT_PERC,
              payload: Math.round(
                100 * ((event.pageX - left) / (right - left))
              ),
            });

            toggleMenuOpen();
          },
        },
      ]);
      console.log(left, right, '%');
    },
    [setContent, setCoordinates, timeBuffersDispatch, toggleMenuOpen]
  );

  const handleTimeBufferRange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index?: number
  ) => {
    e.preventDefault();

    index !== undefined
      ? timeBuffersDispatch({
          type: TimeBuffersActionsList.EDIT_TIME_VALS_ARRAY,
          payload: { index: index, newVal: Number(e.target.value) },
        })
      : null;
  };

  const deleteTimeBuffer = (index: number) => {
    console.log('new exercise - deleteTimeBuffer - index', index);
    timeBuffersDispatch({
      type: TimeBuffersActionsList.DELETE_TIME_BUFFER,
      payload: index,
    });
  };

  const findPervScoreIndex = useCallback(
    (newScore: number, newTime: number): number | undefined => {
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
    },
    [timeBuffersState.timeBuffersScores]
  );

  const addNewScoreBuffer = useCallback(
    (pervScoreIndex: number, newScore: number, newTime: number) => {
      console.log('pervScoreIndex', pervScoreIndex);
      timeBuffersDispatch({
        type: TimeBuffersActionsList.ADD_NEW_SCORE_BUFFER,
        payload: { newScore, newTime },
      });
    },
    [timeBuffersDispatch]
  );

  const handleNewScore = useCallback(
    (newScore: number, newTime: number) => {
      const minutesArrays = timeBuffersState.timeBufferRangeValues;

      if (minutesArrays.includes(newTime) || minutesArrays[0] > newTime) {
        return false;
      }
      const pervScoreIndex = findPervScoreIndex(newScore, newTime);
      console.log('pervScoreIndex', pervScoreIndex);
      pervScoreIndex !== undefined
        ? addNewScoreBuffer(pervScoreIndex, newScore, newTime)
        : null;
    },
    [
      addNewScoreBuffer,
      findPervScoreIndex,
      timeBuffersState.timeBufferRangeValues,
    ]
  );

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
                type: FsaDataActionsList.SET_DESCRIPTION,
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
    </div>
  );
};
export default FsaData;
