'use client';
import { useEffect, useState } from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import useStore from '@/app/store/useStore';
import {
  TypesOfCourses,
  useCourseStore,
} from '@/app/store/stores/useCourseStore';

const NavBar: React.FC = () => {
  const [selected, setSelected] = useState<string>();

  const courseType = useStore(useCourseStore, (state) => state.courseType);
  const coursesList = useStore(useCourseStore, (state) => state.coursesList);

  const updateCourseType = useCourseStore.getState().updateCourseType;
  const updateCourseId = useCourseStore.getState().updateCourseId;

  const pathname = usePathname();

  useEffect(() => {
    if (pathname.includes('searider')) {
      updateCourseType(TypesOfCourses.SEARIDER);
    } else if (pathname.includes('senior')) {
      updateCourseType(TypesOfCourses.SENIOR);
    }

    if (coursesList && courseType) {
      for (let i: number = 0; i < Object.values(coursesList).length; i++) {
        if (
          courseType.toLocaleLowerCase() ===
          coursesList[i].courseType?.toLocaleLowerCase()
        ) {
          // console.log("nav bar course type", coursesList[i].courseId);
          updateCourseId(coursesList[i].courseId);
        }
      }
    }

    for (let i: number = 0; i < navItems.length; i++) {
      pathname.includes(navItems[i].label.toLocaleLowerCase())
        ? setSelected(navItems[i].label)
        : '';
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, coursesList]);

  const navItems: {
    label: string;
    href: string;
  }[] = [
    {
      label: 'STUDENTS',
      href: `/classroom/courses/${courseType}/students`,
    },
    {
      label: 'ASSIGNMENTS',
      href: `/classroom/courses/${courseType}/assignments`,
    },
    {
      label: 'SYLLABUS',
      href: `/classroom/courses/${courseType}/syllabus`,
    },
    {
      label: 'SETTINGS',
      href: `/classroom/courses/${courseType}/settings`,
    },
  ];

  return (
    <>
      {courseType ? (
        <div className='dark:border-duoGrayDark-light block w-full border-b-2 pt-4'>
          <p className='dark:text-duoGrayDark-lightest pb-4 pl-5 pt-2 text-3xl font-extrabold uppercase text-duoGray-darkest'>
            {courseType} course
          </p>
          <ul
            className='bt-2 dark:text-duoGrayDark-lighter relative flex w-max justify-center space-x-5 pb-2 pl-3 pr-3 text-center 
            text-sm font-extrabold tracking-tight text-duoGray-dark'
          >
            {navItems.map(
              (item: { label: string; href: string }, index: number) => (
                <li
                  key={index}
                  className='relative mb-[-1px] block cursor-pointer pl-2 pr-2'
                >
                  <span
                    className={
                      selected === item.label
                        ? 'dark:text-duoBlueDark-text dark:border-duoBlueDark-text border-b-2 border-duoBlue-light pb-2 text-duoBlue-light'
                        : 'dark:hover:text-duoBlueDark-text dark:hover:border-duoBlueDark-text border-b-2 border-transparent pb-2 hover:border-duoBlue-light hover:text-duoBlue-light'
                    }
                  >
                    <Link href={item.href}>{item.label}</Link>
                  </span>
                </li>
              )
            )}
          </ul>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default NavBar;
