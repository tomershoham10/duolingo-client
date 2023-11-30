'use client';
// import { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';

import useStore from '@/app/store/useStore';
import { useUserStore, TypesOfUser } from '@/app/store/stores/useUserStore';
import { usePathname } from 'next/navigation';
import { useCourseStore } from '@/app/store/stores/useCourseStore';
import { useEditSyllabusStore } from '@/app/store/stores/useEditSyllabus';

const InfoBar: React.FC = () => {
  const userName = useStore(useUserStore, (state) => state.userName);
  const courseType = useStore(useCourseStore, (state) => state.courseType);
  const fieldToEdit = useStore(
    useEditSyllabusStore,
    (state) => state.fieldToEdit
  );
  const fieldId = useStore(useEditSyllabusStore, (state) => state.fieldId);
  const pathname = usePathname();
  // const [selected, setSelected] = useState<number>();

  return (
    <div className='flex h-full w-72 flex-col items-center justify-start border-l-2 border-duoGray-light font-extrabold tracking-wide text-duoGray-darkest'>
      {pathname.includes('syllabus') ? (
        <div>
          <div>{courseType}</div>
          {fieldToEdit ? (
            <div>
              {fieldToEdit} {fieldId}
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
