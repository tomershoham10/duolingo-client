'use client';
import Upload from '@/components/Upload/page';
import { ExercisesTypes } from '@/app/API/classes-service/exercises/functions';
import { FileTypes, FeaturesList } from '@/app/API/files-service/functions';
import Dropdown, { DropdownSizes } from '@/components/Dropdown';
import { useFetchTargets } from '@/app/_utils/hooks/(dropdowns)/useFechTargets';
// const Dropdown = dynamic(() => import('@/components/Dropdown'), { ssr: false });

interface SpotreccImageMetaProps {
  file: File | null;
  metadata: Partial<RecordMetadata>;
  handleFileChange: (files: File | File[] | null) => void;
  handleFileRemoved: (fileIndex: number | undefined) => void;
  updateMetadata: (field: string, val: any) => void;
}
const SpotreccImageMetadata: React.FC<SpotreccImageMetaProps> = (props) => {
  const { file, handleFileChange, handleFileRemoved, updateMetadata } = props;
  const targetsList = useFetchTargets();
  return (
    <div className='mt-8 grid w-full grid-cols-1 gap-x-6 gap-y-4 px-4 py-4 3xl:gap-y-12'>
      <section className='flex flex-row items-center justify-start gap-4 border-b-2 border-duoGrayDark-light'>
        <section className='w-fit'>
          <Upload
            label={'Add sonogram'}
            filesTypes='image/*'
            isMultiple={false}
            bucketName={FileTypes.IMAGES}
            exerciseType={ExercisesTypes.SPOTRECC}
            showMode={false}
            files={{
              name: file?.name || '',
              metadata: {},
            }}
            onFileChange={handleFileChange}
            onFileRemoved={handleFileRemoved}
          />
        </section>
        {file?.name ? (
          <div className='text-lg font-extrabold opacity-60'>{file.name}</div>
        ) : null}
      </section>

      <div className='col-span-1 flex items-center justify-between'>
        <span className='text-lg font-bold opacity-80 3xl:text-xl'>
          Target:
        </span>
        <div className='w-[12rem]'>
          <Dropdown
            isSearchable={true}
            placeholder={'Targets'}
            items={targetsList ? targetsList.map((target) => target.name) : []}
            onChange={(targetName) => {
              updateMetadata(
                'targets_ids_list',
                targetsList
                  ? targetsList.filter(
                      (target) => target.name === targetName
                    )[0]._id
                  : ''
              );

              console.log(targetName);
            }}
            size={DropdownSizes.SMALL}
          />
        </div>
      </div>

      <div className='col-span-1 flex items-center justify-between'>
        <span className='text-lg font-bold opacity-80 3xl:text-xl'>
          Notable features:
        </span>
        <div className='w-[12rem]'>
          <Dropdown
            isSearchable={false}
            placeholder={'Signature'}
            items={Object.values(FeaturesList)}
            onChange={(feature) => {
              updateMetadata('notable_features', feature);
              console.log(feature);
            }}
            size={DropdownSizes.SMALL}
          />
        </div>
      </div>
    </div>
  );
};

export default SpotreccImageMetadata;
