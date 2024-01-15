'use client';
import PaginationHeader from '@/_archive/Pagination/PaginationHeader/page';
import PaginationFooter from '@/_archive/Pagination/PaginationFooter/page';
// import { PaginationItems } from '@/components/Navigation/Pagination/page';

export interface PaginationItems {
  label: string;
  link: string;
  isDisabled: boolean;
  onNext: () => void;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pagesContent: PaginationItems[] = [
    {
      label: 'records',
      link: '/classroom/new-exercise-2/acint-data',
      //   component: <AcintDataSection />,
      onNext: () => console.log('Next for records'),
      //   isDisabled: !!!recordId,
      isDisabled: true,
    },
    {
      label: 'exercise data',
      link: '/classroom/new-exercise-2/exercise-data',
      onNext: () => console.log('Next for exercise data'),
      isDisabled: true,
    },
    {
      label: 'preview',
      link: '/classroom/new-exercise-2/preview',
      onNext: () => console.log('Next for preview'),
      isDisabled: true,
    },
  ];
  return (
    <div
      className='grid h-screen w-screen grid-flow-col overflow-y-auto'
      style={{ gridTemplateRows: '200px 1fr 100px' }}
    >
      <PaginationHeader
        header={'create new exercise'}
        pagesContent={pagesContent}
      />
      {children}
      <PaginationFooter pagesContent={pagesContent} />
    </div>
  );
}
