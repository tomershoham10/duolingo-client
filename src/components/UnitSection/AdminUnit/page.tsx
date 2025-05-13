import { Dispatch, useCallback, useEffect, useReducer, useState } from 'react';
import {
  fieldToEditType,
  useInfoBarStore,
} from '@/app/store/stores/useInfoBarStore';
import {
  CourseDataAction,
  CourseDataType,
} from '@/reducers/courseDataReducer';
import AdminUnitHeader from './(components)/AdminUnitHeader/page';
import { useFetchTargets } from '@/app/_utils/hooks/(dropdowns)/useFechTargets';
import AdminUnitLevelsSection from './(components)/AdminUnitLevelsSection';

interface AdminUnitProps {
  courseDataState: CourseDataType;
  courseDataDispatch: Dispatch<CourseDataAction>;
}

const AdminUnit: React.FC<AdminUnitProps> = (props) => {
  const { courseDataState } = props;

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
    <>
      {courseDataState.courseId &&
        courseDataState.units &&
        courseDataState.units.length > 0 && (
          <div className='flex h-full w-full flex-col px-24 gap-6'>
            {courseDataState.units.map((unit, unitIndex) => (
              <div
                key={unit._id}
                className={`flex w-full flex-col items-center justify-start gap-2 ${
                  courseDataState.suspendedUnitsIds.includes(unit._id) &&
                  'opacity-60'
                } `}
              >
                <AdminUnitHeader
                  unit={unit}
                  unitIndex={unitIndex}
                  courseId={courseDataState.courseId!}
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
            ))}
          </div>
        )}
    </>
  );
};

export default AdminUnit;
