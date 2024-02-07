'use client';
import Button, { ButtonColors } from '@/components/Button/page';
import { useState, useEffect } from 'react';

export interface PaginationItems {
  label: string;
  link: string;
  isDisabled: boolean;
  onNext: (a: any) => void;
}

interface PaginationProps {
  header: string;
  paginationItems: PaginationItems[];
}

const Pagination: React.FC<PaginationProps> = (props) => {
  const [selectedPageNumber, setSelectedPageNumber] = useState<number>(0);
  //   const [selectedComponent, setSelectedComponent] = useState<React.ReactNode>();
  const header = props.header;
  const paginationItems = props.paginationItems;

  const selectedPage = paginationItems[selectedPageNumber];
  const selectedComponent = selectedPage ? selectedPage.link : undefined;

  //   useEffect(() => {
  //     paginationItems.map((paginationItem, pagesIndex) =>
  //       selectedPageNumber === pagesIndex
  //         ? setSelectedComponent(paginationItem.component)
  //         : null
  //     );
  //   }, [paginationItems, selectedPageNumber]);
  return (
    <>
      <div className='absolute inset-x-0 top-0 flex flex-col items-start justify-center text-duoGray-darkest  dark:text-duoGrayDark-lightest'>
        <div className='mb-10 mt-5 text-4xl font-extrabold uppercase'>
          {header}
        </div>
        <nav
          className='relative flex h-2 flex-row gap-[10rem] self-center bg-duoGray-default
         dark:bg-duoBlueDark-darkest 3xl:gap-[25rem]'
        >
          {paginationItems.map((paginationItem, navIndex) => (
            <div
              key={navIndex}
              className=' flex flex-col items-center justify-center'
            >
              <div
                className="absolute -top-[11px] flex flex-col items-center justify-center"
              >
                <span
                  className={`z-10 flex h-8 w-8 items-center justify-center rounded-full font-extrabold ${
                    navIndex === selectedPageNumber
                      ? 'bg-duoBlue-button text-duoGray-lightest dark:bg-duoBlueDark-dark dark:text-duoGrayDark-lightest'
                      : 'bg-duoBlue-buttonOpacity text-duoGray-light dark:bg-duoBlueDark-darkOpacity dark:text-duoGrayDark-lightestOpacity'
                  }`}
                >
                  {navIndex + 1}
                </span>
                <span
                  className={`font-bold ${
                    navIndex === selectedPageNumber
                      ? 'text-duoGray-darkest dark:text-duoGrayDark-lightest'
                      : 'text-duoGray-darkText dark:text-duoGrayDark-lightestOpacity'
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
        {selectedComponent}
        <div className='relative flex items-center justify-center py-8'>
          <div className='absolute right-4 w-24'>
            {selectedPageNumber === paginationItems.length - 1 ? (
              <Button label={'SUBMIT'} color={ButtonColors.BLUE} />
            ) : (
              <Button
                label={'NEXT'}
                color={ButtonColors.BLUE}
                isDisabled={paginationItems[selectedPageNumber].isDisabled}
                onClick={() => {
                  setSelectedPageNumber(selectedPageNumber + 1);
                }}
              />
            )}
          </div>
          {selectedPageNumber > 0 ? (
            <div className='absolute right-[8rem] w-24'>
              <Button
                label={'BACK'}
                color={ButtonColors.WHITE}
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