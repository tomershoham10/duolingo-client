import Dropdown, { DropdownSizes } from '@/components/Dropdown';
import Input, { InputTypes } from '@/components/Input/page';
import { SonarSystem } from '@/app/API/files-service/functions';
import Button, { ButtonColors, ButtonTypes } from '@/components/(buttons)/Button/page';
import { useCallback } from 'react';

interface ImagesMetadataPopupProps {
  mainTypeId: string;
  subTypeId: string;
  model: TargetType;
  selectedFile: Partial<FileType>;
}

const ImagesMetadataPopup: React.FC<ImagesMetadataPopupProps> = (props) => {
  const { mainTypeId, subTypeId, model, selectedFile } = props;

  const updateMetadata = useCallback(() => {}, []);
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
        onClick={updateMetadata}
      />
    </div>
  );
};

export default ImagesMetadataPopup;
