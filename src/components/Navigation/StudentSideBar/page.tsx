'use client';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
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

library.add(faHome, faUser, faCog, faRightToBracket, faFolderPlus);

const StudentSideBar: React.FC = () => {
  const pathname = usePathname();

  const [selected, setSelected] = useState<number>();

  const sidebarItems: { label: string; icon: any; href: string }[] = [
    { label: 'LEARN', icon: faHome, href: '/learn' },
    { label: 'USERS', icon: faUser, href: '/users' },
  ];

  return (
    <div className='flex h-screen flex-col justify-start border-r-2 border-zinc-500/25 text-sm font-extrabold tracking-wide text-gray-500 dark:text-duoGrayDark-lightest'>
      <label className='mb-2 mt-2 pb-2 pl-6 pr-6 pt-6 text-[2rem] font-[850] text-duoGreen-default'>
        duolingo
      </label>

      <ul className='mx-auto w-[90%]'>
        {sidebarItems.map((item, index) => (
          <li
            key={item.label}
            className={` my-3 cursor-pointer rounded-xl border-2  px-3 py-3 ${
              pathname.includes(item.href)
                ? 'border-duoBlue-lighter bg-duoBlue-lightest text-duoBlue-light dark:border-duoBlueDark-text dark:bg-duoGrayDark-dark dark:text-duoBlueDark-text'
                : 'hover-bg-zinc-100 border-transparent dark:hover:bg-duoGrayDark-dark'
            }`}
          >
            <button
              className='flex cursor-pointer flex-row items-center justify-center pr-2'
              onClick={() => setSelected(index)}
            >
              <FontAwesomeIcon
                className={`fa-xs fa-solid ml-2 mr-4 h-6 w-6 ${
                  pathname.includes(item.href)
                    ? ''
                    : 'dark:text-duoGrayDark-midDark'
                }`}
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
        ))}
      </ul>
    </div>
  );
};

export default StudentSideBar;
