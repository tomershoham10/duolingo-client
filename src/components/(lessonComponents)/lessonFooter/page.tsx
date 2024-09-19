import { ExercisesTypes } from '@/app/API/classes-service/exercises/functions';
import Button, { ButtonColors } from '@/components/(buttons)/Button/page';

interface LessonFooterProps {
  exerciseType: ExercisesTypes;
  isExerciseStarted: boolean;
  isExerciseFinished: boolean;
  isLessonFinished: boolean;
  fileName?: string;
  onStartExercise: () => void;
  onSubmit: () => void;
  updatePassword: (password: string) => void;
}

const LessonFooter: React.FC<LessonFooterProps> = (props) => {
  const {
    exerciseType,
    isExerciseStarted,
    isExerciseFinished,
    isLessonFinished,
    onStartExercise,
    onSubmit,
    updatePassword,
  } = props;
  return (
    <section className='relative col-span-2 flex h-full items-center justify-center border-t-2 dark:border-duoGrayDark-light'>
      {!isLessonFinished ? (
        !isExerciseStarted ? (
          !isExerciseFinished ? (
            <>
              {exerciseType === ExercisesTypes.FSA && (
                <Button
                  label={'Download Record'}
                  color={ButtonColors.PURPLE}
                  style={'w-[8rem] 3xl:w-[12rem] text-2xl tracking-widest'}
                  onClick={onStartExercise}
                />
              )}

              <Button
                label={'Start'}
                color={ButtonColors.PURPLE}
                style={'w-[8rem] 3xl:w-[12rem] text-2xl tracking-widest'}
                onClick={onStartExercise}
              />
            </>
          ) : (
            <>exercise finished</>
          )
        ) : (
          <Button
            label={'Next'}
            color={ButtonColors.PURPLE}
            style={'w-[8rem] 3xl:w-[12rem] text-2xl tracking-widest'}
            onClick={onSubmit}
          />
        )
      ) : (
        <Button
          label={'Continue'}
          color={ButtonColors.PURPLE}
          style={'w-[12rem] 3xl:w-[16rem] text-2xl tracking-widest'}
          onClick={onSubmit}
        />
      )}
    </section>
  );
};

export default LessonFooter;
