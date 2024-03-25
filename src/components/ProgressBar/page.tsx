'use client';
import { useEffect, useState } from 'react';

const ProgressBar: React.FC<ProgressBarProps> = ({
  totalNumOfExercises,
  numOfExercisesMade,
}) => {
  const [newwidth, setNewwidth] = useState<string>('0');

  useEffect(() => {
    const width = ((100 * numOfExercisesMade) / totalNumOfExercises).toString();
    setNewwidth(width);
  }, [totalNumOfExercises, numOfExercisesMade]);

  return (
    <div className='w-full px-10 py-5'>
      {totalNumOfExercises > 0 ? (
        <div className='h-4 w-full rounded-2xl bg-duoGray-default text-transparent dark:bg-duoGrayDark-light'>
          <div
            className='relative flex h-full items-center justify-start rounded-2xl bg-duoGreen-default'
            style={{
              width: `${newwidth}%`,
              transition: 'width 0.5s ease-in-out 0.5s',
            }}
          >
            <div className='mx-[10%] mb-[2.5px] w-[80%] sm:mx-[4%] sm:w-[92%] md:mx-2 md:w-full'>
              <div className='max-h-[5px] w-full rounded-3xl bg-duoGreen-light'>
                {' '}
                {newwidth}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
export default ProgressBar;
