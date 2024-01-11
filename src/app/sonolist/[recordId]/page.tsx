import {
  getSonolistByRecordId,
  getAllRecords,
} from '@/app/API/files-service/functions';
import Sonograms from './_sonolist';

interface SonolistPrams {
  recordId: string;
}

interface SonolistProps {
  params: SonolistPrams;
}

const Sonolist = async ({ params }: { params: { recordId: string } }) => {
  const sonolist = await getAllRecords();
  console.log('sonolist', sonolist);
  return <Sonograms data={sonolist} />;
};
export default Sonolist;
