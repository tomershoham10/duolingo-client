import { PopupsTypes, usePopupStore } from '@/app/store/stores/usePopupStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
library.add(faXmark);

const SonoramMetadata: React.FC = () => {
  const updateSelectedPopup = usePopupStore.getState().updateSelectedPopup;
  return (
    <div className='relative m-5 flex h-[40rem] w-[40rem] justify-center rounded-md bg-white p-5 dark:bg-duoGrayDark-darkest xl:h-[40rem] xl:w-[55rem] 2xl:h-[50rem] 2xl:w-[70rem] 3xl:w-[80rem]'>
      <button
        onClick={() => {
          updateSelectedPopup(PopupsTypes.CLOSED);
        }}
        className='z-50 h-fit w-fit flex-none rounded-md text-duoGray-dark'
      >
        <FontAwesomeIcon className='fa-lg fa-solid flex-none' icon={faXmark} />
      </button>
    </div>
  );
};

export default SonoramMetadata;
