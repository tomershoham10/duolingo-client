'use client';
import { useCallback, useEffect } from 'react';
import { useStore } from 'zustand';
import { useCourseStore } from '../store/stores/useCourseStore';
import { usePopupStore } from '../store/stores/usePopupStore';
import { PopupsTypes } from '../store/stores/usePopupStore';
import Button, { ButtonColors } from '@/components/(buttons)/Button/page';
import { FaTrash, FaBook, FaUsers, FaGraduationCap, FaPlus } from 'react-icons/fa';
import { HiAcademicCap } from 'react-icons/hi';
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
    <main className='flex h-full w-full flex-col items-center justify-start gap-8 p-6 bg-duoGray-lighter dark:bg-duoGrayDark-darkest'>
      {/* Header Section */}
      <section className='flex w-full max-w-7xl items-center justify-between'>
        <div className='flex items-center gap-4'>
          <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-duoBlue-default dark:bg-duoBlueDark-default'>
            <HiAcademicCap className='h-7 w-7 text-white' />
          </div>
          <div>
            <h1 className='text-3xl font-extrabold text-duoGray-darkest dark:text-duoGrayDark-lightest'>
              Courses
            </h1>
            <p className='text-duoGray-dark dark:text-duoGrayDark-light'>
              Manage your learning courses
            </p>
          </div>
        </div>
        <Button
          label='New Course'
          color={ButtonColors.BLUE}
          onClick={handleNewCourse}
        />
      </section>


      {/* Courses Grid */}
      <section className='w-full max-w-7xl'>
        {coursesList && coursesList.length > 0 ? (
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
            {coursesList.map((item) => (
              <div 
                key={item._id} 
                className='group relative overflow-hidden rounded-xl border border-duoGray-light bg-white shadow-sm transition-all duration-300 hover:border-duoBlue-light hover:shadow-lg hover:-translate-y-1 dark:border-duoGrayDark-light dark:bg-duoBlueDark-darkest dark:hover:border-duoBlueDark-text'
              >
                {/* Delete Button */}
                <button
                  onClick={() => handleDeleteCourse(item._id)}
                  className='absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-duoRed-default opacity-0 transition-all duration-200 hover:bg-duoRed-lighter hover:text-duoRed-darker group-hover:opacity-100 dark:bg-duoBlueDark-darkest/80 dark:hover:bg-duoRed-default dark:hover:text-white'
                  title='Delete course'
                >
                  <FaTrash className="h-3 w-3" />
                </button>

                {/* Course Header */}
                <div className='h-20 bg-gradient-to-br from-duoBlue-default to-duoBlue-dark dark:from-duoBlueDark-default dark:to-duoBlueDark-dark'>
                  <div className='flex h-full items-center justify-center'>
                    <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm'>
                      <FaBook className='h-6 w-6 text-white' />
                    </div>
                  </div>
                </div>

                {/* Course Content */}
                <div className='flex flex-col h-full'>
                  {/* Main Content Area - Clickable to Syllabus */}
                  <Link
                    href={`/classroom/courses/${item.name?.toLowerCase()}/syllabus`}
                    className='block p-6 flex-1'
                  >
                    <div className='flex flex-col gap-3'>
                      <h2 className='text-xl font-bold text-duoGray-darkest transition-colors hover:text-duoBlue-default dark:text-duoGrayDark-lightest dark:hover:text-duoBlueDark-text'>
                        {item.name}
                      </h2>
                      <p className='text-sm text-duoGray-dark dark:text-duoGrayDark-light line-clamp-2'>
                        {item.description || 'No description available for this course.'}
                      </p>
                    </div>
                  </Link>
                  
                  {/* Course Footer - Separate Clickable Areas */}
                  <div className='px-6 pb-6'>
                    <div className='flex items-center justify-between pt-3 border-t border-duoGray-light dark:border-duoGrayDark-light'>
                      <Link
                        href={`/classroom/courses/${item.name?.toLowerCase()}/students`}
                        className='flex items-center gap-2 py-2 px-3 rounded-lg transition-all hover:bg-duoGreen-lightest dark:hover:bg-duoGreenDark-light hover:text-duoGreen-dark dark:hover:text-duoGreenDark-text'
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className='flex h-6 w-6 items-center justify-center rounded-full bg-duoGreen-lightest dark:bg-duoGreenDark-light'>
                          <FaUsers className='h-3 w-3 text-duoGreen-default dark:text-duoGreenDark-text' />
                        </div>
                        <span className='text-xs font-medium text-duoGray-dark dark:text-duoGrayDark-light'>
                          Students
                        </span>
                      </Link>
                      <Link
                        href={`/classroom/courses/${item.name?.toLowerCase()}/syllabus`}
                        className='flex items-center gap-1 py-2 px-3 rounded-lg text-duoBlue-default dark:text-duoBlueDark-text transition-all hover:bg-duoBlue-lightest dark:hover:bg-duoBlueDark-dark hover:text-duoBlue-dark dark:hover:text-duoBlueDark-textHover'
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span className='text-xs font-medium'>Syllabus</span>
                        <svg className='h-3 w-3 transition-transform group-hover:translate-x-1' fill='currentColor' viewBox='0 0 20 20'>
                          <path fillRule='evenodd' d='M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z' clipRule='evenodd' />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className='flex flex-col items-center justify-center py-16'>
            <div className='flex h-24 w-24 items-center justify-center rounded-full bg-duoGray-light dark:bg-duoGrayDark-light'>
              <HiAcademicCap className='h-12 w-12 text-duoGray-dark dark:text-duoGrayDark-lightest' />
            </div>
            <h3 className='mt-6 text-xl font-bold text-duoGray-darkest dark:text-duoGrayDark-lightest'>
              No courses yet
            </h3>
            <p className='mt-2 text-center text-duoGray-dark dark:text-duoGrayDark-light max-w-md'>
              Get started by creating your first course. You can add lessons, exercises, and manage students.
            </p>
            <div className='mt-6'>
              <Button
                label='Create Your First Course'
                color={ButtonColors.BLUE}
                onClick={handleNewCourse}
              />
            </div>
          </div>
        )}
      </section>
    </main>
  );
};

export default CoursesPage;