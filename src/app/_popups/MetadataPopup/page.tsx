import { library } from '@fortawesome/fontawesome-svg-core';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

import useStore from '@/app/store/useStore';
import { PopupsTypes, usePopupStore } from '@/app/store/stores/usePopupStore';

import RecordMetadata from './RecordMetadata/page';
import SonoramMetadata from './SonogramMetadata/page';
import { BucketsNames } from '@/app/API/files-service/functions';

library.add(faXmark);

interface MetadataProps {
  onSave: (type: BucketsNames, data: Partial<Metadata>) => void;
}

const MetadataPopup: React.FC<MetadataProps> = (props) => {
  const selectedPopup = useStore(usePopupStore, (state) => state.selectedPopup);

  return (
    <div
      className={
        selectedPopup === PopupsTypes.RECORDMETADATA ||
        selectedPopup === PopupsTypes.SONOLISTMETADATA
          ? 'fixed left-0 top-0 z-20 flex h-screen w-screen items-center justify-center overflow-auto bg-[rgb(0,0,0)] bg-[rgba(0,0,0,0.4)] transition duration-200 ease-out'
          : 'z-0 opacity-0 transition duration-200 ease-in'
      }
    >
      {selectedPopup === PopupsTypes.RECORDMETADATA ? (
        <RecordMetadata onSave={props.onSave} />
      ) : selectedPopup === PopupsTypes.SONOLISTMETADATA ? (
        <SonoramMetadata />
      ) : null}
    </div>
  );
};

export default MetadataPopup;
