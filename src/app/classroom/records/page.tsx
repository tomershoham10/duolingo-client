import { useStore } from 'zustand';
import AcintDataSection from '../new-exercise/_AcintData/page';
import { useInfoBarStore } from '@/app/store/stores/useInfoBarStore';

const Records: React.FC = () => {
  const infoBarStore = {
    selectedFile: useStore(useInfoBarStore, (state) => state.selectedFile),
  };
  console.log('records', infoBarStore.selectedFile);
  return (
    <section className='px-10 py-6 2xl:px-16'>
      <AcintDataSection />
    </section>
  );
};
export default Records;
