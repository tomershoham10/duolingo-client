'use client';
import { useEffect, useState } from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import useStore from '@/app/store/useStore';
import { useCourseStore } from '@/app/store/stores/useCourseStore';
import { getCourseByName } from '@/app/API/classes-service/courses/functions';

const NavBar: React.FC = () => {
  const [selected, setSelected] = useState<string>();

  const courseId = useStore(useCourseStore, (state) => state._id);
  const courseName = useStore(useCourseStore, (state) => state.name);
  const coursesList = useStore(useCourseStore, (state) => state.coursesList);

  const updateCourseId = useCourseStore.getState().updateCourseId;
  const updateCourseName = useCourseStore.getState().updateCourseName;

  const pathname = usePathname();

  const [isCourseExisted, setIsCourseExisted] = useState<boolean>(false);

  useEffect(() => {
    const checkIfCourseExists = async (name: string) => {
      const res = await getCourseByName(name);
      setIsCourseExisted(!!res);
    };

    if (pathname.includes('courses')) {
      const pathArray = pathname.split('/').filter(Boolean);
      console.log('pathArray', pathArray);
      const susName = pathArray[pathArray.indexOf('courses') + 1];
      checkIfCourseExists(susName);
      if (isCourseExisted) {
        updateCourseName(susName);
        setSelected(courseName);
      } else {
        updateCourseName(undefined);
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
  }, [pathname]);

  useEffect(() => {
    console.log('courseName', courseName);
  }, [courseName]);

  const navItems: {
    label: string;
    href: string;
  }[] = [
    {
      label: 'STUDENTS',
      href: `/classroom/courses/${courseName}/students`,
    },
    {
      label: 'ASSIGNMENTS',
      href: `/classroom/courses/${courseName}/assignments`,
    },
    {
      label: 'SYLLABUS',
      href: `/classroom/courses/${courseName}/syllabus`,
    },
    {
      label: 'SETTINGS',
      href: `/classroom/courses/${courseName}/settings`,
    },
  ];

  return (
    <>
      {courseName ? (
        <div className='block w-full border-b-2 pt-4 dark:border-duoGrayDark-light'>
          <p className='pb-4 pl-5 pt-2 text-3xl font-extrabold uppercase text-duoGray-darkest dark:text-duoGrayDark-lightest'>
            {courseName} course
          </p>
          <ul
            className='bt-2 relative flex w-max justify-center space-x-5 pb-2 pl-3 pr-3 text-center text-sm 
            font-extrabold tracking-tight text-duoGray-dark dark:text-duoGrayDark-lighter'
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
      ) : (
        <></>
      )}
    </>
  );
};

export default NavBar;
