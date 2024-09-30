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
      header={`Edit metadata${selectedFile?.name && ` - ${selectedFile.name}`}`}
      onClose={() => {}}
    >
      {/* size={
          selectedFile && selectedFile.name?.endsWith('.wav')
            ? PopupSizes.MEDIUM
            : PopupSizes.SMALL
        } */}
      {mainTypeId && subTypeId && model && selectedFile ? (
        selectedFile.name?.endsWith('.wav') ? (
          <RecordsMetadataPopup
            mainTypeId={mainTypeId}
            subTypeId={subTypeId}
            model={model}
            selectedFile={selectedFile}
          />
        ) : (
          <ImagesMetadataPopup
            mainTypeId={mainTypeId}
            subTypeId={subTypeId}
            model={model}
            selectedFile={selectedFile}
          />
        )
      ) : (
        <>loading...</>
      )}
    </PopupHeader>
  );
};

export default EditMetadataPopup;
