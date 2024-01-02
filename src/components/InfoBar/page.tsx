'use client';
// import { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';

import useStore from '@/app/store/useStore';
import { useUserStore, TypesOfUser } from '@/app/store/stores/useUserStore';
import { usePathname } from 'next/navigation';
import { useCourseStore } from '@/app/store/stores/useCourseStore';
import { useEditSyllabusStore } from '@/app/store/stores/useEditSyllabus';
import { PopupsTypes, usePopupStore } from '@/app/store/stores/usePopupStore';

const InfoBar: React.FC = () => {
  const pathname = usePathname();

  const userName = useStore(useUserStore, (state) => state.userName);
  const courseType = useStore(useCourseStore, (state) => state.courseType);
  const fieldToEdit = useStore(
    useEditSyllabusStore,
    (state) => state.fieldToEdit
  );
  const fieldId = useStore(useEditSyllabusStore, (state) => state.fieldId);
  const updateSelectedPopup = usePopupStore.getState().updateSelectedPopup;

  // const [selected, setSelected] = useState<number>();

  return (
    <div className='dark:border-duoGrayDark-light dark:text-duoGrayDark-lightest flex h-full w-[18rem] flex-col items-center justify-start border-l-2 border-duoGray-light font-extrabold tracking-wide text-duoGray-darkest 2xl:w-[25rem] 3xl:w-[35rem]'>
      {pathname.includes('syllabus') ? (
        <div>
          <div>{courseType}</div>
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
      ) : (
        <ul className='flex-grow'>
          <li className='text-xl uppercase'>hello {userName}!</li>
        </ul>
      )}
    </div>
  );
};

export default InfoBar;