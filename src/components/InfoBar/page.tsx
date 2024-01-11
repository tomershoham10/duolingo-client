'use client';
// import { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';

import useStore from '@/app/store/useStore';
import { useUserStore, TypesOfUser } from '@/app/store/stores/useUserStore';
import { usePathname } from 'next/navigation';
import { useCourseStore } from '@/app/store/stores/useCourseStore';
import { useEditSyllabusStore } from '@/app/store/stores/useInfoBarStore';
import { PopupsTypes, usePopupStore } from '@/app/store/stores/usePopupStore';

const InfoBar: React.FC = () => {
  const pathname = usePathname();

  const userName = useStore(useUserStore, (state) => state.userName);
  const courseName = useStore(useCourseStore, (state) => state.name);
  const fieldToEdit = useStore(
    useEditSyllabusStore,
    (state) => state.fieldToEdit
  );
  const fieldId = useStore(useEditSyllabusStore, (state) => state.fieldId);
  const updateSelectedPopup = usePopupStore.getState().updateSelectedPopup;

  // const [selected, setSelected] = useState<number>();

  return (
    <div className='flex h-full w-[30%] flex-col items-center justify-start border-l-2 border-duoGray-light font-extrabold tracking-wide text-duoGray-darkest dark:border-duoGrayDark-light dark:text-duoGrayDark-lightest 3xl:w-[15%]'>
      {pathname.includes('syllabus') ? (
        <div>
          <div>{courseName}</div>
          {fieldToEdit ? (
            <div>
              <span>
                {fieldToEdit} {fieldId}
              </span>
              <button
                onClick={() => {
                  updateSelectedPopup(PopupsTypes.ADMINEDIT);
                }}
              >
                edit
              </button>
            </div>
          ) : null}
        </div>
      ) : pathname.includes('new-exercise') ? (

        <ul className='flex-grow'>
          <li className='text-xl uppercase'>hello {userName}!</li>
        </ul>
      ) : (
        <ul className='flex-grow'>
          <li className='text-xl uppercase'>hello {userName}!</li>
        </ul>
      )}
    </div>
  );
};

export default InfoBar;
