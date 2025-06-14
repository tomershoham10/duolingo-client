'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faHome,
  faUser,
  faChalkboardUser,
  faCog,
  faRightToBracket,
  faSquarePlus,
  faDatabase,
  faUsersRectangle,
  faMicrophone,
  faChartBar,
} from '@fortawesome/free-solid-svg-icons';

import pRetry from 'p-retry';
import useStore from '@/app/store/useStore';
import { useCourseStore } from '@/app/store/stores/useCourseStore';
import {
  getCourseByName,
  getCourses,
} from '@/app/API/classes-service/courses/functions';

import handleLogout from '@/app/_utils/functions/handleLogOut';
import { PopupsTypes } from '@/app/store/stores/usePopupStore';
import { ExercisesTypes } from '@/app/API/classes-service/exercises/functions';
import CourseList from './CourseList';
import ItemsList from './ItemsList';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useUserStore } from '@/app/store/stores/useUserStore';

library.add(faHome, faUser, faCog, faRightToBracket, faSquarePlus, faDatabase, faUsersRectangle, faMicrophone, faChartBar);

const AdminSideBar: React.FC = () => {
  const pathname = usePathname();
  const user = useStore(useUserStore, (state) => state.user);

  const selectedCourse = useStore(
    useCourseStore,
    (state) => state.selectedCourse
  );
  const coursesList = useStore(useCourseStore, (state) => state.coursesList);
  const updateCoursesList = useCourseStore.getState().updateCoursesList;
  const updateSelectedCourse = useCourseStore.getState().updateSelectedCourse;

  const [isCourseExisted, setIsCourseExisted] = useState<boolean>(false);

  const checkIfCourseExists = useCallback(async (name: string) => {
    try {
      const res = await pRetry(() => getCourseByName(name), {
        retries: 5,
      });
      setIsCourseExisted(!!res);
      return res;
    } catch (err) {
      console.error('checkIfCourseExists error:', err);
    }
  }, []);

  const fetchCourseAndUpdateStore = useCallback(async () => {
    try {
      if (pathname.includes('courses')) {
        const pathArray = decodeURI(pathname).split('/').filter(Boolean);
        const susName = pathArray[pathArray.indexOf('courses') + 1];
        console.log('fetchCourseAndUpdateStore', susName, coursesList);
        if (coursesList && coursesList.length > 0) {
          const selectedCourse = coursesList.find(
            (course) =>
              course.name.toLocaleLowerCase() === susName.toLocaleLowerCase()
          );
          // console.log('fetchCourseAndUpdateStore selectedCourse', selectedCourse);
          updateSelectedCourse(selectedCourse || null);
        } else {
          const course = await checkIfCourseExists(susName);
          course && updateSelectedCourse(course);
        }
      }
    } catch (err) {
      console.error('fetchCourseAndUpdateStore error:', err);
    }
  }, [pathname, coursesList, updateSelectedCourse, checkIfCourseExists]);

  useEffect(() => {
    fetchCourseAndUpdateStore();
  }, [pathname, isCourseExisted, fetchCourseAndUpdateStore]);

  useEffect(() => {
    if (!!coursesList && !!selectedCourse && !!selectedCourse.name) {
      const course = coursesList.filter((course) =>
        !!selectedCourse.name
          ? course.name?.toLocaleLowerCase() ===
          selectedCourse.name.toLocaleLowerCase()
          : course
      )[0];

      if (course && course._id) {
        updateSelectedCourse(course);
      }
    }
  }, [selectedCourse, coursesList, updateSelectedCourse]);

  const fetchCoursesList = useCallback(async () => {
    try {
      if (coursesList && coursesList.length === 0) {
        try {
          console.log('fetching courses list', coursesList);
          const fetchedCoursesList = await pRetry(getCourses, {
            retries: 5,
          });

          fetchedCoursesList && updateCoursesList(fetchedCoursesList);
        } catch (error) {
          console.error('Error fetching courses:', error);
        }
      }
    } catch (err) {
      console.error('fetchCoursesList error:', err);
    }
  }, [coursesList, updateCoursesList]);

  useEffect(() => {
    if (coursesList !== null && coursesList && coursesList.length === 0) {
      fetchCoursesList();
    }
  }, [coursesList, fetchCoursesList]);

  const sidebarItems: SidebarItem[] = [
    // {
    //   name: 'Dashboard',
    //   popup: PopupsTypes,
    //   icon: faHome,
    //   href: '/classroom/',
    // },
    {
      name: 'Courses',
      popup: PopupsTypes,
      icon: faChalkboardUser,
      href: '/courses/',
    },
    {
      name: 'Users',
      popup: PopupsTypes,
      icon: faUsersRectangle,
      href: '/users/',
    },
    {
      name: 'Recordings',
      popup: PopupsTypes.CLOSED,
      icon: faMicrophone,
      href: '/recordings/',
    },
    {
      name: 'Reports',
      popup: PopupsTypes.CLOSED,
      icon: faChartBar,
      href: '/reports/',
    },
    {
      name: 'Files',
      popup: PopupsTypes.CLOSED,
      icon: faDatabase,
      href: '/classroom/files',
    },
    {
      name: 'create',
      icon: faSquarePlus,
      subItems: [
        {
          name: 'New User',
          popup: PopupsTypes.NEW_USER,
        },
        {
          name: 'New Course',
          popup: PopupsTypes.NEW_COURSE,
        },
        {
          name: 'New Exercise',
          subItems: [
            {
              name: 'Create FSA',
              popup: PopupsTypes.CLOSED,
              href: `/classroom/new-exercise/${ExercisesTypes.FSA}`,
            },
            {
              name: 'Create SpotRecc',
              popup: PopupsTypes.CLOSED,
              href: `/classroom/new-exercise/${ExercisesTypes.SPOTRECC}`,
            },
          ],
        },
      ],
    },
  ];

  return (
    <section className='flex h-screen w-full select-none flex-col justify-center border-r-2 border-duoGray-light bg-duoGray-lighter font-extrabold tracking-wide text-duoGray-darker dark:border-duoGrayDark-light dark:bg-duoBlueDark-darkest dark:text-duoGrayDark-lightest'>
      <label className='mb-2 mt-2 flex items-center justify-center pb-2 pl-6 pr-6 pt-6 text-xl font-[850] text-duoBlue-default md:text-[1.5rem] lg:text-[2rem]'>
        duolingo
      </label>
      {/* <CourseList coursesList={coursesList} pathname={pathname} /> */}

      <div className="flex flex-col flex-1">
        <ItemsList itemsList={sidebarItems} />
          <button
            onClick={() => window.location.href = '/settings'}
            className="flex items-center gap-2 px-6 py-4 text-left text-duoBlue-default hover:bg-duoBlue-lightest dark:text-duoBlueDark-text dark:hover:bg-duoBlueDark-dark transition-colors"
          >
            <FontAwesomeIcon icon={faCog} className="w-6" />
            <span>Settings</span>
          </button>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-6 py-4 text-left text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors"
        >
          <FontAwesomeIcon icon={faRightToBracket} className="w-6" />
          <span>Log out</span>
        </button>
      </div>
    </section>
  );
};

export default AdminSideBar;
