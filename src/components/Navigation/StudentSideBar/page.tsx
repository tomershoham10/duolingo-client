'use client';
import { useEffect, useState } from 'react';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faUser,
  faCog,
  faRightToBracket,
  faFolderPlus,
} from '@fortawesome/free-solid-svg-icons';

import Link from 'next/link';
import useStore from '@/app/store/useStore';
import { useUserStore } from '@/app/store/stores/useUserStore';
// import {
//   CoursesType,
//   getCourses,
// } from '@/app/API/classes-service/courses/functions';
// import { useCourseStore } from '@/app/store/stores/useCourseStore';

library.add(faHome, faUser, faCog, faRightToBracket, faFolderPlus);

const StudentSideBar: React.FC = () => {
  const userRole = useStore(useUserStore, (state) => state.userRole);
  const isLoggedIn = useStore(useUserStore, (state) => state.isLoggedIn);

  //   const courseListStore = useStore(
  //     useCourseStore,
  //     (state) => state.coursesList
  //   );
  //   const updateCoursesList = useCourseStore.getState().updateCoursesList;

  const [selected, setSelected] = useState<number>();
  //   const [coursesList, setCoursesList] = useState<CoursesType[] | null>(null);

  //   useEffect(() => {
  //     const fetchData = async () => {
  //       const response = await getCourses();
  //       setCoursesList(response);
  //       response ? updateCoursesList(response) : null;
  //     };
  //     if (userRole === 'admin' && !!courseListStore) {
  //       fetchData();
  //     }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  //   }, [courseListStore, userRole]);

  const sidebarItems: {
    [key: string]: { label: string; icon: any; href?: string }[];
  } = {
    admin: [
      { label: 'DASHBOARD', icon: faHome, href: '/Dashboard' },

      {
        label: 'NEW COURSE',
        icon: faFolderPlus,
        href: '/classroom/create/new-course',
      },
      { label: 'SETTINGS', icon: faCog },
    ],
    student: [
      { label: 'DASHBOARD', icon: faHome },
      { label: 'USERS', icon: faUser },
    ],
    teacher: [{ label: 'DASHBOARD', icon: faHome }],
  };

  const items = userRole ? sidebarItems[userRole] : [];

  return (
    <div className='flex h-screen flex-col justify-center border-r-2 border-zinc-500/25 text-sm font-extrabold tracking-wide text-gray-500'>
      <label className='mb-2 mt-2 pb-2 pl-6 pr-6 pt-6 text-[2rem] font-[850] text-duoGreen-default'>
        duolingo
      </label>

      <ul className='flex-grow'>
        {items
          ? items.map((item, index) => (
              <li
                key={index}
                className={`${
                  selected === index
                    ? 'mb-2 mt-2 cursor-pointer rounded-xl border-2 border-duoBlue-lighter bg-duoBlue-lightest pb-2 pl-3 pr-3 pt-2 text-duoBlue-light'
                    : 'hover-bg-zinc-100 mb-2 mt-2 cursor-pointer rounded-xl border-2 border-transparent pb-2 pl-3 pr-3 pt-2'
                }`}
              >
                <button
                  className='flex cursor-pointer flex-row items-center justify-center pr-2'
                  onClick={() => setSelected(index)}
                >
                  <FontAwesomeIcon
                    className='fa-xs fa-solid ml-2 mr-4 h-6 w-6'
                    icon={item.icon}
                  />

                  <Link
                    className='flex h-full cursor-pointer'
                    href={item.href ? item.href : ''}
                  >
                    {item.label}
                  </Link>
                </button>
              </li>
            ))
          : null}
      </ul>
    </div>
  );
};

export default StudentSideBar;
