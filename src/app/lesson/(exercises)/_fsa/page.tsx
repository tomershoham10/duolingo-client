import { getZipPassword } from '@/app/API/auth-service/functions';
import { getEncryptedFileByName } from '@/app/API/files-service/functions';
import Dropdown, { DropdownSizes } from '@/components/Dropdown';
import {
  fsaAction,
  fsaReducer,
} from '@/reducers/studentView/(exercises)/fsaReducer';
import pRetry from 'p-retry';
import { useCallback, useEffect, useReducer, useState } from 'react';

interface FsaPageProps {
  currentExercise: FsaType;
  relevant: TargetType[];
  isExerciseStarted: boolean;
  isExerciseSubmitted: boolean;
  selectedTargetIndex: number;
  showPlaceholder: boolean;
  targetFromDropdown: TargetType | null;
  targetsList: TargetType[] | undefined;

  setSelectedTargerIndex: (index: number) => void;
  setTargetFromDropdown: (target: TargetType | null) => void;
  handleTargetsDropdown: (selectedTargetName: string) => void;
}
const FsaPage: React.FC<FsaPageProps> = (props) => {
  const {
    currentExercise,
    relevant,
    isExerciseStarted,
    isExerciseSubmitted,
    selectedTargetIndex,
    showPlaceholder,
    targetFromDropdown,
    targetsList,
    setSelectedTargerIndex,
    setTargetFromDropdown,
    handleTargetsDropdown,
  } = props;

  const initialFsaState = {
    currentExercise: null,
    zipPassword: null,
    relevant: [],
    currentAnswers: [],
    currentResult: null,
    grabbedTargetId: null,
    totalScore: -1, //-1
    timeRemaining: { minutes: 0, seconds: 0 }, //{ minutes: 0, seconds: 0 }
    selectedTargetIndex: -1, //-1,
    targetsToSubmit: [],
    targetFromDropdown: null,
    showPlaceholder: true, //true
  };

  const [fsaState, lessonDispatch] = useReducer(fsaReducer, initialFsaState);

  const [downloadingFile, setDownloadingFile] = useState<boolean>(false);

  const fetchZipPassword = useCallback(async () => {
    const password = await pRetry(
      () => {
        const currentExercise = fsaState.currentExercise;
        if (currentExercise === null) return null;
        const fileName = currentExercise.fileName;
        return getZipPassword(fileName);
      },
      {
        retries: 5,
      }
    );
    console.log('fetchZipPassword', password);
    lessonDispatch({
      type: fsaAction.SET_ZIP_PASSWORD,
      payload: password,
    });
  }, [fsaState.currentExercise]);

  const fetchRelevantData = useCallback(() => {
    if (fsaState.currentExercise) {
      const currentExercise = fsaState.currentExercise;
      const relevantIds = currentExercise.relevant;
      if (!relevantIds) return;
      const foundedRelevant = targetsList?.filter((target) =>
        relevantIds.includes(target._id)
      );

      foundedRelevant && foundedRelevant.length > 0
        ? lessonDispatch({
            type: fsaAction.SET_RELEVANT,
            payload: foundedRelevant,
          })
        : null;
    }
  }, [fsaState.currentExercise, targetsList]);

  useEffect(() => {
    if (fsaState.currentExercise) {
      fetchZipPassword();
      fetchRelevantData();
    }
  }, [fetchRelevantData, fetchZipPassword, fsaState.currentExercise]);

  const downloadRecord = useCallback(
    async (recordName: string, exerciseType: ExercisesTypes) => {
      try {
        setDownloadingFile(true);
        const url = await pRetry(
          () =>
            getEncryptedFileByName(
              BucketsNames.RECORDS,
              exerciseType,
              recordName
            ),
          {
            retries: 5,
          }
        );
        if (url) {
          const a = document.createElement('a');
          a.style.display = 'none';
          a.href = url;
          a.href = url;
          a.download = 'output.zip';
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          console.log('finished');
        }
        setDownloadingFile(false);
      } catch (err) {
        console.error(err);
      }
    },
    []
  );

  return (
    <div className='mx-auto grid w-[80%] grid-rows-[min-content] items-start justify-start 3xl:h-fit'>
      <div className='w-full text-left sm:text-sm xl:text-xl 3xl:text-2xl'>
        {currentExercise.description}
      </div>
      <span className='font-extrabold tracking-wider sm:mt-6 sm:text-lg xl:mt-10 xl:text-2xl'>
        Relevant list:
      </span>
      <div className={`mx-auto mt-4 flex w-full cursor-default flex-row`}>
        {relevant.map((relevantTarget, relevantTargetIndex) => (
          <div
            key={relevantTarget._id}
            className='mr-5 flex flex-row items-end self-end'
          >
            <div className='relative'>
              <div
                className={`border-border-duoGray-regular border-border-duoGray-regular group flex flex-row items-center justify-center rounded-xl border-2 border-b-4 py-4 pl-[45px] pr-[30px] text-lg font-bold text-duoGray-dark dark:border-duoGrayDark-light dark:bg-duoGrayDark-darkest dark:text-duoGrayDark-lightest sm:min-w-[7rem] lg:min-w-[10rem] ${
                  isExerciseStarted
                    ? !isExerciseSubmitted
                      ? 'cursor-pointer active:translate-y-[1px] active:border-b-2'
                      : 'cursor-default'
                    : 'cursor-default'
                } ${
                  !isExerciseStarted && !isExerciseSubmitted
                    ? ''
                    : isExerciseStarted &&
                        !isExerciseSubmitted &&
                        relevantTargetIndex === selectedTargetIndex
                      ? 'cursor-pointer border-duoBlue-dark bg-duoBlue-lightest text-duoBlue-text dark:border-duoGrayDark-lighter dark:bg-duoGrayDark-midDark'
                      : 'cursor-pointer hover:border-duoGray-buttonBorderHover hover:bg-duoGray-lighter group-hover:text-duoGray-darkText hover:dark:border-duoGrayDark-lighter hover:dark:bg-duoGrayDark-midDark'
                } `}
                onClick={() => {
                  if (!isExerciseSubmitted && isExerciseStarted) {
                    setSelectedTargerIndex(relevantTargetIndex);
                    setTargetFromDropdown(null);
                  }
                }}
              >
                <span
                  className={`absolute left-3 inline-flex shrink-0 items-center justify-center rounded-lg border-2 font-bold text-duoGray-dark dark:border-duoGrayDark-light dark:text-duoGrayDark-lightest sm:h-[25px] sm:w-[25px] sm:text-sm lg:h-[30px] lg:w-[30px] xl:text-xl ${
                    !isExerciseStarted && !isExerciseSubmitted
                      ? ''
                      : isExerciseStarted &&
                          !isExerciseSubmitted &&
                          relevantTargetIndex === selectedTargetIndex
                        ? 'border-duoBlue-dark text-duoBlue-text'
                        : 'group-hover:border-duoGray-buttonBorderHover group-hover:text-duoGray-darkText dark:group-hover:border-duoGrayDark-light dark:group-hover:text-duoGrayDark-lightest'
                  }`}
                >
                  {relevantTargetIndex + 1}
                </span>

                <span className='relative flex items-center justify-center text-ellipsis text-center sm:text-lg lg:text-xl'>
                  {relevantTarget.name}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <span className='font-extrabold tracking-wider sm:mt-6 sm:text-lg xl:mt-10 xl:text-2xl'>
        Select target:
      </span>
      {targetsList ? (
        <section className='w-[12rem]'>
          <Dropdown
            isSearchable={true}
            placeholder={'target'}
            items={targetsList.map((target) => target.name)}
            value={
              showPlaceholder
                ? undefined
                : targetFromDropdown
                  ? targetFromDropdown.name
                  : undefined
            }
            onChange={handleTargetsDropdown}
            isDisabled={!isExerciseStarted || isExerciseSubmitted}
            size={DropdownSizes.SMALL}
            className={'z-10 mt-5 w-[16rem]'}
          />
        </section>
      ) : (
        <Dropdown
          isSearchable={false}
          placeholder={'target'}
          items={['']}
          value={''}
          onChange={() => console.log('')}
          isDisabled={!isExerciseSubmitted}
          size={DropdownSizes.SMALL}
          className={'z-10 mt-5 w-[16rem]'}
        />
      )}
    </div>
  );
};

export default FsaPage;

/* <div className='mx-auto grid w-[80%] grid-rows-[min-content] items-start justify-start 3xl:h-fit'>
                      <div className='w-full text-left sm:text-sm xl:text-xl 3xl:text-2xl'>
                        {fsaState.currentExercise.description}
                      </div>
                      <span className='font-extrabold tracking-wider sm:mt-6 sm:text-lg xl:mt-10 xl:text-2xl'>
                        Relevant list:
                      </span>
                      <div
                        className={`mx-auto mt-4 flex w-full cursor-default flex-row`}
                      >
                        {fsaState.relevant.map(
                          (relevantTarget, relevantTargetIndex) => (
                            <div
                              key={relevantTarget._id}
                              className='mr-5 flex flex-row items-end self-end'
                            >
                              <div className='relative'>
                                <div
                                  className={`border-border-duoGray-regular border-border-duoGray-regular group flex flex-row items-center justify-center rounded-xl border-2 border-b-4 py-4 pl-[45px] pr-[30px] text-lg font-bold text-duoGray-dark dark:border-duoGrayDark-light dark:bg-duoGrayDark-darkest dark:text-duoGrayDark-lightest sm:min-w-[7rem] lg:min-w-[10rem] ${
                                    fsaState.isExerciseStarted
                                      ? !fsaState.isExerciseSubmitted
                                        ? 'cursor-pointer active:translate-y-[1px] active:border-b-2'
                                        : 'cursor-default'
                                      : 'cursor-default'
                                  } ${
                                    !fsaState.isExerciseStarted &&
                                    !fsaState.isExerciseSubmitted
                                      ? ''
                                      : fsaState.isExerciseStarted &&
                                          !fsaState.isExerciseSubmitted &&
                                          relevantTargetIndex ===
                                            fsaState.selectedTargetIndex
                                        ? 'cursor-pointer border-duoBlue-dark bg-duoBlue-lightest text-duoBlue-text dark:border-duoGrayDark-lighter dark:bg-duoGrayDark-midDark'
                                        : 'cursor-pointer hover:border-duoGray-buttonBorderHover hover:bg-duoGray-lighter group-hover:text-duoGray-darkText hover:dark:border-duoGrayDark-lighter hover:dark:bg-duoGrayDark-midDark'
                                  } `}
                                  onClick={() => {
                                    if (
                                      !fsaState.isExerciseSubmitted &&
                                      fsaState.isExerciseStarted
                                    ) {
                                      lessonDispatch({
                                        type: fsaAction.SET_SELECTED_TARGET_INDEX,
                                        payload: relevantTargetIndex,
                                      });
                                      lessonDispatch({
                                        type: fsaAction.SET_TARGET_FROM_DROPDOWN,
                                        payload: null,
                                      });
                                    }
                                  }}
                                >
                                  <span
                                    className={`absolute left-3 inline-flex shrink-0 items-center justify-center rounded-lg border-2 font-bold text-duoGray-dark dark:border-duoGrayDark-light dark:text-duoGrayDark-lightest sm:h-[25px] sm:w-[25px] sm:text-sm lg:h-[30px] lg:w-[30px] xl:text-xl ${
                                      !fsaState.isExerciseStarted &&
                                      !fsaState.isExerciseSubmitted
                                        ? ''
                                        : fsaState.isExerciseStarted &&
                                            !fsaState.isExerciseSubmitted &&
                                            relevantTargetIndex ===
                                              fsaState.selectedTargetIndex
                                          ? 'border-duoBlue-dark text-duoBlue-text'
                                          : 'group-hover:border-duoGray-buttonBorderHover group-hover:text-duoGray-darkText dark:group-hover:border-duoGrayDark-light dark:group-hover:text-duoGrayDark-lightest'
                                    }`}
                                  >
                                    {relevantTargetIndex + 1}
                                  </span>

                                  <span className='relative flex items-center justify-center text-ellipsis text-center sm:text-lg lg:text-xl'>
                                    {relevantTarget.name}
                                  </span>
                                </div>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                      <span className='font-extrabold tracking-wider sm:mt-6 sm:text-lg xl:mt-10 xl:text-2xl'>
                        Select target:
                      </span>
                      {targetsList ? (
                        <section className='w-[12rem]'>
                          <Dropdown
                            isSearchable={true}
                            placeholder={'target'}
                            items={targetsList.map((target) => target.name)}
                            value={
                              fsaState.showPlaceholder
                                ? undefined
                                : fsaState.targetFromDropdown
                                  ? fsaState.targetFromDropdown.name
                                  : undefined
                            }
                            onChange={handleTargetsDropdown}
                            isDisabled={
                              !fsaState.isExerciseStarted ||
                              fsaState.isExerciseSubmitted
                            }
                            size={DropdownSizes.SMALL}
                            className={'z-10 mt-5 w-[16rem]'}
                          />
                        </section>
                      ) : (
                        <Dropdown
                          isSearchable={false}
                          placeholder={'target'}
                          items={['']}
                          value={''}
                          onChange={() => console.log('')}
                          isDisabled={!fsaState.isExerciseSubmitted}
                          size={DropdownSizes.SMALL}
                          className={'z-10 mt-5 w-[16rem]'}
                        />
                      )}
                    </div> */
