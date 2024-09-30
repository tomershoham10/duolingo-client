import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faBook } from '@fortawesome/free-solid-svg-icons';

import { fieldToEditType } from '@/app/store/stores/useInfoBarStore';
import Button, { ButtonColors } from '@/components/(buttons)/Button/page';
import { ReactNode } from 'react';
library.add(faBook);

interface AdminUnitHeaderProps {
  children: ReactNode;
  unit: UnitType;
  unitIndex: number;
  courseId: string;
  isSuspended: boolean;
  updateInfobarData: (
    filedType: fieldToEditType,
    fieldId: string,
    fieldIndex: number,
    subIdsList: string[],
    fatherId: string,
    isSuspended: boolean
  ) => void;
}

const AdminUnitHeader: React.FC<AdminUnitHeaderProps> = (props) => {
  const {
    children,
    unit,
    unitIndex,
    courseId,
    isSuspended,
    updateInfobarData,
  } = props;
  return (
    <div className='flex-col w-full'>
      <div className='grid-col-3 grid h-[6.5rem] max-h-[6.5rem] min-h-[6.5rem] w-full grid-flow-col grid-rows-2 items-center justify-between rounded-t-lg bg-duoGreen-default py-3 pl-4 text-white dark:bg-duoGrayDark-dark sm:h-fit'>
        <button
          className='col-span-1 flex-none cursor-pointer items-center justify-start text-xl font-extrabold'
          onClick={() => {
            updateInfobarData(
              fieldToEditType.UNIT,
              unit._id,
              unitIndex,
              unit.levelsIds,
              courseId,
              isSuspended
            );
          }}
        >
          <label className='cursor-pointer'>Unit {unitIndex + 1}</label>
        </button>
        <label className='col-span-2 w-[90%] items-center justify-center font-semibold'>
          {unit.description}
        </label>
        <div className='row-span-2 mr-5 flex items-start justify-end'>
          {unit.guidebookId ? (
            <button className='flex w-40 cursor-pointer flex-row items-center justify-start rounded-2xl border-[2.5px] border-b-[4px] border-duoGreen-darker bg-duoGreen-button p-3 text-sm font-bold hover:border-duoGreen-dark hover:bg-duoGreen-default hover:text-duoGreen-textHover active:border-[2.5px]'>
              <FontAwesomeIcon className='ml-2 mr-2 h-6 w-6' icon={faBook} />
              <Link href={''}>
                <label className='cursor-pointer items-center justify-center text-center'>
                  GUIDEBOOK
                </label>
              </Link>
            </button>
          ) : (
            <div className=''>
              <Button label={'CREATE GUIDEBOOK'} color={ButtonColors.WHITE} />
            </div>
          )}
        </div>
      </div>
      {children}
    </div>
  );
};

export default AdminUnitHeader;

{
  /* <div className='grid-col-3 grid h-[6.5rem] max-h-[6.5rem] min-h-[6.5rem] w-full grid-flow-col grid-rows-2 items-center justify-between rounded-t-lg bg-duoGreen-default py-3 pl-4 text-white dark:bg-duoGrayDark-dark sm:h-fit'>
                  <button
                    className='col-span-1 flex-none cursor-pointer items-center justify-start text-xl font-extrabold'
                    onClick={() => {
                      const isSuspended =
                        courseDataState.suspendedUnitsIds.includes(unit._id);
                      updateInfobarData(
                        fieldToEditType.UNIT,
                        unit._id,
                        unitIndex,
                        propsCourseId,
                        isSuspended
                      );
                    }}
                  >
                    <label className='cursor-pointer'>
                      Unit {unitIndex + 1}
                    </label>
                  </button>
                  <label className='col-span-2 w-[90%] items-center justify-center font-semibold'>
                    {unit.description}
                  </label>
                  <div className='row-span-2 mr-5 flex items-start justify-end'>
                    {unit.guidebookId ? (
                      <button className='flex w-40 cursor-pointer flex-row items-center justify-start rounded-2xl border-[2.5px] border-b-[4px] border-duoGreen-darker bg-duoGreen-button p-3 text-sm font-bold hover:border-duoGreen-dark hover:bg-duoGreen-default hover:text-duoGreen-textHover active:border-[2.5px]'>
                        <FontAwesomeIcon
                          className='ml-2 mr-2 h-6 w-6'
                          icon={faBook}
                        />
                        <Link href={''}>
                          <label className='cursor-pointer items-center justify-center text-center'>
                            GUIDEBOOK
                          </label>
                        </Link>
                      </button>
                    ) : (
                      <div className=''>
                        <Button
                          label={'CREATE GUIDEBOOK'}
                          color={ButtonColors.WHITE}
                        />
                      </div>
                    )}
                  </div>
                </div> */
}
