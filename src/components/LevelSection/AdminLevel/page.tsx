'use client';
import React, { useEffect, useState, useMemo } from 'react';
import { CourseDataType, CourseDataAction, CourseDataActionsList } from '@/reducers/courseDataReducer';
import { LevelType } from '@/app/types';

import { TiPlus, TiTrash, TiArrowSortedDown, TiArrowSortedUp } from 'react-icons/ti';
import RoundButton from '@/components/RoundButton';
import { createByCourse } from '@/app/API/classes-service/levels/functions';
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
                          <div className="text-xs bg-duoGray-lighter px-2 py-1 rounded text-duoGray-darkText">
                            {exercise._id.substring(0, 8)}...
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