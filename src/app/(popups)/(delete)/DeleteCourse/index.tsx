'use client';
import { useCallback } from 'react';
import { useStore } from 'zustand';
import { useCourseStore } from '@/app/store/stores/useCourseStore';
import { usePopupStore, PopupsTypes } from '@/app/store/stores/usePopupStore';
import { useAlertStore, AlertSizes } from '@/app/store/stores/useAlertStore';
import Button, { ButtonColors } from '@/components/(buttons)/Button/page';
import { deleteCourse } from '@/app/API/classes-service/courses/functions';
import pRetry from 'p-retry';
import PopupHeader, { PopupSizes } from '../../PopupHeader/page';

const DeleteCoursePopup: React.FC = () => {
  const coursesList = useStore(useCourseStore, (state) => state.coursesList);
  const selectedCourseId = useStore(useCourseStore, (state) => state.selectedCourseId);
  const updateCoursesList = useCourseStore.getState().updateCoursesList;
  const setSelectedCourseId = useCourseStore.getState().setSelectedCourseId;
  const updateSelectedPopup = usePopupStore.getState().updateSelectedPopup;
  const addAlert = useAlertStore.getState().addAlert;

  const handleDelete = useCallback(async () => {
    if (!selectedCourseId) return;

    try {
      const status = await pRetry(() => deleteCourse(selectedCourseId), {
        retries: 5,
      });
      if (status) {
        const updatedCourses = coursesList?.filter(course => course._id !== selectedCourseId) || [];
        updateCoursesList(updatedCourses);
        setSelectedCourseId(null);
        updateSelectedPopup(PopupsTypes.CLOSED);
        addAlert('Course deleted successfully.', AlertSizes.small);
      } else {
        addAlert('Error while deleting the course! Please try again', AlertSizes.small);
      }
    } catch (err) {
      addAlert(`Error while deleting course: ${err}`, AlertSizes.small);
      console.error('Delete course error:', err);
    }
  }, [selectedCourseId, coursesList, addAlert]);

  const handleCancel = useCallback(() => {
    setSelectedCourseId(null);
    updateSelectedPopup(PopupsTypes.CLOSED);
  }, []);

  const selectedCourse = coursesList?.find(course => course._id === selectedCourseId);

  return (
    <PopupHeader
      popupType={PopupsTypes.DELETE_COURSE}
      header="Delete Course"
      size={PopupSizes.SMALL}
    >
      <div className="grid w-full grid-cols-1 gap-y-4 px-4 py-4">
        <p className="text-lg text-duoGray-darkest dark:text-duoGrayDark-lightest">
          Are you sure you want to delete the course "{selectedCourse?.name}"?
          <br />
          This action cannot be undone.
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

export default DeleteCoursePopup;