'use client';
import { useCallback } from 'react';
import TargetsDropdowns from '@/components/TargetsDropdowns';

interface UploadProps {
  //   handleExerciseType: (value: string) => void;

  handleMainId: (value: string) => void;
  handleSubTypeId: (value: string) => void;
  handleModelId: (value: string) => void;
}

const SelectModel: React.FC<UploadProps> = (props) => {
  const { handleMainId, handleSubTypeId, handleModelId } = props;

  const handleModelSelected = useCallback(
    (model: TargetType) => {
      handleModelId(model._id);
    },
    [handleModelId]
  );
  return (
    <section className='mt-12 w-full px-4 py-4 3xl:gap-y-12'>
      <p className='mb-1 font-bold text-duoGrayDark-lighter'>
        Please select a model
      </p>
      <TargetsDropdowns
        excludeFileType={true}
        onModelSelected={handleModelSelected}
      />
    </section>
  );
};

export default SelectModel;
