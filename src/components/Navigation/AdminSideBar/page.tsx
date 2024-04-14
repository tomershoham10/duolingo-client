'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { IconDefinition, library } from '@fortawesome/fontawesome-svg-core';
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
import useStore from '@/app/store/useStore';
import { useCourseStore } from '@/app/store/stores/useCourseStore';
import { usePopupStore } from '@/app/store/stores/usePopupStore';
import {
  getCourseByName,
  getCourses,
} from '@/app/API/classes-service/courses/functions';

import { PopupsTypes } from '@/app/store/stores/usePopupStore';
import handleLogout from '@/app/utils/functions/handleLogOut';

library.add(
  faHome,
  faUser,
  faCog,
  faRightToBracket,
  faSquarePlus,
  faHeadphones
);

interface SidebarItem {
  name: string;
  popup?: PopupsTypes;
  icon?: IconDefinition;
  href?: string;
  onClick?: () => void;
  subItems?: SidebarItem[];
}

const AdminSideBar: React.FC = () => {
  const pathname = usePathname();

  const sidebarItemRef = useRef<HTMLLIElement | null>(null);

  const courseName = useStore(useCourseStore, (state) => state.name);
  const coursesList = useStore(useCourseStore, (state) => state.coursesList);
  const useCourseStoreObj = useMemo(() => {
    return {
      updateCoursesList: useCourseStore.getState().updateCoursesList,
      updateCourseName: useCourseStore.getState().updateCourseName,
      updateCourseId: useCourseStore.getState().updateCourseId,
    };
  }, []);

  const usePopupStoreObj = {
    selectedPopup: useStore(usePopupStore, (state) => state.selectedPopup),
    updateSelectedPopup: usePopupStore.getState().updateSelectedPopup,
  };

  const [isCourseExisted, setIsCourseExisted] = useState<boolean>(false);

  const [hoveredElement, setHoveredElement] = useState<string | null>(null);
  useEffect(() => {
    const checkIfCourseExists = async (name: string) => {
      const res = await getCourseByName(name);
      //   console.log('checkIfCourseExists', !!res);
      setIsCourseExisted(!!res);
    };

    if (pathname.includes('courses')) {
      const pathArray = pathname.split('/').filter(Boolean);
      const susName = pathArray[pathArray.indexOf('courses') + 1];
      checkIfCourseExists(susName);

      if (isCourseExisted) {
        useCourseStoreObj.updateCourseName(susName);
      } else {
        useCourseStoreObj.updateCourseName(undefined);
      }
    }

    // if (coursesList && courseName) {
    //   for (let i: number = 0; i < Object.values(coursesList).length; i++) {
    //     if (
    //       courseName.toLocaleLowerCase() ===
    //       coursesList[i].name?.toLocaleLowerCase()
    //     ) {
    //       // console.log("nav bar course type", coursesList[i].courseId);
    //       updateCourseId(coursesList[i]._id);
    //     }
    //   }
    // }

    // for (let i: number = 0; i < navItems.length; i++) {
    //   pathname.includes(navItems[i].label.toLocaleLowerCase())
    //     ? setSelected(navItems[i].label)
    //     : '';
    // }
  }, [pathname, isCourseExisted, useCourseStoreObj]);

  useEffect(() => {
    if (!!coursesList && !!courseName) {
      const course = coursesList.filter((course) =>
        !!courseName
          ? course.name?.toLocaleLowerCase() === courseName.toLocaleLowerCase()
          : course
      )[0];

      if (course && course._id) {
        useCourseStoreObj.updateCourseId(course._id);
      }
    }
  }, [useCourseStoreObj, courseName, coursesList]);

  useEffect(() => {
    const fetchData = async () => {
      if (coursesList && coursesList.length > 0 && !!!coursesList[0]._id) {
        try {
          const coursesList = await getCourses();
          coursesList ? useCourseStoreObj.updateCoursesList(coursesList) : null;
        } catch (error) {
          console.error('Error fetching courses:', error);
        }
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coursesList]);

  useEffect(() => {
    usePopupStoreObj.selectedPopup === PopupsTypes.CLOSED
      ? null
      : setHoveredElement(null);
  }, [usePopupStoreObj.selectedPopup]);

  const sidebarItems: SidebarItem[] = [
    {
      name: 'Dashboard',
      popup: PopupsTypes.CLOSED,
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
          popup: PopupsTypes.CLOSED,
          href: '/classroom/new-exercise',
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
        <ul className='w-full cursor-default text-center text-[0.75rem] uppercase md:text-[0.9rem] lg:text-lg border-'>
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
        {sidebarItems.map((sideBaritem, index) => (
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
            {hoveredElement === sideBaritem.name && sideBaritem.subItems ? (
              <ul className='absolute -top-[1rem] left-[90%] z-30 w-fit rounded-xl border-2 bg-duoGray-lighter py-3 dark:border-duoGrayDark-light dark:bg-duoBlueDark-darkest'>
                {sideBaritem.subItems.map((subItem, subItemIndex) => (
                  <li
                    className='duration-50 min-w-[10rem] py-2 pl-4 transition hover:bg-duoGray-light dark:hover:bg-duoBlueDark-default 2xl:py-3 2xl:pl-5 2xl:text-xl'
                    key={subItem.name}
                  >
                    <button
                      onClick={() =>
                        subItem.popup
                          ? usePopupStoreObj.updateSelectedPopup(subItem.popup)
                          : subItem.onClick
                            ? subItem.onClick()
                            : null
                      }
                    >
                      {subItem.href ? (
                        <Link href={subItem.href}>{subItem.name}</Link>
                      ) : (
                        <span>{subItem.name}</span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminSideBar;
