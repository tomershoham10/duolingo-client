'use client';
import { useRouter, usePathname } from 'next/navigation';
import Button, { Color } from '@/components/Button/page';
import { PaginationItems } from '../page';

interface PaginationFooterProps {
  pagesContent: PaginationItems[];
}

const PaginationFooter: React.FC<PaginationFooterProps> = (props) => {
  const router = useRouter();
  const pathname = usePathname();
  const links = props.pagesContent.map((page) => page.link);
  const indexOfCurrentPage = links.indexOf(pathname);

  const handleNextPage = () => {
    router.push(links[indexOfCurrentPage + 1]);
  };

  const handleBack = () => {
    router.push(links[indexOfCurrentPage - 1]);
  };
  return (
    <div className='relative w-full'>
      {indexOfCurrentPage === links.length - 1 ? (
        <div className='absolute inset-y-1/3 right-[1rem] w-24'>
          <Button label={'SUBMIT'} color={Color.BLUE} />
        </div>
      ) : (
        <div className='absolute inset-y-1/3 right-[1rem] w-24'>
          <Button
            label={'NEXT'}
            color={Color.BLUE}
            // isDisabled={paginationItems[selectedPageNumber].isDisabled}
            onClick={handleNextPage}
          />
        </div>
      )}
      {indexOfCurrentPage > 0 ? (
        <div className='absolute inset-y-1/3 right-[8rem] w-24'>
          <Button label={'BACK'} color={Color.WHITE} onClick={handleBack} />
        </div>
      ) : null}
    </div>
  );
};
export default PaginationFooter;
