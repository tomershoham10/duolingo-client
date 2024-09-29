'use client';
import { useReducer } from 'react';
import { useStore } from 'zustand';
import FsaData from './FsaData/page';
import FilesSelection from './FilesSelection/page';
import Pagination from '@/components/Navigation/Pagination/page';
import { useInfoBarStore } from '@/app/store/stores/useInfoBarStore';
import { fsaDataReducer } from '@/reducers/adminView/(create)/fsaDataReducer';
import { ExercisesTypes } from '@/app/API/classes-service/exercises/functions';
import { FileTypes } from '@/app/API/files-service/functions';

const CreateFsa: React.FC = () => {
  const components = { Files: FilesSelection, Create: FsaData };

  const selectedMainTypeId = useStore(
    useInfoBarStore,
    (state) => state.selectedMainTypeId
  );
  const selectedSubTypeId = useStore(
    useInfoBarStore,
    (state) => state.selectedSubTypeId
  );
  const selectedModel = useStore(
    useInfoBarStore,
    (state) => state.selectedModel
  );

  const selectedFile = useStore(useInfoBarStore, (state) => state.selectedFile);

  const onNext = {
    Files: () => {
      return selectedFile !== null;
    },
    Create: () => {
      return true;
    },
  };

  const initialFsaDataState = {
    description: undefined,
    relevant: [],
    unfilledFields: [],
    showPlaceholder: true,
    targetFromDropdown: null,
  };

  const [fsaDataState, fsaDataDispatch] = useReducer(
    fsaDataReducer,
    initialFsaDataState
  );

  const onSubmit = async () => {
    try {
      if (
        selectedMainTypeId &&
        selectedSubTypeId &&
        selectedModel &&
        selectedFile &&
        selectedFile.name
      ) {
        const exercise = {
          type: ExercisesTypes.FSA,
          fileRoute: {
            mainId: selectedMainTypeId,
            subTypeId: selectedSubTypeId,
            modelId: selectedModel._id,
            fileType: FileTypes.RECORDS,
            objectName: selectedFile.name,
          },
          description: fsaDataState.description || undefined,
          timeBuffers: [],
        };
        await createFsa(exercise);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const createFsa = async (exercise: Partial<FsaType>) => {
    try {
      console.log('createFsa', exercise);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Pagination
      components={components}
      onNext={onNext}
      onSubmit={onSubmit}
      subProps={{
        fsaDataState,
        fsaDataDispatch,
      }}
    />
  );
};

export default CreateFsa;
