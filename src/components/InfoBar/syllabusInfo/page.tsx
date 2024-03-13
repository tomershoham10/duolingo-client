'use client';
import { useCourseStore } from '@/app/store/stores/useCourseStore';
import { useInfoBarStore } from '@/app/store/stores/useInfoBarStore';
import { usePopupStore } from '@/app/store/stores/usePopupStore';
import { useStore } from 'zustand';

const SyllabusInfo: React.FC = () => {
  const courseName = useStore(useCourseStore, (state) => state.name);
  const updateSelectedPopup = usePopupStore.getState().updateSelectedPopup;
  const useInfoBarStoreObj = {
    syllabusFieldToEdit: useStore(
      useInfoBarStore,
      (state) => state.syllabusFieldToEdit
    ),
    syllabusFieldId: useStore(
      useInfoBarStore,
      (state) => state.syllabusFieldId
    ),
  };
  return (
    <section>
      <div>{courseName}</div>
      {useInfoBarStoreObj.syllabusFieldToEdit ? (
        <div>
          <span>
            {useInfoBarStoreObj.syllabusFieldToEdit}{' '}
            {useInfoBarStoreObj.syllabusFieldId}
          </span>
          <button
            onClick={() => {
              updateSelectedPopup(PopupsTypes.ADMINEDIT);
            }}
          >
            edit
          </button>
        </div>
      ) : null}
    </section>
  );
};

export default SyllabusInfo;
