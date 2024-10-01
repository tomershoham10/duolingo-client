'use client';

import Upload from '@/components/Upload/page';
import { useCallback, useEffect, useState } from 'react';
import {
  FileTypes,
  getFileByName,
  uploadFile,
} from '../API/files-service/functions';
import AudioPlayer from '@/components/AudioPlayer/page';
import { ExercisesTypes } from '../API/classes-service/exercises/functions';

const Try: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState<string | null>(null);

  const handleFileChange = (input: File | File[] | null) => {
    console.log(input);
    if (!Array.isArray(input)) {
      console.log(input);
      input ? setFile(input) : null;
    }
  };

  const getFile = useCallback(async () => {
    console.log('getting url...');
    // const audioUrl = await getFileByName(
    //   BucketsNames.RECORDS,
    //   ExercisesTypes.SPOTRECC,
    //   'underwater_sound_I.wav'
    // );

    console.log('');
    setUrl('');
  }, []);

  useEffect(() => {
    getFile();
  }, [getFile]);

  const upload = async () => {
    if (!!file) {
      console.log('uploading...');
      //   const res = await uploadFile(
      //     BucketsNames.RECORDS,
      //     ExercisesTypes.SPOTRECC,
      //     file,
      //     {}
      //   );

      //   console.log('upload res', res);
    }
  };

  const handleFileRemoved = (fileIndex: number | undefined) => {};

  return (
    <div className='flex w-full flex-col items-center justify-center'>
      <Upload
        label={'upload rec'}
        isMultiple={false}
        filesTypes={'.wav'}
        bucketName={FileTypes.RECORDS}
        exerciseType={ExercisesTypes.SPOTRECC}
        files={{
          id: '',
          name: '',
          metadata: [] as Partial<Metadata>,
        }}
        onFileChange={handleFileChange}
        onFileRemoved={handleFileRemoved}
        showMode={false}
      />
      <button onClick={upload}>upload</button>
      <p>{url}</p>
      {url ? <AudioPlayer src={url} /> : <p>Loading audio...</p>}
    </div>
  );
};

export default Try;
