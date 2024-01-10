'use client';
import Button, { Color } from '@/components/Button/page';
import { useState } from 'react';

export interface PaginationItems {
  label: string;
  component: React.ReactNode;
  onNext: (a: any) => void;
}

interface PaginationProps {
  header: string;
  paginationItems: PaginationItems[];
}

const Pagination: React.FC<PaginationProps> = (props) => {
  const [selectedPageNumber, setSelectedPageNumber] = useState<number>(0);
  const header = props.header;
  const paginationItems = props.paginationItems;
  return (
    <>
      <div className='absolute inset-x-0 top-0 flex flex-col items-start justify-center'>
        <div className='mb-10 mt-5 text-4xl font-extrabold uppercase'>
          {header}
        </div>
        <nav className='relative flex h-2 flex-row gap-[10rem] self-center bg-duoBlueDark-darkest 3xl:gap-[25rem]'>
          {paginationItems.map((paginationItem, navIndex) => (
            <div
              key={navIndex}
              className=' flex flex-col items-center justify-center'
            >
              <div
                className={`absolute -top-[11px] flex flex-col items-center justify-center`}
              >
                <span
                  className={`z-10 flex h-8 w-8 items-center justify-center rounded-full font-extrabold ${
                    navIndex === selectedPageNumber
                      ? 'dark:bg-duoBlueDark-dark dark:text-duoGrayDark-lightest'
                      : 'dark:bg-duoBlueDark-darkOpacity dark:text-duoGrayDark-lightestOpacity'
                  }`}
                >
                  {navIndex + 1}
                </span>
                <span
                  className={`font-bold ${
                    navIndex === selectedPageNumber
                      ? 'dark:text-duoGrayDark-lightest'
                      : 'dark:text-duoGrayDark-lightestOpacity'
                  }`}
                >
                  {paginationItem.label}
                </span>
              </div>
            </div>
          ))}
        </nav>
      </div>
      <section
        className='mt-44 flex w-full flex-col justify-between'
        style={{
          minHeight: 'calc(100vh - 11rem)',
        }}
      >
        {paginationItems.map((paginationItem, pagesIndex) => (
          <>
            {selectedPageNumber === pagesIndex ? (
              <section key={pagesIndex} className='mx-auto w-[90%]'>
                {paginationItem.component}
              </section>
            ) : null}
          </>
        ))}
        <div className='relative flex items-center justify-center py-8'>
          <div className='absolute right-4 w-24'>
            {selectedPageNumber === paginationItems.length - 1 ? (
              <Button label={'SUBMIT'} color={Color.BLUE} />
            ) : (
              <Button
                label={'NEXT'}
                color={Color.BLUE}
                onClick={() => {
                  setSelectedPageNumber(selectedPageNumber + 1);
                  paginationItems[selectedPageNumber].onNext('abc');
                }}
              />
            )}
          </div>
          {selectedPageNumber > 0 ? (
            <div className='absolute right-[8rem] w-24'>
              <Button
                label={'BACK'}
                color={Color.WHITE}
                onClick={() => setSelectedPageNumber(selectedPageNumber - 1)}
              />
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
};
export default Pagination;
