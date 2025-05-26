'use client';
import { useEffect, useReducer, useRef } from 'react';
import { useUserStore } from '@/app/store/stores/useUserStore';
import { useStore } from 'zustand';
import StudentLevelSection from '@/components/LevelSection/StudentLevel/page';
import {
  CourseDataActionsList,
  courseDataReducer,
  CourseDataType,
} from '@/reducers/courseDataReducer';
import useCourseData from '@/app/_utils/hooks/useCourseData';
import { LevelType, ExerciseType } from '@/app/types.d';

const LearnPage: React.FC = () => {
  const userId = useStore(useUserStore, (state) => state.userId);
  const courseId = useStore(useUserStore, (state) => state.courseId);
  const nextLessonId = useStore(useUserStore, (state) => state.nextLessonId);

  const initialCourseDataState: CourseDataType = {
    courseId: null,
    levels: [{ childId: null, data: [] }],
    exercises: [{ childId: null, data: [] }],
    results: [],
  };

  const [courseDataState, courseDataDispatch] = useReducer(
    courseDataReducer,
    initialCourseDataState
  );

  // Use a ref to track if data has been fetched
  const dataFetchedRef = useRef(false);

  // Update course ID when it changes
  useEffect(() => {
    if (courseId) {
      courseDataDispatch({
        type: CourseDataActionsList.SET_COURSE_ID,
        payload: courseId,
      });
    }
  }, [courseId]);

  const { fetchCourseData } = useCourseData(
    userId,
    courseDataState,
    courseDataDispatch
  );

  // Fetch data when course ID changes
  useEffect(() => {
    if (courseDataState.courseId && !dataFetchedRef.current) {
      dataFetchedRef.current = true;
      fetchCourseData()
        .then(() => {
          console.log("Course data fetch complete for student");
        })
        .catch(err => {
          console.error("Error fetching course data:", err);
          dataFetchedRef.current = false; // Reset so we can try again
        });
    }
  }, [courseDataState.courseId, fetchCourseData]);

  // Log the state whenever it changes
  useEffect(() => {
    console.log("Student courseDataState:", courseDataState);
    if (courseDataState.levels && courseDataState.levels[0]) {
      console.log("Student levels data:", courseDataState.levels[0].data);
      console.log("Number of levels:", courseDataState.levels[0].data.length);
    }
  }, [courseDataState]);

  // Determine level status based on student progress
  const getLevelStatus = (level: LevelType, levelIndex: number) => {
    // For now, we'll use simple logic based on nextLessonId
    // This can be enhanced with actual progress tracking
    
    // Find exercises for this level
    const exercisesForLevel = courseDataState.exercises.find(
      e => e.childId === level._id
    )?.data || [];

    // If no nextLessonId, first level is current, rest are locked
    if (!nextLessonId) {
      return {
        isLocked: levelIndex > 0,
        isFinished: false,
        isCurrentLevel: levelIndex === 0,
      };
    }

    // Check if any exercise in this level matches nextLessonId
    const hasCurrentExercise = exercisesForLevel.some(
      exercise => exercise._id === nextLessonId
    );

    if (hasCurrentExercise) {
      return {
        isLocked: false,
        isFinished: false,
        isCurrentLevel: true,
      };
    }

    // If nextLessonId exists but not in this level:
    // - First level should be current if no other level has the nextLessonId
    // - Other levels should be locked for now
    if (levelIndex === 0) {
      return {
        isLocked: false,
        isFinished: false,
        isCurrentLevel: true,
      };
    }

    return {
      isLocked: true,
      isFinished: false,
      isCurrentLevel: false,
    };
  };

  const availableLevels = courseDataState.levels[0]?.data || [];

  if (!courseId) {
    return (
      <div className='flex h-full w-full items-center justify-center'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold text-duoGray-darkest dark:text-duoGrayDark-lightest mb-4'>
            No Course Assigned
          </h2>
          <p className='text-duoGray-dark dark:text-duoGrayDark-light'>
            Please contact your instructor to be assigned to a course.
          </p>
        </div>
      </div>
    );
  }

  if (availableLevels.length === 0) {
    return (
      <div className='flex h-full w-full items-center justify-center'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold text-duoGray-darkest dark:text-duoGrayDark-lightest mb-4'>
            Loading Course...
          </h2>
          <p className='text-duoGray-dark dark:text-duoGrayDark-light'>
            Fetching your course content...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='flex w-full flex-col items-center justify-start min-h-screen bg-gradient-to-b from-duoBlue-lightest to-white dark:from-duoGrayDark-darkest dark:to-duoGrayDark-dark'>
      <div className='w-full max-w-4xl px-4 py-8'>

        {/* Levels List */}
        <div className='space-y-8'>
          {availableLevels.map((level: LevelType, levelIndex: number) => {
            const exercisesForLevel = courseDataState.exercises.find(
              e => e.childId === level._id
            )?.data || [];

            const { isLocked, isFinished, isCurrentLevel } = getLevelStatus(level, levelIndex);

            // TODO: Get actual progress from user data/API
            // For now, using mock data for demonstration
            const completedExercises: string[] = []; // This should come from user progress API
            const currentExerciseId = isCurrentLevel && exercisesForLevel.length > 0 
              ? exercisesForLevel[0]._id 
              : nextLessonId || undefined;

            return (
              <div key={level._id} className='w-full'>
                <StudentLevelSection
                  level={level}
                  levelIndex={levelIndex}
                  exercises={exercisesForLevel}
                  isLocked={isLocked}
                  isFinished={isFinished}
                  isCurrentLevel={isCurrentLevel}
                  completedExercises={completedExercises}
                  currentExerciseId={currentExerciseId}
                />
              </div>
            );
          })}
        </div>

        
      </div>
    </div>
  );
};

export default LearnPage;
