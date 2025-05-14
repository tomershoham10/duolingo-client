'use client';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faUser,
  faCog,
  faRightToBracket,
  faFolderPlus,
} from '@fortawesome/free-solid-svg-icons';

import handleLogout from '@/app/_utils/functions/handleLogOut';
import ItemsList from '../AdminSideBar/ItemsList';

library.add(faHome, faUser, faCog, faRightToBracket, faFolderPlus);

const StudentSideBar: React.FC = () => {

  const sidebarItems: SidebarItem[] = [
    { name: 'LEARN', icon: faHome, href: '/learn' },
  ];

  return (
    <section className='flex h-screen w-full select-none flex-col justify-center border-r-2 border-duoGray-light bg-duoGray-lighter font-extrabold tracking-wide text-duoGray-darker dark:border-duoGrayDark-light dark:bg-duoBlueDark-darkest dark:text-duoGrayDark-lightest'>
      <label className='mb-2 mt-2 flex items-center justify-center pb-2 pl-6 pr-6 pt-6 text-xl font-[850] text-duoBlue-default md:text-[1.5rem] lg:text-[2rem]'>
        duolingo
      </label>

      <div className="flex flex-col flex-1">
        <ItemsList itemsList={sidebarItems} />
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-6 py-4 mt-auto mb-4 text-left text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors"
        >
          <FontAwesomeIcon icon={faRightToBracket} className="w-6" />
          <span>Log out</span>
        </button>
      </div>
    </section>
  );
};

export default StudentSideBar;
