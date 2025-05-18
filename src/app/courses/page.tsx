'use client';
import { useCallback, useEffect } from 'react';
import { useStore } from 'zustand';
import { useCourseStore } from '../store/stores/useCourseStore';
import { usePopupStore } from '../store/stores/usePopupStore';
import { PopupsTypes } from '../store/stores/usePopupStore';
import Button, { ButtonColors } from '@/components/(buttons)/Button/page';
import { FaTrash } from 'react-icons/fa';

import Link from "next/link";

const CoursesPage = () => {
  const coursesList = useStore(useCourseStore, (state) => state.coursesList);
  const updateSelectedPopup = usePopupStore.getState().updateSelectedPopup;
  const updateCoursesList = useCourseStore.getState().updateCoursesList;

  const handleNewCourse = useCallback(() => {
    updateSelectedPopup(PopupsTypes.NEW_COURSE);
  }, [updateSelectedPopup]);

  const handleDeleteCourse = useCallback((courseId: string) => {
    updateSelectedPopup(PopupsTypes.DELETE_COURSE);
    useCourseStore.getState().setSelectedCourseId(courseId);
  }, [updateSelectedPopup]);

  return (
    <main className='flex h-full w-full flex-col items-center justify-start gap-6 p-6'>
      <section className='flex w-full items-center justify-between'>
        <h1 className='text-3xl font-bold'>Courses</h1>
        <Button
          label='New Course'
          color={ButtonColors.BLUE}
          onClick={handleNewCourse}
        />
      </section>

      <section className='grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {coursesList?.map((item) => (
          <div key={item._id} className='relative flex flex-col gap-4 rounded-lg border border-duoGray-light bg-white p-6 shadow-sm transition-all hover:border-duoBlue-light hover:shadow-md dark:border-duoGrayDark-light dark:bg-duoBlueDark-darkest'>
            <button
              onClick={() => handleDeleteCourse(item._id)}
              className='absolute right-4 top-4 text-duoRed-default/60 hover:text-duoRed-dark transition-colors'
              title='Delete course'
            >
              <FaTrash className="h-4 w-4" />
            </button>
            <div className='flex justify-between items-start'>
              <Link
                href={`/classroom/courses/${item.name?.toLowerCase()}/students`}
                className='flex-1'
              >
                <div className='flex flex-col gap-2'>
                  <h2 className='text-xl font-bold text-duoGray-darker dark:text-duoGrayDark-lightest'>
                    {item.name}
                  </h2>
                  <p className='text-sm text-duoGray-dark dark:text-duoGrayDark-light'>
                    {item.description || 'No description'}
                  </p>
                </div>
              </Link>
            </div>
          </div>
        ))}
        {!coursesList || coursesList.length === 0 && (
          <span className='text-duoGray-darkest opacity-70 dark:text-duoGrayDark-lightest'>
            NO COURSES
          </span>
        )}
      </section>
    </main>
  );
};

export default CoursesPage;