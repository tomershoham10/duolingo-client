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
import handleLogout from '@/app/_utils/functions/handleLogOut';
import ItemsList from '../AdminSideBar/ItemsList';

library.add(faHome, faUser, faCog, faRightToBracket, faFolderPlus);

const StudentSideBar: React.FC = () => {
  const pathname = usePathname();

  const [selected, setSelected] = useState<number>();

  const sidebarItems: SidebarItem[] = [
    { name: 'LEARN', icon: faHome, href: '/learn' },
    { name: 'USERS', icon: faUser, href: '/users' },
    {
      name: 'Settings',
      icon: faCog,
      subItems: [{ name: 'Log out', onClick: () => handleLogout() }],
    },
  ];



  return (
    <section className='flex h-screen w-full select-none flex-col justify-center border-r-2 border-duoGray-light bg-duoGray-lighter font-extrabold tracking-wide text-duoGray-darker dark:border-duoGrayDark-light dark:bg-duoBlueDark-darkest dark:text-duoGrayDark-lightest'>
      <label className='mb-2 mt-2 flex items-center justify-center pb-2 pl-6 pr-6 pt-6 text-xl font-[850] text-duoBlue-default md:text-[1.5rem] lg:text-[2rem]'>
        duolingo
      </label>


      <ItemsList itemsList={sidebarItems} />
    </section>
  );
};

export default StudentSideBar;
