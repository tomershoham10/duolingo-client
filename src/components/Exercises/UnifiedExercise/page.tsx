'use client';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCheck, faVolumeUp, faImage } from '@fortawesome/free-solid-svg-icons';
import { FsaType, SpotreccType, ExerciseType, ExercisesTypes, TargetType, FileTypes, AudioPlayerSizes } from '@/app/types.d';
import { getEncryptedFileByName } from '@/app/API/files-service/functions';
import { getTargetsList } from '@/app/API/classes-service/(dropdowns)/targets/functions';
import AudioPlayer from '@/components/AudioPlayer/page';

interface UnifiedExerciseProps {
  exercise: ExerciseType;
  onComplete: (score: number, answers: string[]) => void;
  onExit: () => void;
}

const UnifiedExercise: React.FC<UnifiedExerciseProps> = ({ exercise, onComplete, onExit }) => {
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [selectedTarget, setSelectedTarget] = useState<string>('');
  const [availableTargets, setAvailableTargets] = useState<TargetType[]>([]);
  const [exerciseStarted, setExerciseStarted] = useState(false);
  const [exerciseCompleted, setExerciseCompleted] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [currentSubExerciseIndex, setCurrentSubExerciseIndex] = useState(0);
  
  const isAudioExercise = exercise.type === ExercisesTypes.FSA;
  const isImageExercise = exercise.type === ExercisesTypes.SPOTRECC;

  // Get current file route based on exercise type
  const getCurrentFileRoute = () => {
    if (isAudioExercise) {
      return (exercise as FsaType).fileRoute;
    } else if (isImageExercise) {
      const spotreccExercise = exercise as SpotreccType;
      return spotreccExercise.subExercises[currentSubExerciseIndex]?.fileRoute;
    }
    return null;
  };

  useEffect(() => {
    // Load file (audio or image)
    const loadFile = async () => {
      console.log('=== EXERCISE DEBUG INFO ===');
      console.log('Full exercise object:', exercise);
      console.log('Exercise type:', exercise.type);
      console.log('Exercise ID:', exercise._id);
      
      const fileRoute = getCurrentFileRoute();
      console.log('File route from getCurrentFileRoute():', fileRoute);
      
      if (!fileRoute) {
        console.error('No file route found for exercise');
        console.log('Available exercise properties:', Object.keys(exercise));
        if (isAudioExercise) {
          console.log('FSA exercise cast:', exercise as FsaType);
        }
        return;
      }

      console.log('Loading file with route:', fileRoute);
      console.log('Exercise type:', exercise.type);

      try {
        const fileData = await getEncryptedFileByName(
          fileRoute.fileType,
          exercise.type,
          fileRoute.objectName
        );
        
        console.log('File data received:', fileData ? 'Success' : 'Failed');
        console.log('File URL type:', typeof fileData);
        console.log('File URL length:', fileData?.length);
        console.log('File URL preview:', fileData?.substring(0, 100));
        
        if (fileData) {
          setFileUrl(fileData);
          console.log('File URL set successfully');
          
          // Test if the URL is valid by trying to fetch it
          try {
            const testResponse = await fetch(fileData);
            console.log('File URL test response:', {
              status: testResponse.status,
              statusText: testResponse.statusText,
              contentType: testResponse.headers.get('content-type'),
              contentLength: testResponse.headers.get('content-length'),
              url: testResponse.url
            });
            
            // Try to get the blob to see if it's valid
            const blob = await testResponse.blob();
            console.log('Blob info:', {
              size: blob.size,
              type: blob.type
            });
            
            // Test if we can create an audio element with this blob
            const audioTest = new Audio();
            audioTest.src = fileData;
            audioTest.addEventListener('loadedmetadata', () => {
              console.log('Audio test - metadata loaded, duration:', audioTest.duration);
            });
            audioTest.addEventListener('error', (e) => {
              console.error('Audio test - error:', e);
            });
            audioTest.load();
            
          } catch (testError) {
            console.error('File URL test failed:', testError);
          }
        } else {
          console.error('No file data received from API');
        }
      } catch (error) {
        console.error('Error loading file:', error);
      }
    };

    // Load available targets
    const loadTargets = async () => {
      try {
        const targets = await getTargetsList();
        if (targets) {
          setAvailableTargets(targets);
        }
      } catch (error) {
        console.error('Error loading targets:', error);
        // Fallback to default targets
        setAvailableTargets([
          { _id: '1', name: 'Submarine', organization: [], father: '', children: [], level: 1, created: new Date(), updated: new Date() },
          { _id: '2', name: 'Frigate', organization: [], father: '', children: [], level: 1, created: new Date(), updated: new Date() },
          { _id: '3', name: 'Cargo Ship', organization: [], father: '', children: [], level: 1, created: new Date(), updated: new Date() },
          { _id: '4', name: 'Tugboat', organization: [], father: '', children: [], level: 1, created: new Date(), updated: new Date() },
          { _id: '5', name: 'Coast Patrol', organization: [], father: '', children: [], level: 1, created: new Date(), updated: new Date() },
          { _id: '6', name: 'Unknown Contact', organization: [], father: '', children: [], level: 1, created: new Date(), updated: new Date() }
        ]);
      }
    };

    loadFile();
    loadTargets();
  }, [exercise, currentSubExerciseIndex]);



  const startExercise = () => {
    setExerciseStarted(true);
  };



  const handleTargetSelect = (targetId: string) => {
    if (exerciseCompleted) return;
    setSelectedTarget(targetId);
  };

  const submitAnswer = () => {
    if (!selectedTarget) return;

    // For now, we'll use a simple check - in a real app, this would check against the exercise's correct answer
    // You would need to add a correctTargetId field to the exercise types
    const selectedTargetName = availableTargets.find(t => t._id === selectedTarget)?.name || '';
    
    // Simple logic: if it contains "submarine" or "frigate", it's correct (this should be replaced with actual logic)
    const correct = selectedTargetName.toLowerCase().includes('submarine') || selectedTargetName.toLowerCase().includes('frigate');
    
    setIsCorrect(correct);
    setShowResult(true);
    setExerciseCompleted(true);
  };

  const handleContinue = () => {
    if (isImageExercise) {
      const spotreccExercise = exercise as SpotreccType;
      if (currentSubExerciseIndex < spotreccExercise.subExercises.length - 1) {
        // Move to next sub-exercise
        setCurrentSubExerciseIndex(prev => prev + 1);
        setSelectedTarget('');
        setShowResult(false);
        setExerciseCompleted(false);
        return;
      }
    }

    // Complete the exercise
    const score = isCorrect ? 100 : 0;
    const answers = [selectedTarget];
    onComplete(score, answers);
  };



  const getExerciseTitle = () => {
    if (isAudioExercise) return 'Audio Analysis Exercise';
    if (isImageExercise) {
      const spotreccExercise = exercise as SpotreccType;
      return `Image Analysis Exercise (${currentSubExerciseIndex + 1}/${spotreccExercise.subExercises.length})`;
    }
    return 'Exercise';
  };

  const getExerciseDescription = () => {
    if (isAudioExercise) {
      return (exercise as FsaType).description || 'Listen to the audio and identify the target.';
    }
    if (isImageExercise) {
      const spotreccExercise = exercise as SpotreccType;
      return spotreccExercise.subExercises[currentSubExerciseIndex]?.description || 'Analyze the image and identify the target.';
    }
    return '';
  };

  return (
    <div className="min-h-screen bg-duoGray-lightest dark:bg-duoGrayDark-darkest">
      {/* Header */}
      <div className="bg-white dark:bg-duoGrayDark-dark shadow-sm border-b border-duoGray-light dark:border-duoGrayDark-light">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <FontAwesomeIcon 
              icon={isAudioExercise ? faVolumeUp : faImage} 
              className="w-6 h-6 text-duoBlue-default" 
            />
            <h1 className="text-2xl font-bold text-duoGray-darkest dark:text-duoGrayDark-lightest">
              {getExerciseTitle()}
            </h1>
          </div>
          <button
            onClick={onExit}
            className="p-2 text-duoGray-dark dark:text-duoGrayDark-light hover:text-duoGray-darkest dark:hover:text-duoGrayDark-lightest transition-colors"
          >
            <FontAwesomeIcon icon={faTimes} className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {!exerciseStarted ? (
          /* Start Screen */
          <div className="text-center">
            <div className="bg-white dark:bg-duoGrayDark-dark rounded-xl shadow-sm border border-duoGray-light dark:border-duoGrayDark-light p-8 mb-8">
              <h2 className="text-xl font-bold text-duoGray-darkest dark:text-duoGrayDark-lightest mb-4">
                Ready to start?
              </h2>
              <p className="text-duoGray-dark dark:text-duoGrayDark-light mb-6">
                {getExerciseDescription()}
              </p>
              <button
                onClick={startExercise}
                className="bg-duoGreen-default hover:bg-duoGreen-darker text-white px-8 py-3 rounded-xl font-bold text-lg transition-colors"
              >
                Start Exercise
              </button>
            </div>
          </div>
        ) : (
          /* Exercise Content */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Media Section */}
            <div className="bg-white dark:bg-duoGrayDark-dark rounded-xl shadow-sm border border-duoGray-light dark:border-duoGrayDark-light p-6">
              <h3 className="text-lg font-bold text-duoGray-darkest dark:text-duoGrayDark-lightest mb-4">
                {isAudioExercise ? 'Audio File' : 'Image File'}
              </h3>
              
              {isAudioExercise && fileUrl && (
                <div className="flex flex-col items-center gap-4">
                  <AudioPlayer
                    src={fileUrl}
                    size={AudioPlayerSizes.MEDIUM}
                    isPauseable={true}
                    isDisabled={false}
                    onPlay={() => console.log('Audio started playing')}
                  />
                  
                  {/* Debug Audio Element */}
                  <div className="w-full max-w-md">
                    <p className="text-sm text-duoGray-dark dark:text-duoGrayDark-light mb-2">
                      Debug Audio Controls:
                    </p>
                    <audio 
                      controls 
                      src={fileUrl}
                      className="w-full"
                      onLoadStart={() => console.log('Audio load started')}
                      onCanPlay={() => console.log('Audio can play')}
                      onError={(e) => console.error('Audio error:', e)}
                      onLoadedData={() => console.log('Audio data loaded')}
                      onLoadedMetadata={() => console.log('Audio metadata loaded')}
                    >
                      Your browser does not support the audio element.
                    </audio>
                    <p className="text-xs text-duoGray-dark dark:text-duoGrayDark-light mt-1">
                      File URL: {fileUrl.substring(0, 50)}...
                    </p>
                  </div>
                </div>
              )}

              {isImageExercise && fileUrl && (
                <div className="bg-duoGray-lightest dark:bg-duoGrayDark-darkest rounded-lg p-4">
                  <img
                    src={fileUrl}
                    alt="Exercise image"
                    className="w-full h-auto max-h-96 object-contain rounded-lg"
                  />
                </div>
              )}

              {!fileUrl && (
                <div className="bg-duoGray-lightest dark:bg-duoGrayDark-darkest rounded-lg p-8 text-center">
                  <p className="text-duoGray-dark dark:text-duoGrayDark-light">Loading file...</p>
                </div>
              )}
            </div>

            {/* Target Selection Section */}
            <div className="bg-white dark:bg-duoGrayDark-dark rounded-xl shadow-sm border border-duoGray-light dark:border-duoGrayDark-light p-6">
              <h3 className="text-lg font-bold text-duoGray-darkest dark:text-duoGrayDark-lightest mb-4">
                Select Target
              </h3>
              
              <p className="text-duoGray-dark dark:text-duoGrayDark-light mb-6">
                {isAudioExercise ? 'What do you hear in the audio?' : 'What do you see in the image?'}
              </p>

              <div className="space-y-3 mb-6">
                {availableTargets.map((target) => (
                  <button
                    key={target._id}
                    onClick={() => handleTargetSelect(target._id)}
                    disabled={exerciseCompleted}
                    className={`w-full p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                      selectedTarget === target._id
                        ? 'bg-duoGreen-lightest dark:bg-duoGreen-darker border-duoGreen-default text-duoGreen-darkest dark:text-white'
                        : 'bg-duoGray-lightest dark:bg-duoGrayDark-darkest border-duoGray-light dark:border-duoGrayDark-light text-duoGray-darkest dark:text-duoGrayDark-lightest hover:border-duoGray-default dark:hover:border-duoGrayDark-default'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{target.name}</span>
                      {selectedTarget === target._id && (
                        <FontAwesomeIcon icon={faCheck} className="w-5 h-5 text-duoGreen-default" />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {selectedTarget && !exerciseCompleted && (
                <button
                  onClick={submitAnswer}
                  className="w-full bg-duoBlue-default hover:bg-duoBlue-darker text-white py-3 px-6 rounded-lg font-bold transition-colors"
                >
                  Submit Answer
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Result Modal */}
      {showResult && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-duoGrayDark-dark rounded-xl shadow-xl max-w-md w-full p-8">
            <div className="text-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                isCorrect ? 'bg-duoGreen-default' : 'bg-duoRed-default'
              }`}>
                <FontAwesomeIcon 
                  icon={isCorrect ? faCheck : faTimes} 
                  className="w-8 h-8 text-white" 
                />
              </div>
              
              <h3 className="text-2xl font-bold text-duoGray-darkest dark:text-duoGrayDark-lightest mb-2">
                {isCorrect ? 'Correct!' : 'Incorrect'}
              </h3>
              
              <p className="text-duoGray-dark dark:text-duoGrayDark-light mb-6">
                {isCorrect 
                  ? 'Great job! You identified the target correctly.' 
                  : 'That\'s not quite right. Keep practicing!'
                }
              </p>
              
              <button
                onClick={handleContinue}
                className={`w-full py-3 px-6 rounded-lg font-bold transition-colors ${
                  isCorrect 
                    ? 'bg-duoGreen-default hover:bg-duoGreen-darker text-white'
                    : 'bg-duoBlue-default hover:bg-duoBlue-darker text-white'
                }`}
              >
                {isImageExercise && currentSubExerciseIndex < (exercise as SpotreccType).subExercises.length - 1 
                  ? 'Next Image' 
                  : 'Continue'
                }
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UnifiedExercise; 