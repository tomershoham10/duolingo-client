import Image from 'next/image';

interface SonolistProps {
  data: SonogramType[] | null;
}

const Sonograms: React.FC<SonolistProps> = (props) => {
  console.log('sonograms', props.data);
  return (
    <section className='h-full w-full text-duoGray-darkest dark:text-duoGrayDark-lightest'>
      sonograms
      {props.data?.map((sonogram, index) => (
        <div key={index}>
          {sonogram.name}
          <br />
          {/* <Image
            src={`\${sonogram.name}`}
            width={500}
            height={500}
            alt='sonogram problem'
          /> */}
        </div>
      ))}
    </section>
  );
};
export default Sonograms;
