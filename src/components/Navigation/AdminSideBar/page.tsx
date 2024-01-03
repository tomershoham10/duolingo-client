'use client';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { IconDefinition, library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faUser,
  faCog,
  faRightToBracket,
  faSquarePlus,
} from '@fortawesome/free-solid-svg-icons';

import Link from 'next/link';
import useStore from '@/app/store/useStore';
import { useUserStore, TypesOfUser } from '@/app/store/stores/useUserStore';
import { useCourseStore } from '@/app/store/stores/useCourseStore';
import { PopupsTypes, usePopupStore } from '@/app/store/stores/usePopupStore';
import {
  CoursesType,
  getCourses,
} from '@/app/API/classes-service/courses/functions';

library.add(faHome, faUser, faCog, faRightToBracket, faSquarePlus);

interface SidebarItem {
  name: string;
  popup?: PopupsTypes;
  icon?: IconDefinition;
  href?: string;
  subItems?: SidebarItem[];
}

const AdminSideBar: React.FC = () => {
  const pathname = usePathname();

  const sidebarItemRef = useRef<HTMLLIElement | null>(null);

  const userRole = useStore(useUserStore, (state) => state.userRole);
  const isLoggedIn = useStore(useUserStore, (state) => state.isLoggedIn);
  const selectedPopup = useStore(usePopupStore, (state) => state.selectedPopup);

  const coursesList = useStore(useCourseStore, (state) => state.coursesList);

  const updateCoursesList = useCourseStore.getState().updateCoursesList;

  const updateSelectedPopup = usePopupStore.getState().updateSelectedPopup;

  const [selected, setSelected] = useState<number>();

  const [isHovered, setIsHovered] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      if (
        userRole === TypesOfUser.ADMIN &&
        coursesList &&
        !!!coursesList[0]._id
      ) {
        try {
          const coursesList = await getCourses();
          coursesList ? updateCoursesList(coursesList) : null;
        } catch (error) {
          console.error('Error fetching courses:', error);
        }
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coursesList, userRole]);

  useEffect(() => {
    selectedPopup === PopupsTypes.CLOSED ? null : setIsHovered(false);
  }, [selectedPopup]);

  const sidebarItems: SidebarItem[] = [
    {
      name: 'Dashboard',
      popup: PopupsTypes.CLOSED,
      icon: faHome,
      href: '/classroom/',
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
    { name: 'Settings', popup: PopupsTypes.CLOSED, icon: faCog },
  ];

  return (
    <>
      {userRole === TypesOfUser.ADMIN && isLoggedIn ? (
        <div className='flex h-screen min-w-[12.5rem] flex-col justify-center border-r-2 border-duoGray-light bg-duoGray-lighter font-extrabold tracking-wide text-duoGray-darker dark:border-duoGrayDark-light dark:bg-duoBlueDark-darkest dark:text-duoGrayDark-lightest lg:min-w-[13rem]'>
          <label className='mb-2 mt-2 pb-2 pl-6 pr-6 pt-6 text-center text-[2rem] font-[850] text-duoBlue-default'>
            doulingo
          </label>

          <div className='flex items-center justify-center border-b-2 dark:border-duoGrayDark-light'>
            <ul className='w-full uppercase'>
              {coursesList ? (
                coursesList.length > 0 && !!coursesList[0]._id ? (
                  // coursesList.map((item,index)=><></>)
                  coursesList.map((item, index) => (
                    <li
                      key={index}
                      className={
                        item.name
                          ? pathname.includes(item.name.toLocaleLowerCase())
                            ? 'dark:text-duoBlueDark-texst w-full cursor-pointer bg-duoBlue-lightest pb-3 pl-3 pr-3 pt-3 text-center text-lg text-duoBlue-light dark:bg-sky-800'
                            : 'w-full cursor-pointer pb-3 pl-3 pr-3 pt-3 text-center text-lg text-duoGray-darkest hover:bg-duoBlue-lightest hover:text-duoBlue-light dark:text-duoGrayDark-lightest dark:hover:bg-sky-800 dark:hover:text-duoBlue-light'
                          : 'w-full cursor-pointer pb-3 pl-3 pr-3 pt-3 text-center text-lg text-duoGray-darkest hover:bg-duoBlue-lightest hover:text-duoBlue-light dark:text-duoGrayDark-lightest dark:hover:bg-sky-800 dark:hover:text-duoBlue-light'
                      }
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
                  <span className='flex w-full cursor-default items-center justify-center pb-3 pl-3 pr-3 pt-3 text-center text-lg text-duoGray-darkest opacity-70 dark:text-duoGrayDark-lightest'>
                    NO COURSES
                  </span>
                )
              ) : (
                <span className='flex w-full cursor-default items-center justify-center pb-3 pl-3 pr-3 pt-3 text-center text-lg text-duoGray-darkest opacity-70 dark:text-duoGrayDark-lightest'>
                  NO COURSES
                </span>
              )}
            </ul>
          </div>

          <ul className='flex-grow'>
            {sidebarItems.map((sideBaritem, index) => (
              <li
                key={index}
                onMouseEnter={() =>
                  sideBaritem.subItems ? setIsHovered(true) : null
                }
                onMouseLeave={() => setIsHovered(false)}
                ref={sidebarItemRef}
                className={`duration-50 relative transition ${
                  selected === index
                    ? 'cursor-pointer bg-duoBlue-lightest pb-3 pl-3 pr-3 pt-3 text-duoBlue-light'
                    : 'cursor-pointer pb-3 pl-3 pr-3 pt-3 hover:bg-duoGray-hover dark:hover:bg-duoBlueDark-dark'
                }`}
              >
                <button
                  className='flex cursor-pointer flex-row items-center justify-center pr-2'
                  onClick={() =>
                    sideBaritem.subItems
                      ? null
                      : sideBaritem.popup
                        ? updateSelectedPopup(sideBaritem.popup)
                        : null
                  }
                >
                  {sideBaritem.icon ? (
                    <FontAwesomeIcon
                      className='fa-xs fa-solid ml-2 mr-4 h-6 w-6'
                      icon={sideBaritem.icon}
                    />
                  ) : null}
                  {sideBaritem.href ? (
                    <Link
                      className='flex h-full cursor-pointer'
                      href={sideBaritem.href}
                    >
                      {sideBaritem.name}
                    </Link>
                  ) : (
                    <span>{sideBaritem.name}</span>
                  )}
                </button>
                {isHovered && sideBaritem.subItems ? (
                  <ul className='absolute -top-[1rem] left-[12rem] z-30 w-fit rounded-xl border-2 py-3 dark:border-duoGrayDark-light dark:bg-duoBlueDark-darkest'>
                    {sideBaritem.subItems.map((subItem, subItemIndex) => (
                      <li
                        className='duration-50 min-w-[10rem] py-2 pl-4 transition dark:hover:bg-duoBlueDark-default'
                        key={subItemIndex}
                      >
                        <button
                          onClick={() =>
                            subItem.popup
                              ? updateSelectedPopup(subItem.popup)
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
      ) : (
        <></>
      )}
    </>
  );
};

export default AdminSideBar;
