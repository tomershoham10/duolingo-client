import { useCallback, useEffect, useReducer, useState } from 'react';
import {
  fieldToEditType,
  useInfoBarStore,
} from '@/app/store/stores/useInfoBarStore';
import { courseDataReducer } from '@/reducers/courseDataReducer';
import useCourseData from '@/app/_utils/hooks/useCourseData';
import LodingAdminSection from './(components)/LodingAdminSection/page';
import AdminUnitHeader from './(components)/AdminUnitHeader/page';
import { useFetchTargets } from '@/app/_utils/hooks/(dropdowns)/useFechTargets';
import AdminUnitLevelsSection from './(components)/AdminUnitLevelsSection';

interface AdminUnitProps {
  courseId: string;
}

const AdminUnit: React.FC<AdminUnitProps> = (props) => {
  const propsCourseId = props.courseId;

  const targetsList = useFetchTargets();

  const fieldId = useInfoBarStore.getState().syllabusFieldId;

  const updateFieldType = useInfoBarStore.getState().updatesyllabusFieldType;
  const updateFieldId = useInfoBarStore.getState().updateSyllabusFieldId;
  const updateFieldIndex = useInfoBarStore.getState().updateSyllabusFieldIndex;
  const updateFieldSubIdsList =
    useInfoBarStore.getState().updateSyllabusSubIdsListField;
  const updateFieldFatherIndex =
    useInfoBarStore.getState().updateSyllabusFieldFatherIndex;
  const updateIsFieldSuspended =
    useInfoBarStore.getState().updateSyllabusIsFieldSuspended;

  useEffect(() => {
    console.log('infoBarStore.fieldId', fieldId);
  }, [fieldId]);

  const initialCourseDataState = {
    courseId: propsCourseId,
    units: [],
    suspendedUnitsIds: [],
    levels: [{ fatherId: null, data: [] }],
    // unsuspendedLevels: [{ fatherId: null, data: [] }],
    lessons: [{ fatherId: null, data: [] }],
    // unsuspendedLessons: [{ fatherId: null, data: [] }],
    exercises: [{ fatherId: null, data: [] }],
    // unsuspendedExercises: [{ fatherId: null, data: [] }],
    results: [],
  };

  const [courseDataState, courseDataDispatch] = useReducer(
    courseDataReducer,
    initialCourseDataState
  );

  useCourseData(undefined, courseDataState, courseDataDispatch);

  const [exerciseAccordion, setExerciseAccordion] = useState<string[]>([]);

  useEffect(
    () => console.log('exerciseAccordion', exerciseAccordion),
    [exerciseAccordion]
  );

  const toggleAccordion = (exerciseId: string) => {
    exerciseAccordion.includes(exerciseId)
      ? setExerciseAccordion((pervExercises) =>
          pervExercises.filter((id) => {
            return id !== exerciseId;
          })
        )
      : setExerciseAccordion((pervExercises) => [...pervExercises, exerciseId]);
  };

  const updateInfobarData = useCallback(
    (
      filedType: fieldToEditType,
      fieldId: string,
      fieldIndex: number,
      subIdsList: string[],
      fatherId: string,
      isSuspended: boolean
    ) => {
      updateFieldType(filedType);
      updateFieldId(fieldId);
      updateFieldIndex(fieldIndex);
      updateFieldSubIdsList(subIdsList);
      updateFieldFatherIndex(fatherId);
      updateIsFieldSuspended(isSuspended);
    },
    [
      updateFieldFatherIndex,
      updateFieldId,
      updateFieldIndex,
      updateFieldSubIdsList,
      updateFieldType,
      updateIsFieldSuspended,
    ]
  );

  return (
    <div className='flex w-full'>
      <div className='mx-24 h-full w-full text-black'>
        {courseDataState.units && courseDataState.units.length > 0 ? (
          courseDataState.units.map((unit, unitIndex) => (
            <div
              key={unit._id}
              className={`flex-none py-[2rem] ${
                courseDataState.suspendedUnitsIds.includes(unit._id) &&
                'opacity-60'
              } `}
            >
              <AdminUnitHeader
                unit={unit}
                unitIndex={unitIndex}
                courseId={propsCourseId}
                isSuspended={courseDataState.suspendedUnitsIds.includes(
                  unit._id
                )}
                updateInfobarData={updateInfobarData}
              >
                <div className='flex flex-col'>
                  {courseDataState.levels &&
                    courseDataState.levels.length > 0 &&
                    courseDataState.levels.map(
                      (levelsObject, levelsObjectIndex) => (
                        <div key={levelsObjectIndex} className='flex-none'>
                          {levelsObject.fatherId === unit._id && (
                            <AdminUnitLevelsSection
                              unitId={unit._id}
                              levelsData={levelsObject.data}
                              courseDataState={courseDataState}
                              suspendedLevelsIds={unit.suspendedLevelsIds}
                              exerciseAccordion={exerciseAccordion}
                              targetsList={targetsList}
                              updateInfobarData={updateInfobarData}
                              toggleAccordion={toggleAccordion}
                            />
                          )}
                        </div>
                      )
                    )}
                </div>
              </AdminUnitHeader>
            </div>
          ))
        ) : (
          <LodingAdminSection />
        )}
      </div>
    </div>
  );
};

export default AdminUnit;
