'use client';
import { useState } from 'react';

interface PaginationProps {
  header: string;
  components: Record<string, React.FC>;
}

const Pagination2: React.FC<PaginationProps> = (props) => {
  const [currentPage, setCurrentPage] = useState(0);

  const handleNextPage = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  };

  const componentsNames = Object.keys(props.components);

  console.log(componentsNames);

  const Component = Object.values(props.components)[currentPage];

  return (
    <section
      className='grid h-full w-full grid-flow-col overflow-y-auto'
      style={{ gridTemplateRows: '200px 1fr 100px' }}
    >
      <div className='relative w-full flex-col overflow-auto '>
        <div className='absolute inset-x-0 top-0 mx-8 flex flex-col items-start justify-center text-duoGray-darkest  dark:text-duoGrayDark-lightest'>
          <div className='mb-10 mt-5 text-4xl font-extrabold uppercase'>
            {props.header}
          </div>
          <nav
            className='flex h-2 flex-row gap-[10rem] self-center bg-duoGray-default
         dark:bg-duoBlueDark-darkest 3xl:gap-[25rem]'
          >
            {componentsNames.map((componentLabel, navIndex) => (
              <div
                key={navIndex}
                className=' flex flex-col items-center justify-center'
              >
                <div className='absolute -bottom-[2.3rem] flex flex-col items-center justify-center'>
                  <span
                    className={`z-10 flex h-8 w-8 items-center justify-center rounded-full font-extrabold ${
                      navIndex === 1
                        ? 'bg-duoBlue-button text-duoGray-lightest dark:bg-duoBlueDark-dark dark:text-duoGrayDark-lightest'
                        : 'bg-duoBlue-buttonOpacity text-duoGray-light dark:bg-duoBlueDark-darkOpacity dark:text-duoGrayDark-lightestOpacity'
                    }`}
                  >
                    {navIndex + 1}
                  </span>
                  <span
                    className={`font-bold ${
                      navIndex === 1
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
      <Component />
      <div>
        <button onClick={handlePrevPage}>Previous</button>
        <button onClick={handleNextPage}>Next</button>
      </div>
    </section>
  );
};

export default Pagination2;
