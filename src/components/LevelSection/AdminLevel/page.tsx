'use client';
import React, { useEffect, useState } from 'react';
import { CourseDataType, CourseDataAction, CourseDataActionsList } from '@/reducers/courseDataReducer';
import { LevelType } from '@/types/level';
import { TiPlus, TiEdit, TiTrash, TiArrowSortedDown, TiArrowSortedUp } from 'react-icons/ti';
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
  const [levelIds, setLevelIds] = useState<string[]>([]);
  const [expandedLevels, setExpandedLevels] = useState<Record<string, boolean>>({});
  
  useEffect(() => {
    console.log('RENDER - courseDataState:', courseDataState);
    console.log('LEVELS LENGTH:', courseDataState.levels.length);
    if (courseDataState.levels.length > 0) {
      console.log('FIRST LEVEL GROUP DATA LENGTH:', courseDataState.levels[0].data.length);
      console.log('LEVELS DATA:', courseDataState.levels[0].data);
    }
    
    // If we have a selectedCourse with levelsIds, use those
    if (selectedCourse?.levelsIds && selectedCourse.levelsIds.length > 0) {
      console.log('Using levelsIds from selectedCourse:', selectedCourse.levelsIds);
      setLevelIds(selectedCourse.levelsIds);
      
      // Initialize expanded state for all levels (default to expanded)
      const expanded: Record<string, boolean> = {};
      selectedCourse.levelsIds.forEach(id => {
        expanded[id] = true;
      });
      setExpandedLevels(prev => ({...prev, ...expanded}));
    } else if (courseDataState.levels.length > 0 && courseDataState.levels[0].data.length > 0) {
      // Otherwise fall back to the levels data we have
      const ids = courseDataState.levels[0].data.map(level => level._id);
      console.log('Using level IDs from courseDataState:', ids);
      setLevelIds(ids);
      
      // Initialize expanded state for all levels (default to expanded)
      const expanded: Record<string, boolean> = {};
      ids.forEach(id => {
        expanded[id] = true;
      });
      setExpandedLevels(prev => ({...prev, ...expanded}));
    }
  }, [courseDataState, selectedCourse]);

  const addLevel = async () => {
    try {
      const status = await pRetry(
        () => createByCourse(courseDataState.courseId!),
        {
          retries: 5,
        }
      );

      if (status) {
        addAlert('Level added successfully', AlertSizes.small);
      } else {
        addAlert('Failed to add level', AlertSizes.small);
      }
    } catch (error) {
      console.error('Error adding level:', error);
      addAlert('Error adding level', AlertSizes.small);
    }
  };
  
  const toggleLevel = (levelId: string) => {
    setExpandedLevels(prev => ({
      ...prev,
      [levelId]: !prev[levelId]
    }));
  };
  
  const handleEditLevel = (levelId: string) => {
    // This would trigger your edit level popup/function
    addAlert('Edit level functionality coming soon', AlertSizes.small);
  };
  
  const handleDeleteLevel = (levelId: string, levelIndex?: number) => {
    // Set the level ID and index in the InfoBar store
    updateSyllabusFieldId(levelId);
    if (levelIndex !== undefined) {
      updateSyllabusFieldIndex(levelIndex);
    }
    
    // Open the delete level popup
    updateSelectedPopup(PopupsTypes.DELETE_LEVEL);
  };

  // Make sure we have data before rendering
  if ((!courseDataState.levels.length || !courseDataState.levels[0].data.length) && !levelIds.length) {
    return <div>No levels to display</div>;
  }

  const renderedLevelIds = new Set();

  return (
    <div className="flex flex-col gap-4">
      {/* First render any levels from courseDataState */}
      {courseDataState.levels[0]?.data.map((level: LevelType, idx: number) => {
        renderedLevelIds.add(level._id);
        const isExpanded = expandedLevels[level._id] || false;
        const lessonsCount = level.lessonsIds?.length || 0;
        const lessonsList = courseDataState.lessons.find((l) => l.fatherId === level._id)?.data || [];
        
        return (
          <div key={level._id} className="mb-6 border border-duoGray-light rounded-lg overflow-hidden shadow-sm">
            <div 
              className="flex items-center justify-between bg-duoBlueDark-darkest p-4 cursor-pointer"
              onClick={() => toggleLevel(level._id)}
            >
              <div className="flex items-center">
                <span className="text-lg font-bold text-white mr-2">Level {idx + 1}</span>
                <span className="text-sm bg-duoGreen-dark text-white px-2 py-0.5 rounded-full">{lessonsCount} lessons</span>
              </div>
              <div className="flex items-center">
                <button 
                  onClick={(e) => {e.stopPropagation(); handleEditLevel(level._id);}}
                  className="p-2 mx-1 rounded-full hover:bg-duoGreen-darker text-white"
                >
                  <TiEdit size={20} />
                </button>
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
                {lessonsList.length > 0 ? (
                  <div className="ml-4">
                    {lessonsList.map((lesson) => (
                      <div key={lesson._id} className="mb-3 border-l-4 border-duoGreen-light pl-4 py-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-duoGray-darkest">{lesson.name}</span>
                          <div className="text-xs bg-duoGray-lighter px-2 py-1 rounded text-duoGray-darkText">
                            {lesson.exercisesIds?.length || 0} exercises
                          </div>
                        </div>
                        
                        <div className="mt-2 pl-4">
                          {courseDataState.exercises
                            .find((e) => e.fatherId === lesson._id)
                            ?.data.map((exercise, exIdx) => (
                              <div key={exercise._id} className="py-1 text-sm text-duoGray-darkText">
                                <span>Exercise {exIdx + 1}: {exercise._id.substring(0, 8)}...</span>
                              </div>
                            ))}
                        </div>
                      </div>
                    ))}
                    <button className="mt-2 text-sm flex items-center text-duoGreen-darkText hover:text-duoGreen-button">
                      <TiPlus size={16} className="mr-1" /> Add lesson
                    </button>
                  </div>
                ) : (
                  <div className="text-duoGray-darkText italic text-center py-4">
                    No lessons yet. Add your first lesson to this level.
                    <div className="mt-2">
                      <button className="px-3 py-1 bg-duoYellow-lighter text-duoYellow-darkest rounded-lg hover:bg-duoYellow-light flex items-center mx-auto">
                        <TiPlus size={16} className="mr-1" /> Add first lesson
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
      
      {/* Then render any additional level IDs from selectedCourse */}
      {levelIds
        .filter(id => !renderedLevelIds.has(id))
        .map((levelId, idx) => {
          const isExpanded = expandedLevels[levelId] || false;
          const additionalIdx = courseDataState.levels[0]?.data.length || 0;
          return (
            <div key={levelId} className="mb-6 border border-duoGray-light rounded-lg overflow-hidden shadow-sm">
              <div 
                className="flex items-center justify-between bg-gradient-to-r from-duoYellow-darkest to-duoYellow-dark p-4 cursor-pointer"
                onClick={() => toggleLevel(levelId)}
              >
                <div className="flex items-center">
                  <span className="text-lg font-bold text-white mr-2">
                    Level {additionalIdx + idx + 1}
                  </span>
                  <span className="text-sm bg-duoYellow-darker text-white px-2 py-0.5 rounded-full">ID: {levelId.substring(0, 6)}...</span>
                </div>
                <div className="flex items-center">
                  <button 
                    onClick={(e) => {e.stopPropagation(); handleEditLevel(levelId);}}
                    className="p-2 mx-1 rounded-full hover:bg-duoYellow-button text-white"
                  >
                    <TiEdit size={20} />
                  </button>
                  <button 
                    onClick={(e) => {e.stopPropagation(); handleDeleteLevel(levelId, additionalIdx + idx);}}
                    className="p-2 mx-1 rounded-full hover:bg-duoYellow-button text-white"
                  >
                    <TiTrash size={20} />
                  </button>
                  {isExpanded ? <TiArrowSortedUp size={20} className="text-white" /> : <TiArrowSortedDown size={20} className="text-white" />}
                </div>
              </div>
              {isExpanded && (
                <div className="bg-duoGray-lightest p-4">
                  <div className="text-duoGray-darkText italic text-center py-4">
                    No lesson data available for this level.
                    <div className="mt-2">
                      <button className="px-3 py-1 bg-duoYellow-lighter text-duoYellow-darkest rounded-lg hover:bg-duoYellow-light flex items-center mx-auto">
                        <TiPlus size={16} className="mr-1" /> Add first lesson
                      </button>
                    </div>
                  </div>
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