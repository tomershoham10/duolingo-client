'use client';
import { usePathname } from 'next/navigation';
import { PaginationItems } from '../page';

interface PaginationHeaderProps {
  header: string;
  pagesContent: PaginationItems[];
}

const PaginationHeader: React.FC<PaginationHeaderProps> = (props) => {
  //   const [selectedComponent, setSelectedComponent] = useState<React.ReactNode>();
  const pathname = usePathname();
  return (
    <div className='relative w-full flex-col overflow-auto'>
      <div className='absolute mx-8 inset-x-0 top-0 flex flex-col items-start justify-center text-duoGray-darkest  dark:text-duoGrayDark-lightest'>
        <div className='mb-10 mt-5 text-4xl font-extrabold uppercase'>
          {props.header}
        </div>
        <nav
          className='relative flex h-2 flex-row gap-[10rem] self-center bg-duoGray-default
         dark:bg-duoBlueDark-darkest 3xl:gap-[25rem]'
        >
          {props.pagesContent.map((paginationItem, navIndex) => (
            <div
              key={navIndex}
              className=' flex flex-col items-center justify-center'
            >
              <div
                className={`absolute -top-[11px] flex flex-col items-center justify-center`}
              >
                <span
                  className={`z-10 flex h-8 w-8 items-center justify-center rounded-full font-extrabold ${
                    pathname === paginationItem.link
                      ? 'bg-duoBlue-button text-duoGray-lightest dark:bg-duoBlueDark-dark dark:text-duoGrayDark-lightest'
                      : 'bg-duoBlue-buttonOpacity text-duoGray-light dark:bg-duoBlueDark-darkOpacity dark:text-duoGrayDark-lightestOpacity'
                  }`}
                >
                  {navIndex + 1}
                </span>
                <span
                  className={`font-bold ${
                    pathname === paginationItem.link
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
    </div>
  );
};
export default PaginationHeader;
