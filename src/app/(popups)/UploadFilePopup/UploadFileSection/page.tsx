'use client';
import { ExercisesTypes } from '@/app/API/classes-service/exercises/functions';
import { BucketsNames } from '@/app/API/files-service/functions';
import Dropdown, { DropdownSizes } from '@/components/Dropdown';

interface UploadProps {
  handleExerciseType: (value: string) => void;
  handleFileType: (value: string) => void;
}

const UploadFileSection: React.FC<UploadProps> = (props) => {
  const { handleExerciseType, handleFileType } = props;
  return (
    <div className='mt-12 grid w-full grid-cols-2 gap-x-6 gap-y-2 px-4 py-4 3xl:gap-y-12'>
      <div>
        <p className='mb-1 font-bold text-duoGrayDark-lighter'>
          Please select exercise type
        </p>
        <Dropdown
          isSearchable={false}
          placeholder={'Exercise Type'}
          items={Object.values(ExercisesTypes)}
          size={DropdownSizes.SMALL}
          onChange={handleExerciseType}
        />
      </div>
      <div>
        <p className='mb-1 font-bold text-duoGrayDark-lighter'>
          Please select file type
        </p>
        <Dropdown
          isSearchable={false}
          placeholder={'File Type'}
          items={Object.values(BucketsNames)}
          size={DropdownSizes.SMALL}
          onChange={handleFileType}
        />
      </div>
    </div>
  );
};

export default UploadFileSection;
