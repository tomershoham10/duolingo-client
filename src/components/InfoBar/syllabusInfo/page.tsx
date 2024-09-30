'use client';
import { useStore } from 'zustand';
import { useCourseStore } from '@/app/store/stores/useCourseStore';
import {
  fieldToEditType,
  useInfoBarStore,
} from '@/app/store/stores/useInfoBarStore';
import { PopupsTypes, usePopupStore } from '@/app/store/stores/usePopupStore';
import Button, { ButtonColors } from '@/components/(buttons)/Button/page';
import {
  suspendUnit,
  unsuspendUnit,
} from '@/app/API/classes-service/courses/functions';
import {
  suspendLevel,
  unsuspendLevel,
} from '@/app/API/classes-service/units/functions';
import {
  suspendLesson,
  unsuspendLesson,
} from '@/app/API/classes-service/levels/functions';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import PlusButton from '@/components/PlusButton/page';
import pRetry from 'p-retry';
import { useCallback } from 'react';

const SyllabusInfo: React.FC = () => {
  const selectedCourse = useStore(
    useCourseStore,
    (state) => state.selectedCourse
  );
  const updateSelectedPopup = usePopupStore.getState().updateSelectedPopup;
  const fieldToEdit = useStore(
    useInfoBarStore,
    (state) => state.syllabusFieldType
  );
  const fieldId = useStore(useInfoBarStore, (state) => state.syllabusFieldId);
  const fieldIndex = useStore(
    useInfoBarStore,
    (state) => state.syllabusFieldIndex
  );
  const fatherId = useStore(
    useInfoBarStore,
    (state) => state.syllabusFieldFatherId
  );
  const isFieldSuspended = useStore(
    useInfoBarStore,
    (state) => state.syllabusIsFieldSuspended
  );

  const suspendField = useCallback(async () => {
    try {
      if (!!fieldId && !!fatherId) {
        switch (fieldToEdit) {
          case fieldToEditType.UNIT:
            const unitStatus = await pRetry(
              () =>
                !!fieldId && !!fatherId ? suspendUnit(fatherId, fieldId) : null,
              {
                retries: 5,
              }
            );

            return unitStatus;
          case fieldToEditType.LEVEL:
            const levelStatus = await pRetry(
              () =>
                !!fieldId && !!fatherId
                  ? suspendLevel(fatherId, fieldId)
                  : null,
              {
                retries: 5,
              }
            );

            return levelStatus;
          case fieldToEditType.LESSON:
            const lessonStatus = await pRetry(
              () =>
                !!fieldId && !!fatherId
                  ? suspendLesson(fatherId, fieldId)
                  : null,
              {
                retries: 5,
              }
            );
            return lessonStatus;
        }
      }
    } catch (err) {
      console.error('suspendField error:', err);
    }
  }, [fatherId, fieldId, fieldToEdit]);

  const unsuspendField = useCallback(async () => {
    try {
      if (!!fieldId && !!fatherId) {
        switch (fieldToEdit) {
          case fieldToEditType.UNIT:
            const unitStatus = await pRetry(
              () =>
                !!fieldId && !!fatherId
                  ? unsuspendUnit(fatherId, fieldId)
                  : null,
              {
                retries: 5,
              }
            );

            return unitStatus;
          case fieldToEditType.LEVEL:
            const levelStatus = await pRetry(
              () =>
                !!fieldId && !!fatherId
                  ? unsuspendUnit(fatherId, fieldId)
                  : null,
              {
                retries: 5,
              }
            );
            return levelStatus;
          case fieldToEditType.LESSON:
            const lessonStatus = await pRetry(
              () =>
                !!fieldId && !!fatherId
                  ? unsuspendUnit(fatherId, fieldId)
                  : null,
              {
                retries: 5,
              }
            );
            return lessonStatus;
        }
      }
    } catch (err) {
      console.error('fetchData error:', err);
    }
  }, [fatherId, fieldId, fieldToEdit]);

  return (
    <section className='h-full w-full p-6'>
      {fieldToEdit ? (
        <div className='flex h-full w-full flex-col justify-start gap-10'>
          <span className='text-center text-3xl'>
            {fieldToEdit} {fieldIndex + 1}
          </span>

          <section className='flex flex-col gap-4'>
            <section className='flex flex-row items-center justify-between'>
              <section className='w-[75%]'>
                <Button
                  label={'Edit'}
                  color={ButtonColors.BLUE}
                  onClick={() => {
                    updateSelectedPopup(PopupsTypes.ADMINEDIT);
                  }}
                />
              </section>
              <PlusButton onClick={() => {}} />
            </section>

            <ul className='flex flex-row justify-between'>
              <li className='w-[70%]'>
                {!isFieldSuspended ? (
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
              <li className='w-[3.5rem]'>
                <Button color={ButtonColors.RED} icon={faTrashCan} />
              </li>
            </ul>
          </section>
        </div>
      ) : (
        <div className='text-center'>{selectedCourse?.name}</div>
      )}
    </section>
  );
};

export default SyllabusInfo;
