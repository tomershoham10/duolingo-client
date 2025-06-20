'use client';
import React, { useEffect, useState, useMemo } from 'react';
import { CourseDataType, CourseDataAction, CourseDataActionsList } from '@/reducers/courseDataReducer';
import { LevelType } from '@/app/types';

import { TiPlus, TiTrash, TiArrowSortedDown, TiArrowSortedUp, TiMinus } from 'react-icons/ti';
import RoundButton from '@/components/RoundButton';
import { createByCourse, removeExerciseFromLevel } from '@/app/API/classes-service/levels/functions';
import { AlertSizes, useAlertStore } from '@/app/store/stores/useAlertStore';
import pRetry from 'p-retry';
import useStore from '@/app/store/useStore';
import { useCourseStore } from '@/app/store/stores/useCourseStore';
import { usePopupStore, PopupsTypes } from '@/app/store/stores/usePopupStore';
import { useInfoBarStore } from '@/app/store/stores/useInfoBarStore';

interface AdminLevelProps {
  courseDataState: CourseDataType;
  courseDataDispatch: React.Dispatch<CourseDataAction>;
}

const AdminLevel: React.FC<AdminLevelProps> = ({
  courseDataState,
  courseDataDispatch,
}) => {
  const addAlert = useAlertStore.getState().addAlert;
  const selectedCourse = useStore(useCourseStore, (state) => state.selectedCourse);
  const updateSelectedPopup = usePopupStore.getState().updateSelectedPopup;
  const updateSyllabusFieldId = useInfoBarStore.getState().updateSyllabusFieldId;
  const updateSyllabusFieldIndex = useInfoBarStore.getState().updateSyllabusFieldIndex;
  const [expandedLevels, setExpandedLevels] = useState<Record<string, boolean>>({});
  const [deletingExercises, setDeletingExercises] = useState<Record<string, boolean>>({});
  
  // Use useMemo for derived values to prevent recalculation on every render
  const availableLevelData = useMemo(() => courseDataState.levels[0]?.data || [], [courseDataState.levels]);
  
  // Log state changes only when dependencies actually change
  useEffect(() => {
    console.log('RENDER - courseDataState levels updated:', courseDataState.levels[0]?.data?.length || 0, 'levels');
    console.log('RENDER - courseDataState exercises:', courseDataState.exercises);
    
    // Log detailed information about each level
    if (courseDataState.levels[0]?.data) {
      courseDataState.levels[0].data.forEach((level, idx) => {
        const exercisesForLevel = courseDataState.exercises.find(e => e.childId === level._id);
        console.log(`Level ${idx + 1} (${level._id}):`, {
          exercisesIds: level.exercisesIds,
          exercisesIdsCount: level.exercisesIds?.length || 0,
          exercisesInState: exercisesForLevel?.data || [],
          exercisesInStateCount: exercisesForLevel?.data?.length || 0
        });
      });
    }
    
    // Initialize expanded state for all available levels
    const expanded: Record<string, boolean> = {};
    availableLevelData.forEach(level => {
      expanded[level._id] = true;
    });
    setExpandedLevels(prev => ({...prev, ...expanded}));
  }, [courseDataState.levels, courseDataState.exercises]); // Depend on both levels and exercises
  
  const toggleLevel = (levelId: string) => {
    setExpandedLevels(prev => ({
      ...prev,
      [levelId]: !prev[levelId]
    }));
  };
  
  const handleDeleteLevel = (levelId: string, levelIndex?: number) => {
    updateSyllabusFieldId(levelId);
    if (levelIndex !== undefined) {
      updateSyllabusFieldIndex(levelIndex);
    }
    updateSelectedPopup(PopupsTypes.DELETE_LEVEL);
  };

  const handleAddExercise = (levelId: string, levelIndex: number) => {
    updateSyllabusFieldId(levelId);
    updateSyllabusFieldIndex(levelIndex);
    updateSelectedPopup(PopupsTypes.ADD_EXERCISES);
  };

  const handleDeleteExercise = async (levelId: string, exerciseId: string) => {
    try {
      console.log('handleDeleteExercise called with:', { levelId, exerciseId });
      
      setDeletingExercises(prev => ({ ...prev, [exerciseId]: true }));
      
      const success = await removeExerciseFromLevel(levelId, exerciseId);

      if (success) {
        addAlert('Exercise removed successfully', AlertSizes.small);
        
        // Update the course data state to reflect the change
        // Remove the exercise from the exercises list for this level
        const updatedExercises = courseDataState.exercises.map(exerciseGroup => {
          if (exerciseGroup.childId === levelId) {
            return {
              ...exerciseGroup,
              data: exerciseGroup.data.filter(exercise => exercise._id !== exerciseId)
            };
          }
          return exerciseGroup;
        });
        
        courseDataDispatch({
          type: CourseDataActionsList.SET_EXERCISES,
          payload: updatedExercises
        });
        
      } else {
        addAlert('Failed to remove exercise', AlertSizes.small);
      }
    } catch (error) {
      console.error('Error removing exercise:', error);
      addAlert('Error removing exercise', AlertSizes.small);
    } finally {
      setDeletingExercises(prev => ({ ...prev, [exerciseId]: false }));
    }
  };

  // Make sure we have data before rendering
  if (!availableLevelData.length) {
    console.log("No levels to display - availableLevelData is empty");
    return <div>No levels to display.</div>;
  }

  // Show all available levels
  return (
    <div className="flex flex-col gap-4 px-4">
      {availableLevelData.map((level: LevelType, idx: number) => {
        const isExpanded = expandedLevels[level._id] || false;
        const exercisesList = courseDataState.exercises.find((e) => e.childId === level._id)?.data || [];
        const exercisesCount = exercisesList.length;
        
        // Debug logging
        console.log(`Level ${idx + 1} (${level._id}):`, {
          exercisesIds: level.exercisesIds,
          exercisesIdsCount: level.exercisesIds?.length || 0,
          exercisesList: exercisesList,
          exercisesListCount: exercisesCount,
          allExercisesInState: courseDataState.exercises
        });
        
        return (
          <div key={level._id} className="mb-6 border border-duoGrayDark-lighter rounded-lg overflow-hidden shadow-sm mx-2">
            <div 
              className="flex items-center justify-between bg-duoBlueDark-darkest p-4 cursor-pointer"
              onClick={() => toggleLevel(level._id)}
            >
              <div className="flex items-center">
                <span className="text-lg font-bold text-white mr-2">Level {idx + 1}</span>
                <span className="text-sm bg-duoGreen-dark text-white px-2 py-0.5 rounded-full">{exercisesCount} exercises</span>
              </div>
              <div className="flex items-center">
                {exercisesCount === 0 && (
                  <button 
                    onClick={(e) => {e.stopPropagation(); handleDeleteLevel(level._id, idx);}}
                    className="p-2 mx-1 rounded-full hover:bg-duoRed-default text-white bg-duoRed-default/80"
                    title="Delete empty level"
                  >
                    <TiTrash size={20} />
                  </button>
                )}
                {isExpanded ? <TiArrowSortedUp size={20} className="text-white" /> : <TiArrowSortedDown size={20} className="text-white" />}
              </div>
            </div>
            
            {isExpanded && (
              <div className="bg-duoGray-lightest p-4">
                {exercisesList.length > 0 ? (
                  <div className="ml-4">
                    {exercisesList.map((exercise: any, exIdx: number) => (
                      <div key={exercise._id} className="mb-3 border-l-4 border-duoGreen-light pl-4 py-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="font-medium text-duoGray-darkest">Exercise {exIdx + 1}</span>
                            <span className="text-sm text-duoGray-dark">({exercise.type})</span>
                          </div>
                          <button
                            onClick={() => handleDeleteExercise(level._id, exercise._id)}
                            disabled={deletingExercises[exercise._id]}
                            className={`p-1 rounded-full text-red-600 hover:bg-red-100 hover:text-red-800 transition-colors ${
                              deletingExercises[exercise._id] ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                            }`}
                            title="Delete exercise"
                          >
                            <TiMinus size={18} />
                          </button>
                        </div>
                        {exercise.adminComments && (
                          <div className="mt-1 text-sm text-duoGray-dark italic">
                            {exercise.adminComments}
                          </div>
                        )}
                      </div>
                    ))}
                    <button 
                      onClick={() => handleAddExercise(level._id, idx)}
                      className="mt-2 text-sm flex items-center text-duoGreen-darkText hover:text-duoGreen-button">
                      <TiPlus size={16} className="mr-1" /> Add exercise
                    </button>
                  </div>
                ) : (
                  <div className="text-duoGray-darkText italic text-center py-4">
                    No exercises yet. Add your first exercise to this level.
                    <div className="mt-2">
                      <button 
                        onClick={() => handleAddExercise(level._id, idx)}
                        className="px-3 py-1 bg-duoYellow-lighter text-duoYellow-darkest rounded-lg hover:bg-duoYellow-light flex items-center mx-auto">
                        <TiPlus size={16} className="mr-1" /> Add first exercise
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
      
      <div className="mt-4 flex justify-center">
        {/* <RoundButton label="Add Level" Icon={TiPlus} onClick={addLevel} className="text-white" /> */}
      </div>
    </div>
  );
};

export default AdminLevel; 