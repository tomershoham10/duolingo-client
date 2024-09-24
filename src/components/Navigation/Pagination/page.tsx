'use client';
import { useCallback, useState } from 'react';
import Button from '@/components/(buttons)/Button/page';

import { ButtonColors } from '@/components/(buttons)/Button/page';
import { useStore } from 'zustand';
import { Themes, useThemeStore } from '@/app/store/stores/useThemeStore';

const Pagination: React.FC<PaginationProps> = (props) => {
  const { header, subHeader, components, subProps, onNext, onSubmit } = props;
  const theme = useStore(useThemeStore, (state) => state.theme);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const componentsNames = Object.keys(components);
  const Component = Object.values(components)[currentPage];

  const handleNextPage = useCallback(() => {
    const nextFunc = onNext[componentsNames[currentPage]];
    console.log('handleNextPage1', nextFunc);
    const canNavigate = nextFunc();
    console.log('handleNextPage2', canNavigate);
    if (canNavigate) {
      setCurrentPage((prev) => prev + 1);
    }
  }, [componentsNames, currentPage, onNext]);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = useCallback(async () => {
    try {
      console.log(1);
      setIsLoading(true);
      try {
        console.log(2);
        await onSubmit();
        console.log(3);
        // Once the operation is complete, do something
        console.log('Async operation completed');
      } catch (error) {
        // Handle error
        console.error('Error occurred:', error);
      } finally {
        console.log(4);
        setIsLoading(false);
      }
    } catch (err) {
      console.error('handleSubmit error:', err);
    }
  }, [onSubmit]);

  return (
    <div
      className='grid h-full w-full'
      style={{ gridTemplateRows: '100px 1fr 100px' }}
    >
      <div className='relative flex-col overflow-auto'>
        <div className='absolute inset-x-0 top-0 flex flex-col items-start justify-center text-duoGray-darkest dark:text-duoGrayDark-lightest'>
          {!!header && !!subHeader ? (
            <div className='mb-10 mt-5 flex gap-3 text-4xl font-extrabold uppercase'>
              {header}
              <p className='text-duoGrayDark-lighter'> {subHeader}</p>
            </div>
          ) : !!header ? (
            <div className='mb-10 mt-5 flex gap-3 text-4xl font-extrabold uppercase'>
              {header}
            </div>
          ) : null}
          <nav
            className={`flex h-2 flex-row gap-[10rem] self-center bg-duoGray-default dark:bg-duoBlueDark-darkest 3xl:gap-[25rem] ${
              !!header ? '' : 'mt-10'
            }`}
          >
            {componentsNames.map((componentLabel, navIndex) => (
              <div
                key={componentLabel}
                className='flex flex-col items-center justify-center'
              >
                <div className='absolute -bottom-[2.3rem] flex flex-col items-center justify-center'>
                  <span
                    className={`z-10 flex h-8 w-8 items-center justify-center rounded-full font-extrabold ${
                      navIndex === currentPage
                        ? 'bg-duoBlue-button text-duoGray-lightest dark:bg-duoBlueDark-dark dark:text-duoGrayDark-lightest'
                        : 'bg-duoBlue-buttonOpacity text-duoGray-light dark:bg-duoBlueDark-darkOpacity dark:text-duoGrayDark-lightestOpacity'
                    }`}
                  >
                    {navIndex + 1}
                  </span>
                  <span
                    className={`font-bold ${
                      navIndex === currentPage
                        ? 'text-duoGray-darkest dark:text-duoGrayDark-lightest'
                        : 'text-duoGray-darkText dark:text-duoGrayDark-lightestOpacity'
                    }`}
                  >
                    {componentLabel}
                  </span>
                </div>
              </div>
            ))}
          </nav>
        </div>
      </div>
      <Component {...subProps} />
      <div className='relative w-full'>
        {currentPage === Object.keys(components).length - 1 ? (
          <div className='absolute inset-y-1/3 right-[1rem] w-24'>
            <Button
              label={'SUBMIT'}
              color={ButtonColors.BLUE}
              onClick={handleSubmit}
              isLoading={isLoading}
              //   loadingLabel={'...'}
            />
          </div>
        ) : (
          <div className='absolute inset-y-1/3 right-[1rem] w-24'>
            <Button
              label={'NEXT'}
              color={ButtonColors.BLUE}
              // isDisabled={paginationItems[selectedPageNumber].isDisabled}
              onClick={handleNextPage}
            />
          </div>
        )}
        {currentPage > 0 ? (
          <div className='absolute inset-y-1/3 right-[8rem] w-24'>
            <Button
              label={'BACK'}
              color={
                theme === Themes.LIGHT
                  ? ButtonColors.GRAYBLUE
                  : ButtonColors.WHITE
              }
              onClick={handlePrevPage}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Pagination;
