'use client';
import { useEffect, useState } from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import useStore from '@/app/store/useStore';
import { useCourseStore } from '@/app/store/stores/useCourseStore';

enum coursePages {
  STUDENTS = 'students',
  ASSIGNMENTS = 'assignments',
  SYLLABUS = 'syllabus',
  SETTINGS = 'settings',
}

const NavBar: React.FC = () => {
  const [selected, setSelected] = useState<coursePages>();

  const selectedCourse = useStore(useCourseStore, (state) => state.selectedCourse);

  const pathname = usePathname();

  useEffect(() => {
    pathname.includes(coursePages.STUDENTS)
      ? setSelected(coursePages.STUDENTS)
      : null;
    pathname.includes(coursePages.ASSIGNMENTS)
      ? setSelected(coursePages.ASSIGNMENTS)
      : null;
    pathname.includes(coursePages.SYLLABUS)
      ? setSelected(coursePages.SYLLABUS)
      : null;
    pathname.includes(coursePages.SETTINGS)
      ? setSelected(coursePages.SETTINGS)
      : null;
  }, [pathname]);

  const navItems: navItems[] =
    !!selectedCourse && !!selectedCourse.name
      ? [
          {
            label: coursePages.STUDENTS,
            href: `/classroom/courses/${selectedCourse.name}/${coursePages.STUDENTS}`,
          },
          {
            label: coursePages.ASSIGNMENTS,
            href: `/classroom/courses/${selectedCourse.name}/${coursePages.ASSIGNMENTS}`,
          },
          {
            label: coursePages.SYLLABUS,
            href: `/classroom/courses/${selectedCourse.name}/${coursePages.SYLLABUS}`,
          },
          {
            label: coursePages.SETTINGS,
            href: `/classroom/courses/${selectedCourse.name}/${coursePages.SETTINGS}`,
          },
        ]
      : [
          {
            label: coursePages.STUDENTS,
            href: '/',
          },
          {
            label: coursePages.ASSIGNMENTS,
            href: '/',
          },
          {
            label: coursePages.SYLLABUS,
            href: '/',
          },
          {
            label: coursePages.SETTINGS,
            href: '/',
          },
        ];

  return (
    <>
      <div className='block w-full border-b-2 pt-4 dark:border-duoGrayDark-light'>
       
        <p className='pb-1 pl-6 pt-2 text-2xl font-extrabold capitalize text-duoGray-darkest dark:text-duoGrayDark-lightest lg:text-3xl 3xl:text-4xl'>
          {!!selectedCourse && selectedCourse.name ? selectedCourse.name : null}
        </p>
        <p className='pb-4 pl-6 text-sm font-medium text-duoGray-light/75 dark:text-duoGrayDark-light lg:text-base'>
          {!!selectedCourse && selectedCourse.description ? selectedCourse.description : null}
        </p>
        <ul
          className='bt-2 relative flex w-max justify-center space-x-5 pb-2 pl-3 pr-3 text-center text-sm 
            font-extrabold tracking-tight text-duoGray-dark dark:text-duoGrayDark-lighter'
        >
          {navItems.map(
            (item: { label: coursePages; href: string }, index: number) => (
              <li
                key={index}
                className='relative mb-[-1px] block cursor-pointer pl-2 pr-2 3xl:text-lg'
              >
                <span
                  className={
                    selected === item.label
                      ? 'border-b-2 border-duoBlue-light pb-2 text-duoBlue-light dark:border-duoBlueDark-text dark:text-duoBlueDark-text'
                      : 'border-b-2 border-transparent pb-2 hover:border-duoBlue-light hover:text-duoBlue-light dark:hover:border-duoBlueDark-text dark:hover:text-duoBlueDark-text'
                  }
                >
                  <Link href={item.href}>{item.label}</Link>
                </span>
              </li>
            )
          )}
        </ul>
      </div>
    </>
  );
};

export default NavBar;
