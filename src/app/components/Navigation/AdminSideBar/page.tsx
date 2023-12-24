'use client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { library } from '@fortawesome/fontawesome-svg-core';
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
import { getCourses } from '@/app/API/classes-service/courses/functions';

library.add(faHome, faUser, faCog, faRightToBracket, faSquarePlus);

const AdminSideBar: React.FC = () => {
  const pathname = usePathname();

  const userRole = useStore(useUserStore, (state) => state.userRole);
  const isLoggedIn = useStore(useUserStore, (state) => state.isLoggedIn);

  const coursesList = useStore(useCourseStore, (state) => state.coursesList);

  const updateCoursesList = useCourseStore.getState().updateCoursesList;

  const updateSelectedPopup = usePopupStore.getState().updateSelectedPopup;

  const [selected, setSelected] = useState<number>();

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

  const sidebarItems: {
    name: string;
    label: PopupsTypes;
    icon: any;
    href?: string;
  }[] = [
    {
      name: 'Dashboard',
      label: PopupsTypes.CLOSED,
      icon: faHome,
      href: '/Dashboard',
    },
    {
      name: 'New User',
      label: PopupsTypes.NEWUSER,
      icon: faSquarePlus,
    },
    {
      name: 'New Exercise',
      label: PopupsTypes.CLOSED,
      icon: faSquarePlus,
      href: `/classroom/new-exercise`,
    },
    { name: 'Settings', label: PopupsTypes.CLOSED, icon: faCog },
  ];

  return (
    <>
      {userRole === TypesOfUser.ADMIN && isLoggedIn ? (
        <div
          className='flex h-screen 
                    min-w-[12.5rem] flex-col justify-center border-r-2 border-duoGray-light bg-duoGray-lighter font-extrabold 
                tracking-wide text-duoGray-darker lg:min-w-[13rem]'
        >
          <label className='mb-2 mt-2 pb-2 pl-6 pr-6 pt-6 text-center text-[2rem] font-[850] text-duoBlue-default'>
            doulingo
          </label>

          <div className='flex items-center justify-center border-b-2'>
            <ul className='w-full uppercase'>
              {coursesList ? (
                coursesList.length > 0 ? (
                  coursesList.map((item: any, index: any) => (
                    <li
                      key={index}
                      className={
                        pathname.includes(item.courseType.toLocaleLowerCase())
                          ? 'w-full cursor-pointer bg-duoBlue-lightest pb-3 pl-3 pr-3 pt-3 text-center text-lg text-duoBlue-light'
                          : 'w-full cursor-pointer pb-3 pl-3 pr-3 pt-3 text-center text-lg text-duoGray-darkest hover:bg-duoBlue-lightest hover:text-duoBlue-light'
                      }
                    >
                      <Link
                        href={`/classroom/courses/${item.courseType.toLocaleLowerCase()}/students`}
                      >
                        {item.courseType}
                      </Link>
                    </li>
                  ))
                ) : (
                  <p>problem</p>
                )
              ) : null}
            </ul>
          </div>

          <ul className='flex-grow'>
            {sidebarItems.map((item, index) => (
              <li
                key={index}
                className={`${
                  selected === index
                    ? 'cursor-pointer bg-duoBlue-lightest pb-3 pl-3 pr-3 pt-3 text-duoBlue-light'
                    : 'cursor-pointer pb-3 pl-3 pr-3 pt-3 hover:bg-duoGray-hover'
                }`}
              >
                <button
                  className='flex cursor-pointer flex-row items-center justify-center pr-2'
                  onClick={() => updateSelectedPopup(item.label)}
                >
                  <FontAwesomeIcon
                    className='fa-xs fa-solid ml-2 mr-4 h-6 w-6'
                    icon={item.icon}
                  />
                  {item.href ? (
                    <Link
                      className='flex h-full cursor-pointer'
                      href={item.href}
                    >
                      {item.name}
                    </Link>
                  ) : (
                    <span>{item.name}</span>
                  )}
                </button>
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
