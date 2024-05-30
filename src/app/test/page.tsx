'use client';

import { getEncryptedFileByName } from '../API/files-service/functions';

const Test: React.FC = () => {
  const downloadZip = async () => {
    // await downloadZip();
    const url = await getEncryptedFileByName(
      'records',
      'underwater-sound_III_Copy.wav'
    );
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.href = url;
        a.download = 'output.zip';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
    console.log('finished');
    // alert('abc');
  };

  return (
    <section className='flex flex-col gap-6'>
      <div>page</div>
      <button onClick={() => downloadZip()}>test</button>
    </section>
  );
};

export default Test;
