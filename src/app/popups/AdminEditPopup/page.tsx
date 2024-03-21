'use client';
import { useState, useEffect } from 'react';

import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { GoPlus } from 'react-icons/go';
import { FaRegTrashAlt } from 'react-icons/fa';

import useStore from '@/app/store/useStore';
import { useAlertStore } from '@/app/store/stores/useAlertStore';
import { usePopupStore } from '@/app/store/stores/usePopupStore';
import {
  fieldToEditType,
  useInfoBarStore,
} from '@/app/store/stores/useInfoBarStore';
import { getUnitById } from '@/app/API/classes-service/units/functions';
import SortableItem from '@/components/SortableItem/page';
import Textbox from '@/components/Textbox/page';

import { PopupsTypes } from '@/app/store/stores/usePopupStore';
import EditUnit from './EditUnit/page';
import EditLevel from './EditLevel/page';
import EditLesson from './EditLesson/page';

library.add(faXmark);

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

  const addAlert = useAlertStore.getState().addAlert;
  const updateSelectedPopup = usePopupStore.getState().updateSelectedPopup;

  const [unit, setUnit] = useState<UnitType>();
  const [edittedArray, setEdittedArray] = useState<string[]>([]);

  useEffect(() => {
    const fetchUnit = async (unitId: string) => {
      const response = await getUnitById(unitId);
      if (response) {
        setUnit(response);
      }
    };

    if (
      selectedPopup === PopupsTypes.ADMINEDIT &&
      infoBarStore.fieldToEdit === fieldToEditType.UNIT &&
      infoBarStore.fieldId
    ) {
      fetchUnit(infoBarStore.fieldId);
    }
  }, [selectedPopup, infoBarStore.fieldToEdit, infoBarStore.fieldId]);

  useEffect(() => {
    if (unit && unit.levels) {
      setEdittedArray(unit?.levels);
    }
  }, [unit]);

  useEffect(() => {
    console.log('edittedArray', edittedArray);
  }, [edittedArray]);

  const removeItem = (itemId: string) => {
    setEdittedArray(edittedArray.filter((item) => item != itemId));
  };

  const closePopup = () => {
    updateSelectedPopup(PopupsTypes.CLOSED);
  };

  return (
    <>
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
    </>
  );
};

export default AdminEditPopup;
