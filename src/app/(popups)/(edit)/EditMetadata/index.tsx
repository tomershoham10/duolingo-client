import { lazy } from 'react';
import { useStore } from 'zustand';
import { PopupsTypes } from '@/app/store/stores/usePopupStore';
import PopupHeader from '../../PopupHeader/page';
import { useInfoBarStore } from '@/app/store/stores/useInfoBarStore';

const RecordsMetadataPopup = lazy(
  () => import('./(subPages)/_RecordsMetadata')
);
const ImagesMetadataPopup = lazy(() => import('./(subPages)/_ImagesMetadata'));

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
      header={`Edit metadata${selectedFile?.name && ` - ${selectedFile}`}`}
      onClose={() => {}}
    >
      {mainTypeId && subTypeId && model && selectedFile ? (
        selectedFile.name?.endsWith('.wav') ? (
          <div className='mt-12 grid w-full grid-cols-4 grid-rows-6 gap-y-4 px-4 py-4 3xl:gap-y-12'>
            <RecordsMetadataPopup
              mainTypeId={mainTypeId}
              subTypeId={subTypeId}
              model={model}
              selectedFile={selectedFile}
            />
          </div>
        ) : (
          <div className='mt-12 grid w-full grid-cols-4 grid-rows-6 gap-y-4 px-4 py-4 3xl:gap-y-12'>
            <ImagesMetadataPopup
              mainTypeId={mainTypeId}
              subTypeId={subTypeId}
              model={model}
              selectedFile={selectedFile}
            />
          </div>
        )
      ) : (
        <>loading...</>
      )}
    </PopupHeader>
  );
};

export default EditMetadataPopup;
