'use client';
import useStore from '@/app/store/useStore';
import { useInfoBarStore } from '@/app/store/stores/useInfoBarStore';
import FileData from '../FileData/page';
import Button, { ButtonColors } from '@/components/Button/page';
import { PopupsTypes, usePopupStore } from '@/app/store/stores/usePopupStore';

const RecordsInfo: React.FC = () => {
  const infoBarStore = {
    selectedFile: useStore(useInfoBarStore, (state) => state.selectedFile),
  };
  const updateSelectedPopup = usePopupStore.getState().updateSelectedPopup;

  return (
    <>
      {!!infoBarStore.selectedFile ? (
        <section className='flex h-full flex-col justify-between '>
          <FileData />
          <section className='mx-auto mb-6 flex w-[90%] flex-col gap-4'>
            <Button
              label={'Edit'}
              color={ButtonColors.BLUE}
              onClick={() => {
                updateSelectedPopup(PopupsTypes.RECORDMETADATA);
              }}
            />

            {/* <ul className='flex flex-row justify-between'>
              <li className='w-[47.5%]'>
             
              <li className='w-[47.5%]'> */}
            <Button label={'DELETE'} color={ButtonColors.RED} />
            {/* </li> */}
            {/* </ul> */}
          </section>
        </section>
      ) : null}
    </>
  );
};

export default RecordsInfo;
