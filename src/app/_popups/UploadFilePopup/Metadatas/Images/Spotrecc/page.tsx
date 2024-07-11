import { useStore } from 'zustand';
import Upload from '@/components/Upload/page';
import Dropdown, { DropdownSizes } from '@/components/Dropdown/page';
import { BucketsNames, FeaturesList } from '@/app/API/files-service/functions';
import { ExercisesTypes } from '@/app/API/classes-service/exercises/functions';
import { useTargetStore } from '@/app/store/stores/useTargetStore';

interface SpotreccImageMetaProps {
  file: Partial<FileType>;
  handleFileChange: (files: File | File[] | null) => void;
  handleFileRemoved: (fileIndex: number | undefined) => void;
  updateMetadata: (val: any) => void;
}
const SpotreccImageMetadata: React.FC<SpotreccImageMetaProps> = (props) => {
  const { file, handleFileChange, handleFileRemoved, updateMetadata } = props;
  const targetsList = useStore(useTargetStore, (state) => state.targets);
  return (
    <div className='mt-8 grid w-full grid-cols-1 gap-x-6 gap-y-4 px-4 py-4 3xl:gap-y-12'>
      <section className='flex flex-row items-center justify-start gap-4 border-b-2 border-duoGrayDark-light'>
        <section className='w-fit'>
          <Upload
            label={'Add sonogram'}
            filesTypes='image/*'
            isMultiple={false}
            bucketName={BucketsNames.IMAGES}
            exerciseType={ExercisesTypes.SPOTRECC}
            showMode={false}
            files={{
              name: file?.name || '',
              exerciseType: ExercisesTypes.SPOTRECC,
              metadata: {},
            }}
            onFileChange={handleFileChange}
            onFileRemoved={handleFileRemoved}
          />
        </section>
        {file.name ? (
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
              updateMetadata({
                targets_ids_list: targetsList
                  ? targetsList.filter(
                      (target) => target.name === targetName
                    )[0]._id
                  : '',
              });
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
        <div className=' w-[12rem]'>
          <Dropdown
            isSearchable={false}
            placeholder={'Signature'}
            items={Object.values(FeaturesList)}
            onChange={(feature) => {
              updateMetadata({ notable_features: feature });
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
