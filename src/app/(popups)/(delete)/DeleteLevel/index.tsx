'use client';
import { useCallback } from 'react';
import { useStore } from 'zustand';
import { usePopupStore, PopupsTypes } from '@/app/store/stores/usePopupStore';
import { useAlertStore, AlertSizes } from '@/app/store/stores/useAlertStore';
import Button, { ButtonColors } from '@/components/(buttons)/Button/page';
import { deleteLevelById } from '@/app/API/classes-service/levels/functions';
import pRetry from 'p-retry';
import PopupHeader, { PopupSizes } from '../../PopupHeader/page';
import { useCourseStore } from '@/app/store/stores/useCourseStore';
import { useInfoBarStore } from '@/app/store/stores/useInfoBarStore';
import useCourseData from '@/app/_utils/hooks/useCourseData';
import { useReducer } from 'react';
import { courseDataReducer } from '@/reducers/courseDataReducer';

const DeleteLevelPopup: React.FC = () => {
  const levelId = useStore(useInfoBarStore, (state) => state.syllabusFieldId);
  const selectedCourse = useStore(useCourseStore, (state) => state.selectedCourse);
  const updateSelectedCourse = useCourseStore.getState().updateSelectedCourse;
  const updateSelectedPopup = usePopupStore.getState().updateSelectedPopup;
  const addAlert = useAlertStore.getState().addAlert;
  const levelIndex = useStore(useInfoBarStore, (state) => state.syllabusFieldIndex);

  // Get the current course ID for refreshing data after deletion
  const courseId = selectedCourse?._id || null;
  
  const initialCourseDataState = {
    courseId: courseId,
    levels: [{ fatherId: null, data: [] }],
    lessons: [{ fatherId: null, data: [] }],
    exercises: [{ fatherId: null, data: [] }],
    results: [],
  };

  const [courseDataState, courseDataDispatch] = useReducer(
    courseDataReducer,
    initialCourseDataState
  );
  
  const { fetchCourseData } = useCourseData(
    undefined,
    courseDataState,
    courseDataDispatch
  );

  const handleDelete = useCallback(async () => {
    if (!levelId) return;

    try {
      const success = await pRetry(
        () => deleteLevelById(levelId),
        {
          retries: 3,
        }
      );

      if (success) {
        // Update the course store if we have a selected course and it has the level ID
        if (selectedCourse && selectedCourse.levelsIds && selectedCourse.levelsIds.includes(levelId)) {
          // Create a new course object with the updated levelsIds
          const updatedCourse = {
            ...selectedCourse,
            levelsIds: selectedCourse.levelsIds.filter(id => id !== levelId)
          };
          
          // Update the course store
          updateSelectedCourse(updatedCourse);
          
          // Force refresh course data to update the UI
          if (selectedCourse._id) {
            window.location.reload();
          }
        }

        updateSelectedPopup(PopupsTypes.CLOSED);
        addAlert('Level deleted successfully', AlertSizes.small);
      } else {
        addAlert('Failed to delete level', AlertSizes.small);
      }
    } catch (error) {
      console.error('Error deleting level:', error);
      addAlert('Error deleting level', AlertSizes.small);
    }
  }, [levelId, selectedCourse, addAlert, updateSelectedCourse, updateSelectedPopup]);

  const handleCancel = useCallback(() => {
    updateSelectedPopup(PopupsTypes.CLOSED);
  }, [updateSelectedPopup]);

  // Get level name or number from index
  const levelName = levelIndex !== undefined ? `Level ${levelIndex + 1}` : `Level ID: ${levelId?.substring(0, 6)}...`;

  return (
    <PopupHeader
      popupType={PopupsTypes.DELETE_LEVEL}
      header="Delete Level"
      size={PopupSizes.SMALL}
    >
      <div className="grid w-full grid-cols-1 gap-y-4 px-4 py-4">
        <p className="text-lg text-duoGray-darkest dark:text-duoGrayDark-lightest">
          Are you sure you want to delete {levelName}?
          <br />
          This action cannot be undone and will remove all lessons and exercises in this level.
        </p>
        
        <div className="flex justify-end gap-4 mt-4">
          <Button
            label="Cancel"
            color={ButtonColors.GRAY}
            onClick={handleCancel}
          />
          <Button
            label="Delete"
            color={ButtonColors.RED}
            onClick={handleDelete}
          />
        </div>
      </div>
    </PopupHeader>
  );
};

export default DeleteLevelPopup; 