'use client';
import { useStore } from 'zustand';
import { useCourseStore } from '@/app/store/stores/useCourseStore';
import {
  fieldToEditType,
  useInfoBarStore,
} from '@/app/store/stores/useInfoBarStore';
import { PopupsTypes, usePopupStore } from '@/app/store/stores/usePopupStore';
import Button, { ButtonColors } from '@/components/Button/page';
import { suspendUnit, unsuspendUnit } from '@/app/API/classes-service/courses/functions';
import { suspendLevel, unsuspendLevel } from '@/app/API/classes-service/units/functions';
import { suspendLesson, unsuspendLesson } from '@/app/API/classes-service/levels/functions';

const SyllabusInfo: React.FC = () => {
  const courseName = useStore(useCourseStore, (state) => state.name);
  const updateSelectedPopup = usePopupStore.getState().updateSelectedPopup;
  const useInfoBarStoreObj = {
    fieldToEdit: useStore(useInfoBarStore, (state) => state.syllabusFieldType),
    fieldId: useStore(useInfoBarStore, (state) => state.syllabusFieldId),
    fieldIndex: useStore(useInfoBarStore, (state) => state.syllabusFieldIndex),
    fatherId: useStore(useInfoBarStore, (state) => state.syllabusFieldFatherId),
    isFieldSuspended: useStore(
      useInfoBarStore,
      (state) => state.syllabusIsFieldSuspended
    ),
  };

  const suspendField = async () => {
    if (!!useInfoBarStoreObj.fieldId && !!useInfoBarStoreObj.fatherId) {
      switch (useInfoBarStoreObj.fieldToEdit) {
        case fieldToEditType.UNIT:
          const unitStatus = await suspendUnit(
            useInfoBarStoreObj.fatherId,
            useInfoBarStoreObj.fieldId
          );
          return unitStatus;
        case fieldToEditType.LEVEL:
          const levelStatus = await suspendLevel(
            useInfoBarStoreObj.fatherId,
            useInfoBarStoreObj.fieldId
          );
          return levelStatus;
        case fieldToEditType.LESSON:
          const lessonStatus = await suspendLesson(
            useInfoBarStoreObj.fatherId,
            useInfoBarStoreObj.fieldId
          );
          return lessonStatus;
      }
    }
  };

  const unsuspendField = async () => {
    if (!!useInfoBarStoreObj.fieldId && !!useInfoBarStoreObj.fatherId) {
      switch (useInfoBarStoreObj.fieldToEdit) {
        case fieldToEditType.UNIT:
          const unitStatus = await unsuspendUnit(
            useInfoBarStoreObj.fatherId,
            useInfoBarStoreObj.fieldId
          );
          return unitStatus;
        case fieldToEditType.LEVEL:
          const levelStatus = await unsuspendLevel(
            useInfoBarStoreObj.fatherId,
            useInfoBarStoreObj.fieldId
          );
          return levelStatus;
        case fieldToEditType.LESSON:
          const lessonStatus = await unsuspendLesson(
            useInfoBarStoreObj.fatherId,
            useInfoBarStoreObj.fieldId
          );
          return lessonStatus;
      }
    }
  };

  return (
    <section className='h-full w-full p-6'>
      {useInfoBarStoreObj.fieldToEdit ? (
        <div className='flex h-full w-full flex-col justify-start gap-10'>
          <span className='text-center text-3xl'>
            {useInfoBarStoreObj.fieldToEdit} {useInfoBarStoreObj.fieldIndex + 1}
          </span>

          <section className='flex flex-col gap-4'>
            <Button
              label={'Edit'}
              color={ButtonColors.BLUE}
              onClick={() => {
                updateSelectedPopup(PopupsTypes.ADMINEDIT);
              }}
            />

            <ul className='flex flex-row justify-between'>
              <li className='w-[47.5%]'>
                {!useInfoBarStoreObj.isFieldSuspended ? (
                  <Button
                    label={'Suspend'}
                    color={ButtonColors.WHITE}
                    onClick={() => {
                      console.log('suspend click');
                      suspendField();
                    }}
                  />
                ) : (
                  <Button
                    label={'Unsuspend'}
                    color={ButtonColors.PURPLE}
                    onClick={() => {
                      console.log('unsuspend click');
                      unsuspendField();
                    }}
                  />
                )}
              </li>
              <li className='w-[47.5%]'>
                <Button label={'DELETE'} color={ButtonColors.RED} />
              </li>
            </ul>
          </section>
        </div>
      ) : (
        <div className='text-center'>{courseName}</div>
      )}
    </section>
  );
};

export default SyllabusInfo;
