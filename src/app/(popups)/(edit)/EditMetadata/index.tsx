import { useStore } from 'zustand';
import { PopupsTypes } from '@/app/store/stores/usePopupStore';
import PopupHeader from '../../PopupHeader/page';
import { useInfoBarStore } from '@/app/store/stores/useInfoBarStore';

const EditMetadataPopup: React.FC = () => {
  const mainTypeId = useStore(
    useInfoBarStore,
    (state) => state.selectedMainTypeId
  );
  const subTypeId = useStore(
    useInfoBarStore,
    (state) => state.selectedSubTypeId
  );
  const model = useStore(useInfoBarStore, (state) => state.selectedModel);
  const selectedFile = useStore(useInfoBarStore, (state) => state.selectedFile);
  return (
    <PopupHeader
      popupType={PopupsTypes.EDIT_METADATA}
      header={`Edit metadata - ${selectedFile?.name}`}
      onClose={() => {}}
    >
      {selectedFile?.name?.endsWith('.wav') ? (
        <div className='mt-12 grid w-full grid-cols-4 grid-rows-6 gap-y-4 px-4 py-4 3xl:gap-y-12'>
          <p className='col-span-1 flex-none text-lg font-bold text-duoGray-darkest dark:text-duoGrayDark-lightest'>
            records
          </p>
        </div>
      ) : (
        <div className='mt-12 grid w-full grid-cols-4 grid-rows-6 gap-y-4 px-4 py-4 3xl:gap-y-12'>
          <p className='col-span-1 flex-none text-lg font-bold text-duoGray-darkest dark:text-duoGrayDark-lightest'>
            Images
          </p>
        </div>
      )}
    </PopupHeader>
  );
};

export default EditMetadataPopup;
