import { useStore } from 'zustand';
import MetadataSection from '../../(utils)/MetadataSection';
import { useInfoBarStore } from '@/app/store/stores/useInfoBarStore';
import { FileTypes } from '@/app/API/files-service/functions';

const CreateFsaInfo = () => {
  const selectedMainTypeId = useStore(
    useInfoBarStore,
    (state) => state.selectedMainTypeId
  );
  const selectedSubTypeId = useStore(
    useInfoBarStore,
    (state) => state.selectedSubTypeId
  );

  const selectedModel = useStore(
    useInfoBarStore,
    (state) => state.selectedModel
  );
  const selectedFile = useStore(useInfoBarStore, (state) => state.selectedFile);

  return (
    <div className='mx-auto h-full w-[90%] overflow-hidden py-5'>
      {selectedModel === null ? (
        <section>Please select a model</section>
      ) : (
        <section className='mx-auto flex h-full w-full flex-col justify-start'>
          <p className='mx-auto text-2xl font-extrabold'>
            {selectedModel.name}
          </p>
          {selectedFile && (
            <MetadataSection
              mainId={selectedMainTypeId || ''}
              subtypeId={selectedSubTypeId || ''}
              modelId={selectedModel._id}
              fileType={
                selectedFile.name?.endsWith('.wav')
                  ? FileTypes.RECORDS
                  : FileTypes.IMAGES
              }
              fileName={selectedFile.name || 'file'}
              metadata={selectedFile.metadata || Object.create(null)}
            />
          )}
        </section>
      )}
    </div>
  );
};

export default CreateFsaInfo;
