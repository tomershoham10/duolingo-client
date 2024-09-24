'use client';
import Pagination from '@/components/Navigation/Pagination/page';
import { useStore } from 'zustand';
import { useInfoBarStore } from '@/app/store/stores/useInfoBarStore';
import FilesSelection from './FilesSelection/page';
import FsaData from './FsaData/page';

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

  const onSubmit = async () => {
    alert('Submitting form');
  };

  return (
    <Pagination components={components} onNext={onNext} onSubmit={onSubmit} />
  );
};

export default CreateFsa;
