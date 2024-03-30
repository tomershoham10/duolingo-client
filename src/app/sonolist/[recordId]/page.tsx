import {
  getSonolistByRecordId,
  getAllSonograms,
  getFileByName,
} from '@/app/API/files-service/functions';
import Sonograms from './_sonolist';
import Image from 'next/image';

interface SonolistPrams {
  recordId: string;
}

interface SonolistProps {
  params: SonolistPrams;
}

const Sonolist = async ({ params }: { params: { recordId: string } }) => {
  const sonolist = await getSonolistByRecordId(params.recordId);
  //   const file = await getFileByName('sonograms', 'logo.png');

  const minioEndpoint = 'http://localhost:9000';
  const bucketName = 'sonograms';
  const objectKey = 'logo.png';

  // Construct the URL for the image
  const imageUrl = `${minioEndpoint}/${bucketName}/${objectKey}`;

  //   console.log('file', file);
  return (
    <>
      {params.recordId}
      <Image src={imageUrl} alt='Your Image' width={300} height={200} />
      <Sonograms data={sonolist} />
    </>
  );
};
export default Sonolist;
