'use client';
import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faStop, faTimes, faCheck, faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { SpotreccType, ExerciseType } from '@/app/types.d';
import { getEncryptedFileByName } from '@/app/API/files-service/functions';

interface SpotreccExerciseProps {
  exercise: ExerciseType;
  onComplete: (score: number, answers: string[]) => void;
  onExit: () => void;
}

const SpotreccExercise: React.FC<SpotreccExerciseProps> = ({ exercise, onComplete, onExit }) => {
  const spotreccExercise = exercise as SpotreccType;
  const [currentSubExerciseIndex, setCurrentSubExerciseIndex] = useState(0);
  const [subExerciseAnswers, setSubExerciseAnswers] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [exerciseStarted, setExerciseStarted] = useState(false);
  const [exerciseCompleted, setExerciseCompleted] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [availableOptions, setAvailableOptions] = useState<string[]>([]);
  
  const exerciseTimerRef = useRef<NodeJS.Timeout | null>(null);
  const currentSubExercise = spotreccExercise.subExercises[currentSubExerciseIndex];

  useEffect(() => {
    // Load image for current sub-exercise
    const loadImage = async () => {
      if (!currentSubExercise) return;
      
      try {
        const imageData = await getEncryptedFileByName(
          currentSubExercise.fileRoute.fileType,
          spotreccExercise.type,
          currentSubExercise.fileRoute.objectName
        );
        
        if (imageData) {
          setImageUrl(imageData);
        }
      } catch (error) {
        console.error('Error loading image:', error);
      }
    };

    // Set up available options for recognition
    setAvailableOptions([
      'Submarine',
      'Surface Vessel',
      'Aircraft',
      'Torpedo',
      'Mine',
      'Debris',
      'Marine Life',
      'Unknown Object',
      'No Contact'
    ]);

    loadImage();
    setCurrentAnswer(''); // Reset answer for new sub-exercise
  }, [currentSubExerciseIndex, currentSubExercise, spotreccExercise.type]);

  const startExercise = () => {
    setExerciseStarted(true);
    startSubExerciseTimer();
  };

  const startSubExerciseTimer = () => {
    if (!currentSubExercise) return;
    
    const totalTime = currentSubExercise.exerciseTime + currentSubExercise.bufferTime;
    setTimeRemaining(totalTime);
    
    exerciseTimerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev === null || prev <= 1) {
          handleSubExerciseComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSubExerciseComplete = () => {
    if (exerciseTimerRef.current) {
      clearInterval(exerciseTimerRef.current);
    }

    // Save current answer
    const newAnswers = [...subExerciseAnswers];
    newAnswers[currentSubExerciseIndex] = currentAnswer || 'No Answer';
    setSubExerciseAnswers(newAnswers);

    // Move to next sub-exercise or complete
    if (currentSubExerciseIndex < spotreccExercise.subExercises.length - 1) {
      setCurrentSubExerciseIndex(prev => prev + 1);
      if (exerciseStarted) {
        // Small delay before starting next sub-exercise
        setTimeout(() => {
          startSubExerciseTimer();
        }, 1000);
      }
    } else {
      completeExercise(newAnswers);
    }
  };

  const completeExercise = (answers: string[] = subExerciseAnswers) => {
    if (exerciseCompleted) return;
    
    setExerciseCompleted(true);
    
    if (exerciseTimerRef.current) {
      clearInterval(exerciseTimerRef.current);
    }

    // Calculate score based on answered sub-exercises
    const answeredCount = answers.filter(answer => answer && answer !== 'No Answer').length;
    const score = Math.round((answeredCount / spotreccExercise.subExercises.length) * 100);
    
    onComplete(score, answers);
  };

  const handleAnswerSelect = (answer: string) => {
    if (exerciseCompleted) return;
    setCurrentAnswer(answer);
  };

  const handleManualNext = () => {
    if (currentSubExerciseIndex < spotreccExercise.subExercises.length - 1) {
      handleSubExerciseComplete();
    } else {
      completeExercise();
    }
  };

  const handleManualPrevious = () => {
    if (currentSubExerciseIndex > 0 && exerciseStarted) {
      if (exerciseTimerRef.current) {
        clearInterval(exerciseTimerRef.current);
      }
      
      setCurrentSubExerciseIndex(prev => prev - 1);
      setCurrentAnswer(subExerciseAnswers[currentSubExerciseIndex - 1] || '');
      startSubExerciseTimer();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-duoGreen-lightest to-duoGreen-default p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">SPOTRECC Exercise</h1>
          <p className="text-white/80">
            Sub-exercise {currentSubExerciseIndex + 1} of {spotreccExercise.subExercises.length}
          </p>
        </div>
        <div className="flex items-center gap-4">
          {timeRemaining !== null && exerciseStarted && (
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
              <span className="text-white font-bold">
                Time: {formatTime(timeRemaining)}
              </span>
            </div>
          )}
          <button
            onClick={onExit}
            className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-full transition-colors"
          >
            <FontAwesomeIcon icon={faTimes} className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Display Section */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">Image Analysis</h2>
          
          {currentSubExercise?.description && (
            <div className="bg-white/20 rounded-lg p-4 mb-6">
              <p className="text-white">{currentSubExercise.description}</p>
            </div>
          )}

          {imageUrl ? (
            <div className="bg-white/20 rounded-lg p-4 mb-4">
              <img
                src={imageUrl}
                alt={`Sub-exercise ${currentSubExerciseIndex + 1}`}
                className="w-full h-auto max-h-96 object-contain rounded-lg"
              />
            </div>
          ) : (
            <div className="bg-white/20 rounded-lg p-4 mb-4 h-96 flex items-center justify-center">
              <p className="text-white">Loading image...</p>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex justify-between items-center">
            <button
              onClick={handleManualPrevious}
              disabled={currentSubExerciseIndex === 0 || !exerciseStarted}
              className="bg-duoBlue-default hover:bg-duoBlue-darker disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4" />
              Previous
            </button>

            {!exerciseStarted && (
              <button
                onClick={startExercise}
                className="bg-duoGreen-default hover:bg-duoGreen-darker text-white py-3 px-6 rounded-lg font-bold text-lg transition-colors"
              >
                Start Exercise
              </button>
            )}

            <button
              onClick={handleManualNext}
              disabled={!exerciseStarted}
              className="bg-duoBlue-default hover:bg-duoBlue-darker disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              {currentSubExerciseIndex === spotreccExercise.subExercises.length - 1 ? 'Finish' : 'Next'}
              <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Recognition Options Section */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">Object Recognition</h2>
          
          <p className="text-white/80 mb-6">
            Analyze the image and select what you recognize:
          </p>

          <div className="grid grid-cols-1 gap-3 mb-6">
            {availableOptions.map((option) => (
              <button
                key={option}
                onClick={() => handleAnswerSelect(option)}
                disabled={!exerciseStarted || exerciseCompleted}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  currentAnswer === option
                    ? 'bg-duoGreen-default border-duoGreen-darker text-white'
                    : 'bg-white/20 border-white/30 text-white hover:bg-white/30'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{option}</span>
                  {currentAnswer === option && (
                    <FontAwesomeIcon icon={faCheck} className="w-5 h-5" />
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Progress Indicator */}
          <div className="bg-white/20 rounded-lg p-4">
            <div className="flex justify-between text-white text-sm mb-2">
              <span>Progress</span>
              <span>{currentSubExerciseIndex + 1} / {spotreccExercise.subExercises.length}</span>
            </div>
            <div className="w-full bg-white/30 rounded-full h-2">
              <div
                className="bg-white h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${((currentSubExerciseIndex + 1) / spotreccExercise.subExercises.length) * 100}%` 
                }}
              />
            </div>
          </div>

          {/* Current Answer Display */}
          {currentAnswer && (
            <div className="mt-4 p-4 bg-white/20 rounded-lg">
              <p className="text-white font-medium mb-2">Current selection:</p>
              <span className="bg-duoGreen-default text-white px-3 py-1 rounded-full text-sm">
                {currentAnswer}
              </span>
            </div>
          )}

          {/* Previous Answers */}
          {subExerciseAnswers.length > 0 && (
            <div className="mt-4 p-4 bg-white/20 rounded-lg">
              <p className="text-white font-medium mb-2">Previous answers:</p>
              <div className="space-y-1">
                {subExerciseAnswers.map((answer, index) => (
                  <div key={index} className="flex justify-between text-white text-sm">
                    <span>Sub-exercise {index + 1}:</span>
                    <span className="font-medium">{answer}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {exerciseCompleted && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-duoGreen-default rounded-full flex items-center justify-center mx-auto mb-4">
                <FontAwesomeIcon icon={faCheck} className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-duoGray-darkest mb-2">Exercise Complete!</h3>
              <p className="text-duoGray-dark mb-6">
                You completed {spotreccExercise.subExercises.length} sub-exercise{spotreccExercise.subExercises.length !== 1 ? 's' : ''}.
              </p>
              <div className="text-left mb-6 max-h-32 overflow-y-auto">
                <h4 className="font-semibold mb-2">Your answers:</h4>
                {subExerciseAnswers.map((answer, index) => (
                  <div key={index} className="flex justify-between text-sm mb-1">
                    <span>Sub-exercise {index + 1}:</span>
                    <span className="font-medium">{answer}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => {
                  const answeredCount = subExerciseAnswers.filter(answer => answer && answer !== 'No Answer').length;
                  const score = Math.round((answeredCount / spotreccExercise.subExercises.length) * 100);
                  onComplete(score, subExerciseAnswers);
                }}
                className="w-full bg-duoGreen-default hover:bg-duoGreen-darker text-white py-3 px-6 rounded-lg font-bold transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpotreccExercise; 