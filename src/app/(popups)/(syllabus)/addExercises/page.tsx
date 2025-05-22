'use client';
import Button, {
  ButtonColors,
  ButtonTypes,
} from '@/components/(buttons)/Button/page';
import PopupHeader, { PopupSizes } from '../../PopupHeader/page';
import { PopupsTypes, usePopupStore } from '@/app/store/stores/usePopupStore';
import { useStore } from 'zustand';
import { useInfoBarStore } from '@/app/store/stores/useInfoBarStore';
import TargetsDropdowns from '@/components/TargetsDropdowns';
import { getExercisesByModelId } from '@/app/API/classes-service/exercises/functions';
import { getLevelById, updateLevel } from '@/app/API/classes-service/levels/functions';
import { useCallback, useReducer, useState } from 'react';
import pRetry from 'p-retry';
import Table from '@/components/Table/page';
import Link from 'next/link';
import RoundButton from '@/components/RoundButton';
import { TiPlus } from 'react-icons/ti';
import { AlertSizes, useAlertStore } from '@/app/store/stores/useAlertStore';
import { ExerciseType, LevelType, TargetType } from '@/app/types';
import { courseDataReducer } from '@/reducers/courseDataReducer';
import useCourseData from '@/app/_utils/hooks/useCourseData';
import { useCourseStore } from '@/app/store/stores/useCourseStore';

const AddExercises: React.FC = () => {
  const levelId = useStore(useInfoBarStore, (state) => state.syllabusFieldId);
  const levelIndex = useStore(
    useInfoBarStore,
    (state) => state.syllabusFieldIndex
  );
  const updateSelectedPopup = usePopupStore.getState().updateSelectedPopup;
  const addAlert = useAlertStore.getState().addAlert;
  const selectedCourse = useStore(useCourseStore, (state) => state.selectedCourse);

  const [exercisesList, setExercisesList] = useState<ExerciseType[] | null>(
    null
  );
  const [isAdding, setIsAdding] = useState<Record<string, boolean>>({});
  
  // Set up course data for refreshing after changes
  const initialCourseDataState = {
    courseId: selectedCourse?._id || null,
    levels: [],
    exercises: [],
    results: [],
  };
  
  const [courseDataState, courseDataDispatch] = useReducer(
    courseDataReducer,
    initialCourseDataState
  );
  
  const { fetchCourseData } = useCourseData(
    undefined,
    courseDataState,
    courseDataDispatch
  );

  const fetchExercises = useCallback(async (model: TargetType | null) => {
    if (model) {
      const exercises = await pRetry(() => getExercisesByModelId(model._id), {
        retries: 5,
      });
      setExercisesList(exercises);
    }
  }, []);
  
  const handleAddExercise = async (exercise: ExerciseType) => {
    try {
      if (!levelId) {
        throw new Error('Level ID is not defined');
      }

      setIsAdding(prev => ({ ...prev, [exercise._id]: true }));
      
      // Get current level data using the API function
      const level = await getLevelById(levelId);
      
      if (!level) {
        throw new Error('Failed to fetch level data');
      }
      
      // Check if exercise is already in the level
      const existingExercisesIds = level.exercisesIds || [];
      if (existingExercisesIds.includes(exercise._id)) {
        addAlert(
          'This exercise is already in the level',
          AlertSizes.small
        );
        setIsAdding(prev => ({ ...prev, [exercise._id]: false }));
        return;
      }
      
      // Add the exercise ID to the level's exercisesIds array
      const updatedExercisesIds = [...existingExercisesIds, exercise._id];
      
      // Update the level with the new exercisesIds using the API function
      const success = await updateLevel({
        _id: levelId,
        exercisesIds: updatedExercisesIds
      });
      
      if (!success) {
        throw new Error('Failed to update level');
      }
      
      // Show success message
      addAlert(
        'Exercise added successfully',
        AlertSizes.small
      );
      
      // Close the popup
      updateSelectedPopup(PopupsTypes.CLOSED);
      
      // Force page reload to refresh data (similar to level deletion)
      window.location.reload();
      
    } catch (error: any) {
      console.error('Error adding exercise:', error);
      addAlert(
        `Error adding exercise: ${error.message}`,
        AlertSizes.small
      );
    } finally {
      setIsAdding(prev => ({ ...prev, [exercise._id]: false }));
    }
  };

  return (
    <PopupHeader
      popupType={PopupsTypes.ADD_EXERCISES}
      size={PopupSizes.EXTRA_LARGE}
      header={`Level no. ${levelIndex + 1}`}
      onClose={() => updateSelectedPopup(PopupsTypes.CLOSED)}
    >
      <TargetsDropdowns
        excludeFileType={true}
        onModelSelected={fetchExercises}
      />
      {exercisesList && (
        <section className='mx-auto w-fit pt-6'>
          <Table
            headers={[
              { key: 'type', label: 'exercise type' },
              { key: 'adminComments', label: 'comments' },
              { key: 'link', label: 'preview' },
              { key: 'add', label: 'add' },
            ]}
            rows={exercisesList.map((exercise) => {
              return {
                type: exercise.type,
                adminComments: exercise.adminComments,
                link: (
                  <Link
                    className='w-fit cursor-pointer gap-2 text-center text-duoBlue-default hover:text-duoBlue-default dark:text-duoPurpleDark-default dark:hover:opacity-90'
                    href={`${`/classroom/exercise-preview/${exercise._id}`}`}
                    target='_blank'
                  >
                    preview
                  </Link>
                ),
                add: (
                  <RoundButton 
                    Icon={TiPlus} 
                    onClick={() => handleAddExercise(exercise)} 
                    isLoading={isAdding[exercise._id]}
                    disabled={isAdding[exercise._id]}
                  />
                ),
              };
            })}
            isLoading={false}
          />
        </section>
      )}
    </PopupHeader>
  );
};

export default AddExercises;
