import Upload from '@/components/Upload/page';
import Dropdown, { DropdownSizes } from '@/components/Dropdown/page';
import Input, { InputTypes } from '@/components/Input/page';
import { BucketsNames, SonarSystem } from '@/app/API/files-service/functions';
import { ExercisesTypes } from '@/app/API/classes-service/exercises/functions';
import { isSonogramMetadata } from '@/app/utils/functions/filesMetadata/functions';

interface FSASonogramMetaProps {
  file: Partial<FileType>;
  exerciseType: ExercisesTypes;
  handleFileChange: (files: File | File[] | null) => void;
  handleFileRemoved: (fileIndex: number | undefined) => void;
  updateMetadata: (val: any) => void;
}
const FSASonogramMetadata: React.FC<FSASonogramMetaProps> = (props) => {
  const {
    file,
    exerciseType,
    handleFileChange,
    handleFileRemoved,
    updateMetadata,
  } = props;
  return (
    <>
      {file.metadata && isSonogramMetadata(file.metadata, exerciseType) ? (
        <div className='mt-8 grid w-full grid-cols-1 gap-x-6 gap-y-4 px-4 py-4 3xl:gap-y-12'>
          <section className='flex flex-row items-center justify-start gap-4 border-b-2 border-duoGrayDark-light'>
            <section className='w-fit'>
              <Upload
                label={'Add sonogram'}
                filesTypes='image/*'
                isMultiple={false}
                bucketName={BucketsNames.IMAGES}
                exerciseType={ExercisesTypes.FSA}
                showMode={false}
                files={{
                  name: file?.name || '',
                  exerciseType: ExercisesTypes.FSA,
                  metadata: {},
                }}
                onFileChange={handleFileChange}
                onFileRemoved={handleFileRemoved}
              />
            </section>
            {file.name ? (
              <div className='text-lg font-extrabold opacity-60'>
                {file.name}
              </div>
            ) : null}
          </section>
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
                  updateMetadata({ sonogram_type: sonarSys });

                  // recordMetaDispatch({
                  //   type: recordMetaAction.SET_SONAR_SYSTEM,
                  //   payload: sonarSys as SonarSystem,
                  // })
                  console.log(sonarSys);
                }}
                size={DropdownSizes.SMALL}
              />
            </div>
          </div>

          <div className='col-span-1 flex items-center justify-between'>
            <span className='text-lg font-bold opacity-80 3xl:text-xl'>
              FFT:
            </span>
            <div className='w-[12rem]'>
              <Input
                type={InputTypes.text}
                //   value={recordMetaState.operation}
                onChange={
                  (text: string) => {
                    updateMetadata({ fft: text });

                    console.log(text);
                  }
                  // recordMetaDispatch({
                  //   type: recordMetaAction.SET_OPERATION_NAME,
                  //   payload: text,
                  // })
                }
              />
            </div>
          </div>

          <div className='col-span-1 flex items-center justify-between'>
            <span className='text-lg font-bold opacity-80 3xl:text-xl'>
              BW:
            </span>
            <div className='w-[12rem]'>
              <Input
                type={InputTypes.text}
                value={String(file.metadata.bw) || ''}
                onChange={(text: string) => {
                  updateMetadata({ bw: Number(text) });
                  console.log(text);
                }}
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default FSASonogramMetadata;
