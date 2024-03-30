import Image from 'next/image';

interface SonolistProps {
  data: string[] | null;
}

const Sonograms: React.FC<SonolistProps> = (props) => {
  console.log('sonograms', props.data);
  return (
    <section className='h-full w-full text-duoGray-darkest dark:text-duoGrayDark-lightest'>
      sonograms
      {props.data?.map((sonogram, index) => (
        <div key={index}>
          {sonogram}
          <Image
            src={
              'http://localhost:9001/sonograms/students_dashboard.JPG?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=your-minio-access-key%2F20240328%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20240328T110506Z&X-Amz-Expires=86400&X-Amz-SignedHeaders=host&X-Amz-Signature=c774d319de82b5a3b3dee083d807cc5074549d4ac88a2c59027033b0b2d0989c'
            }
            alt='Your Image'
            width={300}
            height={200}
          />
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
