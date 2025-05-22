'use client';
import React, { useEffect, useState, useMemo } from 'react';
import { CourseDataType, CourseDataAction, CourseDataActionsList } from '@/reducers/courseDataReducer';
import { LevelType, ExerciseType } from '@/app/types';

import { TiPlus, TiTrash, TiArrowSortedDown, TiArrowSortedUp } from 'react-icons/ti';
import RoundButton from '@/components/RoundButton';
import { createByCourse, updateLevel } from '@/app/API/classes-service/levels/functions';
import { AlertSizes, useAlertStore } from '@/app/store/stores/useAlertStore';
import pRetry from 'p-retry';
import useStore from '@/app/store/useStore';
import { useCourseStore } from '@/app/store/stores/useCourseStore';
import { usePopupStore, PopupsTypes } from '@/app/store/stores/usePopupStore';
import { useInfoBarStore } from '@/app/store/stores/useInfoBarStore';
import { getExercisesByModelId, getExerciseById } from '@/app/API/classes-service/exercises/functions';

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
  const [levelExercises, setLevelExercises] = useState<Record<string, ExerciseType[]>>({});
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});
  
  // Use useMemo for derived values to prevent recalculation on every render
  const availableLevelData = useMemo(() => courseDataState.levels[0]?.data || [], [courseDataState.levels]);
  
  // Fetch exercises for each level
  useEffect(() => {
    const fetchLevelExercises = async () => {
      const exercisesMap: Record<string, ExerciseType[]> = {};
      for (const level of availableLevelData) {
        if (level.exercisesIds?.length) {
          try {
            const exercises: ExerciseType[] = [];
            for (const exId of level.exercisesIds) {
              const exercise = await getExerciseById(exId);
              if (exercise) exercises.push(exercise);
            }
            exercisesMap[level._id] = exercises;
          } catch (error) {
            console.error(`Error fetching exercises for level ${level._id}:`, error);
          }
        } else {
          exercisesMap[level._id] = [];
        }
      }
      setLevelExercises(exercisesMap);
    };
    fetchLevelExercises();
  }, [availableLevelData]);
  
  // Log state changes only when dependencies actually change
  useEffect(() => {
    console.log('RENDER - courseDataState levels updated:', courseDataState.levels[0]?.data?.length || 0, 'levels');
    
    // Initialize expanded state for all available levels
    const expanded: Record<string, boolean> = {};
    availableLevelData.forEach(level => {
      expanded[level._id] = true;
    });
    setExpandedLevels(prev => ({...prev, ...expanded}));
  }, [courseDataState.levels]); // Only depend on levels array, not derived values
  
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

  // Function to remove an exercise from a level
  const handleRemoveExercise = async (levelId: string, exerciseId: string) => {
    try {
      setIsLoading(prev => ({ ...prev, [exerciseId]: true }));
      
      // Get the current level data
      const level = availableLevelData.find(l => l._id === levelId);
      if (!level) {
        throw new Error('Level not found');
      }
      
      // Filter out the exercise ID from exercisesIds array
      const updatedExercisesIds = level.exercisesIds?.filter(id => id !== exerciseId) || [];
      
      // Update the level using the API function
      const success = await updateLevel({
        _id: levelId,
        exercisesIds: updatedExercisesIds
      });
      
      if (!success) {
        throw new Error('Failed to update level');
      }
      
      // Update local state to reflect the change
      setLevelExercises(prev => {
        const updated = {...prev};
        if (updated[levelId]) {
          updated[levelId] = updated[levelId].filter(ex => ex._id !== exerciseId);
        }
        return updated;
      });
      
      // Optionally update the availableLevelData if needed
      if (courseDataDispatch) {
        // We need to update our state to reflect the change
        // Since SET_LEVELS is the closest action we have, we'll use that
        // Get current levels
        const currentLevels = [...courseDataState.levels];
        
        // Find and update the level with the new exercisesIds
        const updatedLevels = currentLevels.map(levelData => {
          if (levelData.childId === levelId) {
            return {
              ...levelData,
              data: levelData.data.map(l => {
                if (l._id === levelId) {
                  return { ...l, exercisesIds: updatedExercisesIds };
                }
                return l;
              })
            };
          }
          return levelData;
        });
        
        courseDataDispatch({
          type: CourseDataActionsList.SET_LEVELS,
          payload: updatedLevels
        });
      }
      
      // Show success message
      addAlert(
        'Exercise removed successfully',
        AlertSizes.small,
      );
      
      // Force a page reload to ensure all data is refreshed 
      // and UI is properly updated (just like in level deletion)
      window.location.reload();
      
    } catch (error: any) {
      console.error('Error removing exercise:', error);
      addAlert(
        `Error removing exercise: ${error.message}`,
        AlertSizes.small,
      );
    } finally {
      setIsLoading(prev => ({ ...prev, [exerciseId]: false }));
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
        const exercisesList = levelExercises[level._id] || [];
        const exercisesCount = exercisesList.length;
        
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
                
                <button 
                  onClick={(e) => {e.stopPropagation(); handleDeleteLevel(level._id, idx);}}
                  className="p-2 mx-1 rounded-full hover:bg-duoGreen-darker text-white"
                >
                  <TiTrash size={20} />
                </button>
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
                          <span className="font-medium text-duoGray-darkest">Exercise {exIdx + 1}</span>
                          <div className="flex items-center">
                            <div className="text-xs bg-duoGray-lighter px-2 py-1 rounded text-duoGray-darkText mr-2">
                              {exercise._id.substring(0, 8)}...
                            </div>
                            <button 
                              onClick={() => handleRemoveExercise(level._id, exercise._id)}
                              className="p-1 rounded-full hover:bg-duoRed-lighter text-duoRed-darkest"
                              disabled={isLoading[exercise._id]}
                            >
                              <TiTrash size={16} />
                            </button>
                          </div>
                        </div>
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