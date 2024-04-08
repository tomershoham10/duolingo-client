'use client';
import useStore from '@/app/store/useStore';
import { useInfoBarStore } from '@/app/store/stores/useInfoBarStore';
import FileData from '../FileData/page';

const RecordsInfo: React.FC = () => {
  const infoBarStore = {
    selectedFile: useStore(useInfoBarStore, (state) => state.selectedFile),
  };

  return <>{!!infoBarStore.selectedFile ? <FileData /> : null}</>;
};

export default RecordsInfo;
