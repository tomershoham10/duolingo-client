const LodingAdminSection: React.FC = () => {
  return (
    <div className='mt-8 h-full w-full'>
      <div className='w-full items-center rounded-t-lg bg-duoGreen-default py-5 dark:bg-duoGrayDark-dark sm:h-fit'>
        <div className='ml-4 flex h-full animate-pulse flex-col gap-5'>
          <div className='h-3 w-20 rounded-2xl bg-duoGrayDark-lighter'></div>
          <div className='h-3 w-48 rounded-2xl bg-duoGrayDark-lighter'></div>
        </div>
      </div>
      <div className='flex h-fit w-full flex-col divide-y-2 rounded-b-lg border-2 border-t-0 border-duoGray-light px-6 py-3 dark:divide-duoGrayDark-light dark:border-duoGrayDark-dark'>
        <div className='my-auto flex h-full w-full flex-row items-start justify-start gap-6'>
          <div className='h-10 w-12 animate-pulse rounded-full bg-duoGrayDark-lighter'></div>
          <div className='flex w-full flex-col'>
            <div className='h-3 w-24 animate-pulse rounded-2xl bg-duoGrayDark-lighter'></div>

            <div className='my-1 flex h-fit w-full flex-col items-center justify-center divide-y-2 p-2 text-duoGray-darkest dark:divide-duoGrayDark-light dark:text-duoGrayDark-lightest'>
              <div className='flex w-full flex-row items-center justify-between py-4'>
                <div className='h-3 w-32 animate-pulse rounded-2xl bg-duoGrayDark-lighter'></div>
              </div>
              <div className='flex w-full flex-row items-center py-4'>
                <div className='h-3 w-32 animate-pulse rounded-2xl bg-duoGrayDark-lighter'></div>
              </div>
              <div className='flex w-full flex-row items-center py-4'>
                <div className='h-3 w-32 animate-pulse rounded-2xl bg-duoGrayDark-lighter'></div>
              </div>
            </div>
          </div>
        </div>

        <div className='my-auto flex h-full w-full flex-row items-start justify-start gap-6 pt-4'>
          <div className='h-10 w-12 animate-pulse rounded-full bg-duoGrayDark-lighter'></div>
          <div className='flex w-full flex-col'>
            <div className='h-3 w-24 animate-pulse rounded-2xl bg-duoGrayDark-lighter'></div>

            <div className='my-1 flex h-fit w-full flex-col items-center justify-center divide-y-2 p-2 text-duoGray-darkest dark:divide-duoGrayDark-light dark:text-duoGrayDark-lightest'>
              <div className='flex w-full flex-row items-center justify-between py-4'>
                <div className='h-3 w-32 animate-pulse rounded-2xl bg-duoGrayDark-lighter'></div>
              </div>
              <div className='flex w-full flex-row items-center justify-between py-4'>
                <div className='h-3 w-32 animate-pulse rounded-2xl bg-duoGrayDark-lighter'></div>
              </div>
            </div>
          </div>
        </div>

        <div className='my-auto flex h-full w-full flex-row items-start justify-start gap-6 pt-4'>
          <div className='h-10 w-12 animate-pulse rounded-full bg-duoGrayDark-lighter'></div>
          <div className='flex w-full flex-col'>
            <div className='h-3 w-24 animate-pulse rounded-2xl bg-duoGrayDark-lighter'></div>

            <div className='my-1 flex h-fit w-full flex-col items-center justify-center divide-y-2 p-2 text-duoGray-darkest dark:divide-duoGrayDark-light dark:text-duoGrayDark-lightest'>
              <div className='flex w-full flex-row items-center justify-between py-4'>
                <div className='h-3 w-32 animate-pulse rounded-2xl bg-duoGrayDark-lighter'></div>
              </div>

              <div className='flex w-full flex-row items-center justify-between pt-2'>
                <div className='h-3 w-32 animate-pulse rounded-2xl bg-duoGrayDark-lighter mt-2'></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LodingAdminSection;
