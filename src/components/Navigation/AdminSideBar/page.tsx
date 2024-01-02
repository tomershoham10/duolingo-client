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
  label?: PopupsTypes;
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
      if (userRole === TypesOfUser.ADMIN && updateCoursesList) {
        try {
          const coursesList = await getCourses();
          updateCoursesList(coursesList);
        } catch (error) {
          console.error('Error fetching courses:', error);
        }
      }
    };

    fetchData();
  }, [updateCoursesList, userRole]);

  useEffect(() => {
    selectedPopup === PopupsTypes.CLOSED ? null : setIsHovered(false);
  }, [selectedPopup]);

  const sidebarItems: SidebarItem[] = [
    {
      name: 'Dashboard',
      label: PopupsTypes.CLOSED,
      icon: faHome,
      href: '/classroom/',
    },
    {
      name: 'create',
      icon: faSquarePlus,
      subItems: [
        {
          name: 'New User',
          label: PopupsTypes.NEWUSER,
        },
        {
          name: 'New Exercise',
          label: PopupsTypes.CLOSED,
          href: '/classroom/new-exercise',
        },
      ],
    },
    { name: 'Settings', label: PopupsTypes.CLOSED, icon: faCog },
  ];

  return (
    <>
      {userRole === TypesOfUser.ADMIN && isLoggedIn ? (
        <div className='dark:border-duoGrayDark-light dark:bg-duoBlueDark-darkest dark:text-duoGrayDark-lightest flex h-screen min-w-[12.5rem] flex-col justify-center border-r-2 border-duoGray-light bg-duoGray-lighter font-extrabold tracking-wide text-duoGray-darker lg:min-w-[13rem]'>
          <label className='mb-2 mt-2 pb-2 pl-6 pr-6 pt-6 text-center text-[2rem] font-[850] text-duoBlue-default'>
            doulingo
          </label>

          <div className='dark:border-duoGrayDark-light flex items-center justify-center border-b-2'>
            <ul className='w-full uppercase'>
              {coursesList ? (
                coursesList.length > 0 ? (
                  // coursesList.map((item,index)=><></>)
                  coursesList.map((item, index) => (
                    <li
                      key={index}
                      className={
                        item.courseName
                          ? pathname.includes(
                              item.courseName.toLocaleLowerCase()
                            )
                            ? 'dark:text-duoBlueDark-texst w-full cursor-pointer bg-duoBlue-lightest pb-3 pl-3 pr-3 pt-3 text-center text-lg text-duoBlue-light dark:bg-sky-800'
                            : 'dark:text-duoGrayDark-lightest w-full cursor-pointer pb-3 pl-3 pr-3 pt-3 text-center text-lg text-duoGray-darkest hover:bg-duoBlue-lightest hover:text-duoBlue-light dark:hover:bg-sky-800 dark:hover:text-duoBlue-light'
                          : 'dark:text-duoGrayDark-lightest w-full cursor-pointer pb-3 pl-3 pr-3 pt-3 text-center text-lg text-duoGray-darkest hover:bg-duoBlue-lightest hover:text-duoBlue-light dark:hover:bg-sky-800 dark:hover:text-duoBlue-light'
                      }
                    >
                      <Link
                        href={`${
                          item.courseName
                            ? `/classroom/courses/${item.courseName.toLocaleLowerCase()}/students`
                            : ''
                        }`}
                      >
                        {item.courseName}
                      </Link>
                    </li>
                  ))
                ) : (
                  <span className='dark:text-duoGrayDark-lightest flex w-full cursor-default items-center justify-center pb-3 pl-3 pr-3 pt-3 text-center text-lg text-duoGray-darkest opacity-70'>
                    NO COURSES
                  </span>
                )
              ) : null}
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
                    : 'dark:hover:bg-duoBlueDark-dark cursor-pointer pb-3 pl-3 pr-3 pt-3 hover:bg-duoGray-hover'
                }`}
              >
                <button
                  className='flex cursor-pointer flex-row items-center justify-center pr-2'
                  onClick={() =>
                    sideBaritem.subItems
                      ? null
                      : sideBaritem.label
                        ? updateSelectedPopup(sideBaritem.label)
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
                  <ul className='dark:bg-duoBlueDark-darkest dark:border-duoGrayDark-light absolute -top-[1rem] left-[12rem] z-30 w-fit rounded-xl border-2 py-3'>
                    {sideBaritem.subItems.map((subItem, subItemIndex) => (
                      <li
                        className='dark:hover:bg-duoBlueDark-default duration-50 min-w-[10rem] py-2 pl-4 transition'
                        key={subItemIndex}
                      >
                        <button
                          onClick={() =>
                            subItem.label
                              ? updateSelectedPopup(subItem.label)
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
