'use client';
import { useState, useEffect, useCallback } from 'react';
import pRetry from 'p-retry';
import useStore from '@/app/store/useStore';
import { useCourseStore } from '@/app/store/stores/useCourseStore';
import Button, { ButtonColors } from '@/components/(buttons)/Button/page';
// import { usePopupStore } from '@/app/store/stores/usePopupStore';
import { AlertSizes, useAlertStore } from '@/app/store/stores/useAlertStore';
import AdminUnit from '@/components/UnitSection/AdminUnit/page';
import LodingAdminSection from '@/components/UnitSection/AdminUnit/LodingAdminSection/page';
import { createByCourse } from '@/app/API/classes-service/units/functions';
import { getCourseById } from '@/app/API/classes-service/courses/functions';

const Syllabus: React.FC = () => {
  const selectedCourse = useStore(
    useCourseStore,
    (state) => state.selectedCourse
  );

  const addAlert = useAlertStore.getState().addAlert;

  const [unitsIds, setUnitsIds] = useState<string[]>([]);
  const getUnits = useCallback(async () => {
    try {
      const response = await pRetry(
        () =>
          selectedCourse && selectedCourse._id
            ? getCourseById(selectedCourse._id)
            : null,
        {
          retries: 5,
        }
      );
      if (!!!response) {
        console.error('Failed to fetch course by id.');
        return [];
      }
      const unitsIdsList = response.unitsIds;
      setUnitsIds(unitsIdsList);
    } catch (error) {
      console.error('Error fetching courses:', error);
      return [];
    }
  }, [selectedCourse]);

  useEffect(() => {
    if (selectedCourse && selectedCourse._id) {
      getUnits();
    }
  }, [getUnits, selectedCourse]);

  const AddUnit = useCallback(async () => {
    try {
      if (!selectedCourse || !selectedCourse._id) {
        addAlert('Error starting the course', AlertSizes.small);
        return;
      }
      const response = await pRetry(() => createByCourse(selectedCourse._id), {
        retries: 5,
      });
      if (response === 200) {
        getUnits();
      }
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  }, [addAlert, getUnits, selectedCourse]);

  return (
    <div className='mx-1 h-full w-full overflow-y-auto'>
      {unitsIds ? (
        unitsIds.length > 0 && !!selectedCourse && !!selectedCourse._id ? (
          <AdminUnit courseId={selectedCourse._id} />
        ) : (
          <div className='flex w-full'>
            <div className='mx-24 h-full w-full'>
              <LodingAdminSection />
            </div>
          </div>
        )
      ) : (
        <div className='flex h-full w-full flex-col justify-start'>
          <span className='flex-none text-2xl font-extrabold text-duoGray-darkest'>
            0 units
          </span>
          <Button
            label={'START COURSE'}
            color={ButtonColors.BLUE}
            onClick={() => {
              AddUnit();
            }}
            style={
              'w-44 flex-none mt-[] mx-auto flex justify-center items-cetnter'
            }
          />
        </div>
      )}
    </div>
  );
};

export default Syllabus;
