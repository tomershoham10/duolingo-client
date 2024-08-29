'use client';
import { ExercisesTypes } from '@/app/API/classes-service/exercises/functions';
import { BucketsNames } from '@/app/API/files-service/functions';
import Dropdown, { DropdownSizes } from '@/components/Dropdown';
import TargetsDropdowns from '@/components/TargetsDropdowns';

interface UploadProps {
  //   handleExerciseType: (value: string) => void;

  handleMainId: (value: string) => void;
  handleSubTypeId: (value: string) => void;
  handleModelId: (value: string) => void;

  handleFileType: (value: string) => void;
}

const UploadFileSection: React.FC<UploadProps> = (props) => {
  const {
    // handleExerciseType,
    handleFileType,
  } = props;
  return (
    <section className='mt-12 w-full px-4 py-4 3xl:gap-y-12'>
      <p className='mb-1 font-bold text-duoGrayDark-lighter'>
        Please select exercise type
      </p>
      <TargetsDropdowns excludeFileType={true} />
      {/* <div>
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
      </div> */}
    </section>
  );
};

export default UploadFileSection;
