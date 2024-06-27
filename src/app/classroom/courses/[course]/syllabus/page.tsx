'use client';
import { useState, useEffect } from 'react';
import useStore from '@/app/store/useStore';
import { useCourseStore } from '@/app/store/stores/useCourseStore';
import Button, { ButtonColors } from '@/components/Button/page';
// import { usePopupStore } from '@/app/store/stores/usePopupStore';
import { AlertSizes, useAlertStore } from '@/app/store/stores/useAlertStore';
import AdminUnit from '@/components/UnitSection/AdminUnit/page';
import LodingAdminSection from '@/components/UnitSection/AdminUnit/LodingAdminSection/page';
import pRetry from 'p-retry';
import { createByCourse } from '@/app/API/classes-service/units/functions';
import { getCourseById } from '@/app/API/classes-service/courses/functions';

const run = async () => {};

const Syllabus: React.FC = () => {
  const courseId = useStore(useCourseStore, (state) => state._id);

  //   const updateSelectedPopup = usePopupStore.getState().updateSelectedPopup;

  const addAlert = useAlertStore.getState().addAlert;

  const [unitsIds, setUnitsIds] = useState<string[]>([]);
  // console.log("unitsIds", unitsIds);

  useEffect(() => {
    if (courseId) {
      // console.log("syllabus1", courseId);
      getUnits();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  const AddUnit = async () => {
    try {
      if (courseId === undefined) {
        addAlert('Error starting the course', AlertSizes.small);
        return;
      }
      //   const response = await fetch(
      //     'http://localhost:8080/api/units/createByCourse',
      //     {
      //       method: 'POST',
      //       credentials: 'include',
      //       headers: {
      //         'Content-Type': 'application/json',
      //       },
      //       body: JSON.stringify({
      //         unitData: { levels: [] },
      //         courseId: courseId,
      //       }),
      //     }
      //   );

      //   if (response.status === 200) {
      //     getUnits();
      //   }
      const response = await pRetry(() => createByCourse(courseId), {
        retries: 5,
      });
      if (response === 200) {
        getUnits();
      }
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  };

  const getUnits = async () => {
    try {
      //   const response = await fetch(
      //     `http://localhost:8080/api/courses/${courseId}`,
      //     {
      //       method: 'GET',
      //       credentials: 'include',
      //       headers: {
      //         'Content-Type': 'application/json',
      //       },
      //     }
      //   );

      const response = await pRetry(
        () => (courseId ? getCourseById(courseId) : null),
        {
          retries: 5,
        }
      );
      if (!!!response) {
        console.error('Failed to fetch course by id.');
        return [];
      }
      const unitsIdsList = response.unitsIds;
      // console.log("syllabus2", unitsIdsList);
      setUnitsIds(unitsIdsList);
    } catch (error) {
      console.error('Error fetching courses:', error);
      return [];
    }
  };

  return (
    <div className='mx-1 h-full w-full overflow-y-auto'>
      {unitsIds ? (
        unitsIds.length > 0 && !!courseId ? (
          <AdminUnit courseId={courseId} />
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
