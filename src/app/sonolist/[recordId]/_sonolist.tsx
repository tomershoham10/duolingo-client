import { RecordType, SonogramType } from '@/app/API/files-service/functions';

interface SonolistProps {
  data: RecordType[] | null;
}

const Sonograms: React.FC<SonolistProps> = (props) => {
  console.log(props.data);
  return (
    <section className='h-full w-full text-duoGray-darkest dark:text-duoGrayDark-lightest'>
      sonograms
      {/* {props.data?.map((sonogram, index) => <p key={index}>{sonogram.name}</p>)} */}
    </section>
  );
};
export default Sonograms;
