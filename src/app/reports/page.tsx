'use client';
import { HiChartBar } from 'react-icons/hi';

const Reports: React.FC = () => {
  return (
    <section className='flex h-full w-full flex-col px-6 pb-4 text-duoGray-darkest dark:text-duoGrayDark-lightest'>
      <div className='flex flex-col gap-3 py-6'>
        {/* Header Section */}
        <section className='flex w-full items-center justify-between'>
          <div className='flex items-center gap-4'>
            <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-duoBlue-default dark:bg-duoBlueDark-default'>
              <HiChartBar className='h-7 w-7 text-white' />
            </div>
            <div>
              <h1 className='text-3xl font-extrabold text-duoGray-darkest dark:text-duoGrayDark-lightest'>
                Reports
              </h1>
              <p className='text-duoGray-dark dark:text-duoGrayDark-light'>
                View and analyze application reports
              </p>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
};

export default Reports; 