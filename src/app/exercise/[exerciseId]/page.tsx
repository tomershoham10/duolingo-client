'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getExerciseById } from '@/app/API/classes-service/exercises/functions';
import { ExerciseType } from '@/app/types.d';
import UnifiedExercise from '@/components/Exercises/UnifiedExercise/page';
import LoadingSkeleton from '@/components/Loading/LoadingSkeleton';

const ExercisePage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const exerciseId = params.exerciseId as string;
  
  const [exercise, setExercise] = useState<ExerciseType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExercise = async () => {
      try {
        setLoading(true);
        const exerciseData = await getExerciseById(exerciseId);
        
        if (!exerciseData) {
          setError('Exercise not found');
          return;
        }
        
        setExercise(exerciseData);
      } catch (err) {
        console.error('Error fetching exercise:', err);
        setError('Failed to load exercise');
      } finally {
        setLoading(false);
      }
    };

    if (exerciseId) {
      fetchExercise();
    }
  }, [exerciseId]);

  const handleExerciseComplete = (score: number, answers: string[]) => {
    // Handle exercise completion
    console.log('Exercise completed:', { exerciseId, score, answers });
    
    // Navigate back to learn page or next exercise
    router.push('/learn');
  };

  const handleExerciseExit = () => {
    // Handle exercise exit
    router.push('/learn');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-duoGray-lightest dark:bg-duoGrayDark-darkest">
        <LoadingSkeleton />
      </div>
    );
  }

  if (error || !exercise) {
    return (
      <div className="min-h-screen bg-duoGray-lightest dark:bg-duoGrayDark-darkest flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-duoGray-darkest dark:text-duoGrayDark-lightest mb-4">
            {error || 'Exercise not found'}
          </h1>
          <button
            onClick={() => router.push('/learn')}
            className="px-6 py-3 bg-duoBlue-default text-white rounded-lg hover:bg-duoBlue-darker transition-colors"
          >
            Back to Learn
          </button>
        </div>
      </div>
    );
  }

  // Render the unified exercise component
  const renderExercise = () => {
    return (
      <UnifiedExercise
        exercise={exercise}
        onComplete={handleExerciseComplete}
        onExit={handleExerciseExit}
      />
    );
  };

  return (
    <div className="min-h-screen bg-duoGray-lightest dark:bg-duoGrayDark-darkest">
      {renderExercise()}
    </div>
  );
};

export default ExercisePage; 