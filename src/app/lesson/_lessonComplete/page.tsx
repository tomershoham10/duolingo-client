import { TbTargetArrow } from 'react-icons/tb';

interface LessonCompleteProps {
  //   time: number;
  score: number;
}
const LessonComplete: React.FC<LessonCompleteProps> = (props) => {
  const { score } = props;
  return (
    <section
      id='lesson-completed'
      className='flex h-full w-full flex-col items-center justify-center gap-16 mt-12'
    >
      <p className='text-duoYellow-text text-5xl font-bold'>Lesson Complete!</p>
      <div className='bg-duoGreenDark-background text-duoGreenDark-background w-[163px] rounded-2xl border-2 border-transparent text-center font-bold uppercase'>
        <p className='pb-[4px] text-sm text-duoGrayDark-darkest'>Good!</p>
        <p className='flex h-[70px] w-full flex-row items-center justify-center gap-2 rounded-2xl bg-duoGrayDark-darkest text-xl'>
          <TbTargetArrow />
          {`${score}%`}
        </p>
      </div>
    </section>
  );
};

export default LessonComplete;
