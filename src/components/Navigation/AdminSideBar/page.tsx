'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faUser,
  faCog,
  faRightToBracket,
  faSquarePlus,
  faHeadphones,
} from '@fortawesome/free-solid-svg-icons';

import Link from 'next/link';
import pRetry from 'p-retry';
import Menu from '@/components/Menu/page';
import useStore from '@/app/store/useStore';
import { useCourseStore } from '@/app/store/stores/useCourseStore';
import { usePopupStore } from '@/app/store/stores/usePopupStore';
import {
  getCourseByName,
  getCourses,
} from '@/app/API/classes-service/courses/functions';

import handleLogout from '@/app/_utils/functions/handleLogOut';
import { PopupsTypes } from '@/app/store/stores/usePopupStore';
import { ExercisesTypes } from '@/app/API/classes-service/exercises/functions';

library.add(
  faHome,
  faUser,
  faCog,
  faRightToBracket,
  faSquarePlus,
  faHeadphones
);

const AdminSideBar: React.FC = () => {
  const pathname = usePathname();

  const sidebarItemRef = useRef<HTMLLIElement | null>(null);

  const selectedCourse = useStore(
    useCourseStore,
    (state) => state.selectedCourse
  );
  const coursesList = useStore(useCourseStore, (state) => state.coursesList);
  console.log('coursesList', coursesList);
  const useCourseStoreObj = useMemo(() => {
    return {
      updateCoursesList: useCourseStore.getState().updateCoursesList,
      updateSelectedCourse: useCourseStore.getState().updateSelectedCourse,
    };
  }, []);

  const usePopupStoreObj = {
    selectedPopup: useStore(usePopupStore, (state) => state.selectedPopup),
    updateSelectedPopup: usePopupStore.getState().updateSelectedPopup,
  };

  const [isCourseExisted, setIsCourseExisted] = useState<boolean>(false);

  const [hoveredElement, setHoveredElement] = useState<string | null>(null);

  const checkIfCourseExists = useCallback(async (name: string) => {
    const res = await pRetry(() => getCourseByName(name), {
      retries: 5,
    });
    setIsCourseExisted(!!res);
    return res;
  }, []);

  const fetchCourseAndUpdateStore = useCallback(async () => {
    if (pathname.includes('courses')) {
      const pathArray = pathname.split('/').filter(Boolean);
      const susName = pathArray[pathArray.indexOf('courses') + 1];
      const course = await checkIfCourseExists(susName); // Await the promise here
      useCourseStoreObj.updateSelectedCourse(course);
    }
  }, [pathname, checkIfCourseExists, useCourseStoreObj]);

  useEffect(() => {
    fetchCourseAndUpdateStore();
  }, [pathname, isCourseExisted, useCourseStoreObj, fetchCourseAndUpdateStore]);

  useEffect(() => {
    if (!!coursesList && !!selectedCourse && !!selectedCourse.name) {
      const course = coursesList.filter((course) =>
        !!selectedCourse.name
          ? course.name?.toLocaleLowerCase() ===
            selectedCourse.name.toLocaleLowerCase()
          : course
      )[0];

      if (course && course._id) {
        useCourseStoreObj.updateSelectedCourse(course);
      }
    }
  }, [useCourseStoreObj, selectedCourse, coursesList]);

  const fetchCoursesList = useCallback(async () => {
    if (coursesList !== undefined && coursesList.length === 0) {
      try {
        console.log('fetching courses list');
        //   const coursesList = await getCourses();
        const coursesList = await pRetry(getCourses, {
          retries: 5,
        });

        coursesList ? useCourseStoreObj.updateCoursesList(coursesList) : null;
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    }
  }, [coursesList, useCourseStoreObj]);

  useEffect(() => {
    fetchCoursesList();
  }, [coursesList, fetchCoursesList]);

  useEffect(() => {
    usePopupStoreObj.selectedPopup === PopupsTypes.CLOSED
      ? null
      : setHoveredElement(null);
  }, [usePopupStoreObj.selectedPopup]);

  const sidebarItems: SidebarItem[] = [
    {
      name: 'Dashboard',
      popup: PopupsTypes,
      icon: faHome,
      href: '/classroom/',
    },
    {
      name: 'Records',
      popup: PopupsTypes.CLOSED,
      icon: faHeadphones,
      href: '/classroom/records',
    },
    {
      name: 'create',
      icon: faSquarePlus,
      subItems: [
        {
          name: 'New User',
          popup: PopupsTypes.NEWUSER,
        },
        {
          name: 'New Course',
          popup: PopupsTypes.NEWCOURSE,
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
          //   popup: PopupsTypes.CLOSED,
          //   href: '/classroom/new-exercise',
        },
      ],
    },
    {
      name: 'Settings',
      icon: faCog,
      subItems: [{ name: 'Log out', onClick: () => handleLogout() }],
    },
  ];

  return (
    <div className='flex h-screen w-full flex-col justify-center border-r-2 border-duoGray-light bg-duoGray-lighter font-extrabold tracking-wide text-duoGray-darker dark:border-duoGrayDark-light dark:bg-duoBlueDark-darkest dark:text-duoGrayDark-lightest'>
      <label
        className='mb-2 mt-2 flex items-center justify-center pb-2 pl-6 pr-6 pt-6
           text-xl font-[850] text-duoBlue-default md:text-[1.5rem] lg:text-[2rem]'
      >
        duolingo
      </label>

      <div className='flex items-center justify-center border-b-2 dark:border-duoGrayDark-light'>
        <ul className='border- w-full cursor-default text-center text-[0.75rem] uppercase md:text-[0.9rem] lg:text-lg'>
          {coursesList ? (
            coursesList.length > 0 && !!coursesList[0]._id ? (
              // coursesList.map((item,index)=><></>)
              coursesList.map((item, index) => (
                <li
                  key={item._id}
                  className={`p-3
                       ${
                         item.name
                           ? pathname.includes(item.name.toLocaleLowerCase())
                             ? 'dark:text-duoBlueDark-texst bg-duoBlue-lightest  text-duoBlue-light dark:bg-sky-800'
                             : ' text-duoGray-darkest hover:bg-duoBlue-lightest hover:text-duoBlue-light dark:text-duoGrayDark-lightest dark:hover:bg-sky-800 dark:hover:text-duoBlue-light'
                           : ' text-duoGray-darkest hover:bg-duoBlue-lightest hover:text-duoBlue-light dark:text-duoGrayDark-lightest dark:hover:bg-sky-800 dark:hover:text-duoBlue-light'
                       }`}
                >
                  <Link
                    href={`${
                      item.name
                        ? `/classroom/courses/${item.name.toLocaleLowerCase()}/students`
                        : ''
                    }`}
                  >
                    {item.name}
                  </Link>
                </li>
              ))
            ) : (
              <span className='flex items-center justify-center p-3 text-duoGray-darkest opacity-70 dark:text-duoGrayDark-lightest'>
                NO COURSES
              </span>
            )
          ) : (
            <span className='flex items-center justify-center p-3 text-duoGray-darkest opacity-70 dark:text-duoGrayDark-lightest'>
              NO COURSES
            </span>
          )}
        </ul>
      </div>

      <ul className='flex-grow'>
        {sidebarItems.map((sideBaritem) => (
          <li
            key={sideBaritem.name}
            onMouseEnter={() =>
              sideBaritem.subItems ? setHoveredElement(sideBaritem.name) : null
            }
            onMouseLeave={() => setHoveredElement(null)}
            ref={sidebarItemRef}
            className={`duration-50 relative flex items-center justify-center transition md:justify-start ${
              //   selected === index
              //     ? 'cursor-pointer bg-duoBlue-lightest pb-3 pl-3 pr-3 pt-3 text-duoBlue-light'
              // :
              'cursor-pointer px-3 py-[0.85rem] hover:bg-duoGray-hover dark:hover:bg-duoBlueDark-dark 2xl:py-6'
            }`}
          >
            <button
              className='mx-4 flex cursor-pointer flex-row items-center justify-center overflow-hidden'
              onClick={() => {
                console.log('click');

                sideBaritem.subItems
                  ? null
                  : !!sideBaritem.popup
                    ? usePopupStoreObj.updateSelectedPopup(sideBaritem.popup)
                    : sideBaritem.onClick
                      ? sideBaritem.onClick
                      : null;
              }}
            >
              {sideBaritem.href ? (
                <Link
                  className='flex h-full cursor-pointer items-center justify-center overflow-hidden'
                  href={sideBaritem.href}
                >
                  {sideBaritem.icon ? (
                    <FontAwesomeIcon
                      className='fa-xs fa-solid h-7 w-7 2xl:h-8 2xl:w-8'
                      icon={sideBaritem.icon}
                    />
                  ) : null}
                  <p className='ml-4 hidden truncate text-lg md:block 2xl:text-xl'>
                    {sideBaritem.name}
                  </p>
                </Link>
              ) : (
                <span className='overflow-hidden'>
                  {sideBaritem.icon ? (
                    <span className='flex w-full flex-row items-center justify-center'>
                      <FontAwesomeIcon
                        className='fa-xs fa-solid h-7 w-7 2xl:h-8 2xl:w-8'
                        icon={sideBaritem.icon}
                      />
                      <p className='ml-4 hidden truncate text-lg md:block 2xl:text-xl'>
                        {sideBaritem.name}
                      </p>
                    </span>
                  ) : (
                    <p className='truncate'>{sideBaritem.name}</p>
                  )}
                </span>
              )}
            </button>

            {!!sideBaritem.subItems ? (
              <Menu
                isHovered={
                  hoveredElement === sideBaritem.name && !!sideBaritem.subItems
                }
                items={sideBaritem.subItems}
              />
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminSideBar;
