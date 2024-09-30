import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { CourseDataType } from '@/reducers/courseDataReducer';
import AdminUnitLessonsSection from '../AdminUnitLessonsSection';
import { fieldToEditType } from '@/app/store/stores/useInfoBarStore';

library.add(faStar);

interface AdminUnitLevelsSectionProps {
  unitId: string;
  levelsData: LevelType[];
  suspendedLevelsIds: string[];
  courseDataState: CourseDataType;
  exerciseAccordion: string[];
  targetsList: TargetType[] | null;
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

const AdminUnitLevelsSection: React.FC<AdminUnitLevelsSectionProps> = (
  props
) => {
  const {
    unitId,
    levelsData,
    suspendedLevelsIds,
    courseDataState,
    exerciseAccordion,
    targetsList,
    updateInfobarData,
    toggleAccordion,
  } = props;
  return (
    <div className='flex flex-col'>
      {levelsData.length > 0 &&
        levelsData.map((level, levelIndex) => (
          <div
            key={level._id}
            className={`px-6 flex h-fit flex-col border-2 border-t-0 border-duoGray-light dark:border-duoGrayDark-dark ${
              levelIndex === courseDataState.levels.length && 'rounded-b-lg'
            }`}
          >
            {courseDataState.lessons &&
              courseDataState.lessons.length > 0 &&
              courseDataState.lessons.map(
                (lessonsObject, lessonsObjectIndex) => (
                  <div
                    key={lessonsObjectIndex}
                    className='flex flex-col divide-y-2 divide-duoGray-light dark:divide-duoGrayDark-dark'
                  >
                    {lessonsObject.fatherId === level._id &&
                      lessonsObject.data.length > 0 &&
                      lessonsObject.data.map((lesson, lessonIndex) => (
                        <section
                          key={lesson._id}
                          className='flex flex-row py-3'
                        >
                          <div
                            className='h-12 w-12 flex-none cursor-pointer rounded-full bg-duoGreen-default font-extrabold text-white'
                            onClick={() => {
                              const isSuspended = suspendedLevelsIds.includes(
                                level._id
                              );
                              updateInfobarData(
                                fieldToEditType.LEVEL,
                                level._id,
                                levelIndex,
                                level.lessonsIds,
                                unitId,
                                isSuspended
                              );
                            }}
                          >
                            <div className='mx-auto my-auto flex h-full flex-col items-center justify-center'>
                              <div className='mt-1 flex h-full flex-col items-center justify-center'>
                                <FontAwesomeIcon icon={faStar} size='lg' />
                                <span className='h-fit text-[11px]'>
                                  {levelIndex + 1}-{lessonIndex + 1}
                                </span>
                              </div>
                            </div>
                          </div>
                          <AdminUnitLessonsSection
                            lesson={lesson}
                            suspendedLessonsIds={level.suspendedLessonsIds}
                            levelId={level._id}
                            lessonIndex={lessonIndex}
                            courseDataState={courseDataState}
                            exerciseAccordion={exerciseAccordion}
                            targetsList={targetsList}
                            updateInfobarData={updateInfobarData}
                            toggleAccordion={toggleAccordion}
                          />
                        </section>
                      ))}
                  </div>
                )
              )}
          </div>
        ))}
    </div>
  );
};

export default AdminUnitLevelsSection;
