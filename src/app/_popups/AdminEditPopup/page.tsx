'use client';
import { lazy } from 'react';

import useStore from '@/app/store/useStore';
import { usePopupStore } from '@/app/store/stores/usePopupStore';
import {
  fieldToEditType,
  useInfoBarStore,
} from '@/app/store/stores/useInfoBarStore';
import { PopupsTypes } from '@/app/store/stores/usePopupStore';

const EditUnit = lazy(() => import('./EditUnit/page'));
const EditLevel = lazy(() => import('./EditLevel/page'));
const EditLesson = lazy(() => import('./EditLesson/page'));

const AdminEditPopup: React.FC = () => {
  const selectedPopup = useStore(usePopupStore, (state) => state.selectedPopup);

  const infoBarStore = {
    fieldToEdit: useInfoBarStore.getState().syllabusFieldType,
    fieldId: useStore(useInfoBarStore, (state) => state.syllabusFieldId),
    fieldIndex: useStore(useInfoBarStore, (state) => state.syllabusFieldIndex),
    fieldSubIdsList: useStore(
      useInfoBarStore,
      (state) => state.syllabusSubIdsListField
    ),
  };

  const updateSelectedPopup = usePopupStore.getState().updateSelectedPopup;

  const closePopup = () => {
    updateSelectedPopup(PopupsTypes.CLOSED);
  };

  return (
    <section
      className={
        selectedPopup === PopupsTypes.ADMINEDIT
          ? 'fixed z-20 flex h-screen w-screen items-center justify-center overflow-auto bg-[rgb(0,0,0)] bg-[rgba(0,0,0,0.4)] transition duration-200 ease-out'
          : 'z-0 opacity-0 transition duration-200 ease-in'
      }
    >
      {selectedPopup === PopupsTypes.ADMINEDIT &&
      infoBarStore.fieldId &&
      infoBarStore.fieldIndex !== undefined ? (
        infoBarStore.fieldToEdit === fieldToEditType.UNIT ? (
          <EditUnit
            unitId={infoBarStore.fieldId}
            unitIndex={infoBarStore.fieldIndex}
            onClose={closePopup}
          />
        ) : infoBarStore.fieldToEdit === fieldToEditType.LEVEL ? (
          <EditLevel
            levelId={infoBarStore.fieldId}
            levelIndex={infoBarStore.fieldIndex}
            onClose={closePopup}
          />
        ) : infoBarStore.fieldToEdit === fieldToEditType.LESSON ? (
          <EditLesson
            lessonId={infoBarStore.fieldId}
            lessonIndex={infoBarStore.fieldIndex}
            exercisesList={
              infoBarStore.fieldSubIdsList ? infoBarStore.fieldSubIdsList : []
            }
            onClose={closePopup}
          />
        ) : null
      ) : null}
    </section>
  );
};

export default AdminEditPopup;
