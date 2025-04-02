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
    <div className='flex h-screen flex-col justify-start border-r-2 border-zinc-500/25 text-sm font-extrabold tracking-wide text-gray-500 dark:text-duoGrayDark-lightest'>
      <label className='mb-2 mt-2 pb-2 pl-6 pr-6 pt-6 text-[2rem] font-[850] text-duoGreen-default'>
        duolingo
      </label>

      <ul className='mx-auto w-[90%]'>
      <ItemsList itemsList={sidebarItems} />
      </ul>
    </div>
  );
};

export default StudentSideBar;
