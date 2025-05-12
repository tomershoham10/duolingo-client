import { CourseDataType } from '@/reducers/courseDataReducer';
import AdminUnitAccourdion from '../AdminUnitAccourdion/page';
import { fieldToEditType } from '@/app/store/stores/useInfoBarStore';

interface AdminUnitLessonsSectionProps {
  levelId: string;
  lesson: LessonType;
  lessonIndex: number;
  suspendedLessonsIds: string[];
  courseDataState: CourseDataType;
  exerciseAccordion: string[];
  targetsList: TargetType[] | null;
  levelIndex: number;
  updateInfobarData: (
    filedType: fieldToEditType,
    fieldId: string,
    fieldIndex: number,
    subIdsList: string[],
    fatherId: string,
    isSuspended: boolean
  ) => void;
  toggleAccordion: (exerciseId: string) => void;
}
const AdminUnitLessonsSection: React.FC<AdminUnitLessonsSectionProps> = (
  props
) => {
  const {
    levelId,
    lesson,
    lessonIndex,
    suspendedLessonsIds,
    courseDataState,
    exerciseAccordion,
    targetsList,
    levelIndex,
    updateInfobarData,
    toggleAccordion,
  } = props;

  return (
    <div className='flex w-full flex-row pt-4 text-base font-medium'>
      <div className='mx-6 w-full'>
        <button
          className='text-conter flex w-full items-center justify-start font-extrabold text-duoGray-dark dark:text-duoGrayDark-lightest'
          onClick={() => {
            const isSuspended = suspendedLessonsIds.includes(lesson._id);
            updateInfobarData(
              fieldToEditType.LESSON,
              lesson._id,
              lessonIndex,
              lesson.exercisesIds,
              levelId,
              isSuspended
            );
          }}
        >
          <span>
            Level {levelIndex + 1}
            {' - '}
            {lesson.name}
          </span>
        </button>
        <div className='flex w-full flex-col'>
          {courseDataState.exercises &&
            courseDataState.exercises.length > 0 &&
            courseDataState.exercises.map(
              (exerciseObject, exerciseObjectIndex) => (
                <div
                  key={exerciseObjectIndex}
                  className='w-full divide-y-2 dark:divide-duoGrayDark-light'
                >
                  {exerciseObject.fatherId === lesson._id &&
                    exerciseObject.data.length > 0 &&
                    exerciseObject.data.map((exercise, exerciseIndex) => (
                      <section key={exerciseIndex}>
                        <AdminUnitAccourdion
                          key={exercise._id}
                          exercise={exercise}
                          exerciseIndex={exerciseIndex}
                          isOpen={exerciseAccordion.includes(exercise._id)}
                          targetsList={targetsList || []}
                          toggleAccordion={toggleAccordion}
                        />
                      </section>
                    ))}
                </div>
              )
            )}
        </div>
      </div>
    </div>
  );
};

export default AdminUnitLessonsSection;
