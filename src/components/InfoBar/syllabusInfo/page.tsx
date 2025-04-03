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
  addLevelByUnitId,
  suspendLesson,
  unsuspendLesson,
} from '@/app/API/classes-service/levels/functions';
import pRetry from 'p-retry';
import { useCallback } from 'react';
import RoundButton from '@/components/RoundButton';
import { TiPlus } from 'react-icons/ti';
import { FiTrash2 } from 'react-icons/fi';
import { addLessonByLevelId } from '@/app/API/classes-service/lessons/functions';
import { LESSONS_API, LEVELS_API, UNITS_API } from '@/app/API/classes-service/apis';

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

  const handleEditButtonClicked = useCallback(() => {
    if (!!fieldId) {
      switch (fieldToEdit) {
        case fieldToEditType.UNIT:
          updateSelectedPopup(PopupsTypes.EDIT_UNIT);

        case fieldToEditType.LEVEL:
          updateSelectedPopup(PopupsTypes.EDIT_LEVEL);

        case fieldToEditType.LESSON:
          updateSelectedPopup(PopupsTypes.EDIT_LESSON);
          break;
      }
    }
  }, [fieldId, fieldToEdit, updateSelectedPopup]);

  const handlePlusButton = useCallback(async () => {
    try {
      console.log('handlePlusButton', fieldToEdit);
      if (!!fieldId) {
        switch (fieldToEdit) {
          case fieldToEditType.UNIT:
            const unitStatus = await pRetry(() => addLevelByUnitId(fieldId), {
              retries: 5,
            });
            return unitStatus;

          case fieldToEditType.LEVEL:
            const levelStatus = await pRetry(
              () => addLessonByLevelId(fieldId),
              {
                retries: 5,
              }
            );
            return levelStatus;

          case fieldToEditType.LESSON:
            updateSelectedPopup(PopupsTypes.ADD_EXERCISES);
            break;
        }
      }
    } catch (err) {
      console.error('suspendField error:', err);
    }
  }, [fieldId, fieldToEdit, updateSelectedPopup]);

  const suspendField = useCallback(async () => {
    try {
      if (!!fieldId && !!fatherId) {
        switch (fieldToEdit) {
          case fieldToEditType.UNIT:
            const unitStatus = await pRetry(
              () => suspendUnit(fatherId, fieldId),
              {
                retries: 5,
              }
            );

            return unitStatus;
          case fieldToEditType.LEVEL:
            const levelStatus = await pRetry(
              () => suspendLevel(fatherId, fieldId),
              {
                retries: 5,
              }
            );

            return levelStatus;
          case fieldToEditType.LESSON:
            const lessonStatus = await pRetry(
              () => suspendLesson(fatherId, fieldId),
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

  const handleDeleteButton = useCallback(async () => {

    try {
      if (!!fieldId && !!fatherId) {
        switch (fieldToEdit) {
          case fieldToEditType.UNIT:
            return await pRetry(
              () => deleteItemById(fieldId, UNITS_API.DELLETE_UNIT_BY_UNIT_ID),
              {
                retries: 5,
              }
            );
          case fieldToEditType.LEVEL:
            return await pRetry(
              () => deleteItemById(fieldId, LEVELS_API.DELLETE_LEVEL_BY_LEVEL_ID),
              {
                retries: 5,
              }
            );
          case fieldToEditType.LESSON:
            return await pRetry(
              () => deleteItemById(fieldId, LESSONS_API.DELLETE_LESSON_BY_LESSON_ID),
              {
                retries: 5,
              }
            );
        }
      }
    } catch (err) {
      console.error('fetchData error:', err);
    }
  }, [fatherId, fieldId, fieldToEdit]);

  return (
    <section className='h-full w-full p-6'>
      {fieldToEdit ? (
        <div className='flex h-full w-full flex-col justify-between gap-10'>
          <span className='text-center text-3xl'>
            {fieldToEdit} {fieldIndex + 1}
          </span>

          <section className='flex flex-col gap-4'>
            <section className='flex flex-row items-center justify-between'>
              <section className='w-[75%]'>
                <Button
                  label={'Edit'}
                  color={ButtonColors.BLUE}
                  onClick={handleEditButtonClicked}
                />
              </section>
              <RoundButton Icon={TiPlus} onClick={handlePlusButton} />
            </section>

            <ul className='flex flex-row justify-between'>
              <li className='w-[75%]'>
                {isFieldSuspended ? (
                  <Button
                    label={'Unsuspend'}
                    color={ButtonColors.PURPLE}
                    onClick={() => {
                      console.log('unsuspend click');
                      unsuspendField();
                    }}
                  />
                ) : (
                  <Button
                    label={'Suspend'}
                    color={ButtonColors.WHITE}
                    onClick={() => {
                      console.log('suspend click');
                      suspendField();
                    }}
                  />
                )}
              </li>

              <RoundButton Icon={FiTrash2} onClick={() => handleDeleteButton()} />
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
async function deleteItemById(lessonId: string, api_path: string): Promise<any> {
  try {
    const response = await fetch(
      `${api_path}/${lessonId}`,
      {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    return response.status === 201;
  } catch (error: any) {
    throw new Error(`error while addLessonByLevelId: ${error.message}`);
  }
}

