'use client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

library.add(faXmark);

interface EditLessonProps {
  lessonId: string;
  lessonIndex: number;

  onClose: () => void;
}

const EditLesson: React.FC<EditLessonProps> = (props) => {
  return (
    <section className='relative m-5 flex h-[30rem] w-[40rem] rounded-md bg-white p-5 dark:bg-duoGrayDark-darkest xl:h-[35rem] xl:w-[55rem] 2xl:h-[50rem] 2xl:w-[78.5rem] 3xl:h-[70rem] 3xl:w-[110rem]'>
      <button
        onClick={props.onClose}
        className='absolute z-50 h-fit w-fit flex-none rounded-md text-duoGray-dark'
      >
        <FontAwesomeIcon className='fa-lg fa-solid flex-none' icon={faXmark} />
      </button>

      <div className='absolute left-0 flex h-10 w-full justify-center border-b-2 dark:border-duoBlueDark-text'>
        <span className='text-xl font-extrabold tracking-widest text-duoGray-dark dark:text-duoBlueDark-text'>
          lesson #{props.lessonIndex + 1}
        </span>
      </div>

      <div className='mt-16 flex h-full w-full flex-col gap-6 px-4'></div>
    </section>
  );
};

export default EditLesson;
