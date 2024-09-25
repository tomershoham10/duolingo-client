'use client';
import { useReducer } from 'react';
import { useStore } from 'zustand';
import FsaData from './FsaData/page';
import FilesSelection from './FilesSelection/page';
import Pagination from '@/components/Navigation/Pagination/page';
import { useInfoBarStore } from '@/app/store/stores/useInfoBarStore';
import { fsaDataReducer } from '@/reducers/adminView/(create)/fsaDataReducer';

const CreateFsa: React.FC = () => {
  const components = { Files: FilesSelection, Create: FsaData };

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
      alert('Submitting form');
      //   createFsa()
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
        Create: {
          fsaDataState,
          fsaDataDispatch,
        },
      }}
    />
  );
};

export default CreateFsa;
