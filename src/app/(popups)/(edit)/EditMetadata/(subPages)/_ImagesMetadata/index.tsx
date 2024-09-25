import { useCallback } from 'react';
import pRetry from 'p-retry';
import Input, { InputTypes } from '@/components/Input/page';
import Dropdown, { DropdownSizes } from '@/components/Dropdown';
import {
  FileTypes,
  SonarSystem,
  updateMetadata,
} from '@/app/API/files-service/functions';
import Button, {
  ButtonColors,
  ButtonTypes,
} from '@/components/(buttons)/Button/page';

interface ImagesMetadataPopupProps {
  mainTypeId: string;
  subTypeId: string;
  model: TargetType;
  selectedFile: Partial<FileType>;
}

const ImagesMetadataPopup: React.FC<ImagesMetadataPopupProps> = (props) => {
  const { mainTypeId, subTypeId, model, selectedFile } = props;

  console.log('ImagesMetadataPopup selectedFile', selectedFile);

  const submitMetadata = useCallback(async () => {
    const response = await pRetry(
      () => {
        selectedFile.name &&
          updateMetadata(
            mainTypeId,
            subTypeId,
            model._id,
            FileTypes.IMAGES,
            selectedFile.name,
            {
              sonogram_type: SonarSystem.DEMON,
              fft: 5,
              bw: 5,
            }
          );
      },
      {
        retries: 5,
      }
    );
    console.log('submitMetadata response', response);
  }, [mainTypeId, model._id, selectedFile.name, subTypeId]);

  return (
    <div className='mt-8 grid w-full grid-cols-1 gap-x-6 gap-y-4 px-4 py-4 3xl:gap-y-12'>
      <div className='col-span-1 flex items-center justify-between'>
        <span className='text-lg font-bold opacity-80 3xl:text-xl'>
          Sonogram type:
        </span>
        <div className='w-[12rem]'>
          <Dropdown
            isSearchable={false}
            placeholder={'Type'}
            items={Object.values(SonarSystem)}
            onChange={(sonarSys) => {
              console.log(sonarSys);
            }}
            size={DropdownSizes.SMALL}
          />
        </div>
      </div>

      <div className='col-span-1 flex items-center justify-between'>
        <span className='text-lg font-bold opacity-80 3xl:text-xl'>FFT:</span>
        <div className='w-[12rem]'>
          <Input
            type={InputTypes.TEXT}
            onChange={(text: string) => {
              console.log(text);
            }}
          />
        </div>
      </div>

      <div className='col-span-1 flex items-center justify-between'>
        <span className='text-lg font-bold opacity-80 3xl:text-xl'>BW:</span>
        <div className='w-[12rem]'>
          <Input
            type={InputTypes.TEXT}
            value={''}
            onChange={(text: string) => {
              console.log(text);
            }}
          />
        </div>
      </div>
      <Button
        label={'Update'}
        buttonType={ButtonTypes.SUBMIT}
        color={ButtonColors.BLUE}
        onClick={submitMetadata}
      />
    </div>
  );
};

export default ImagesMetadataPopup;
