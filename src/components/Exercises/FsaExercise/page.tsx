'use client';
import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faStop, faTimes, faCheck } from '@fortawesome/free-solid-svg-icons';
import { FsaType, ExerciseType } from '@/app/types.d';
import { getEncryptedFileByName } from '@/app/API/files-service/functions';

interface FsaExerciseProps {
  exercise: ExerciseType;
  onComplete: (score: number, answers: string[]) => void;
  onExit: () => void;
}

const FsaExercise: React.FC<FsaExerciseProps> = ({ exercise, onComplete, onExit }) => {
  const fsaExercise = exercise as FsaType;
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [selectedTargets, setSelectedTargets] = useState<string[]>([]);
  const [availableTargets, setAvailableTargets] = useState<string[]>([]);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [exerciseStarted, setExerciseStarted] = useState(false);
  const [exerciseCompleted, setExerciseCompleted] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const exerciseTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Load audio file
    const loadAudio = async () => {
      try {
        const audioData = await getEncryptedFileByName(
          fsaExercise.fileRoute.fileType,
          fsaExercise.type,
          fsaExercise.fileRoute.objectName
        );
        
        if (audioData) {
          setAudioUrl(audioData);
        }
      } catch (error) {
        console.error('Error loading audio:', error);
      }
    };

    // Set up available targets (this would come from your targets API)
    setAvailableTargets([
      'Submarine',
      'Frigate',
      'Cargo Ship',
      'Tugboat',
      'Coast Patrol',
      'Unknown Contact'
    ]);

    loadAudio();
  }, [fsaExercise]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [audioUrl]);

  const startExercise = () => {
    setExerciseStarted(true);
    
    // Set timer based on time buffers (use the first one for now)
    if (fsaExercise.timeBuffers && fsaExercise.timeBuffers.length > 0) {
      const timeLimit = fsaExercise.timeBuffers[0].timeBuffer;
      setTimeRemaining(timeLimit);
      
      exerciseTimerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev === null || prev <= 1) {
            completeExercise();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  const completeExercise = () => {
    if (exerciseCompleted) return;
    
    setExerciseCompleted(true);
    setIsPlaying(false);
    
    if (exerciseTimerRef.current) {
      clearInterval(exerciseTimerRef.current);
    }

    // Calculate score (simplified scoring)
    const score = selectedTargets.length > 0 ? 85 : 0; // Basic scoring logic
    
    onComplete(score, selectedTargets);
  };

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const stopAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.pause();
    audio.currentTime = 0;
    setIsPlaying(false);
  };

  const handleTargetSelect = (target: string) => {
    if (exerciseCompleted) return;
    
    setSelectedTargets(prev => {
      if (prev.includes(target)) {
        return prev.filter(t => t !== target);
      } else {
        return [...prev, target];
      }
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-duoBlue-lightest to-duoBlue-default p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">FSA Exercise</h1>
        <div className="flex items-center gap-4">
          {timeRemaining !== null && (
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
        {/* Audio Player Section */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">Audio Analysis</h2>
          
          {fsaExercise.description && (
            <div className="bg-white/20 rounded-lg p-4 mb-6">
              <p className="text-white">{fsaExercise.description}</p>
            </div>
          )}

          {audioUrl && (
            <>
              <audio ref={audioRef} src={audioUrl} preload="metadata" />
              
              {/* Audio Controls */}
              <div className="bg-white/20 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <button
                    onClick={togglePlayPause}
                    disabled={!exerciseStarted}
                    className="bg-duoGreen-default hover:bg-duoGreen-darker disabled:bg-gray-400 text-white p-4 rounded-full transition-colors"
                  >
                    <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} className="w-6 h-6" />
                  </button>
                  
                  <button
                    onClick={stopAudio}
                    disabled={!exerciseStarted}
                    className="bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white p-4 rounded-full transition-colors"
                  >
                    <FontAwesomeIcon icon={faStop} className="w-6 h-6" />
                  </button>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-white/30 rounded-full h-2 mb-2">
                  <div
                    className="bg-white h-2 rounded-full transition-all duration-300"
                    style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
                  />
                </div>
                
                <div className="flex justify-between text-white text-sm">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>
            </>
          )}

          {!exerciseStarted && (
            <button
              onClick={startExercise}
              className="w-full bg-duoGreen-default hover:bg-duoGreen-darker text-white py-4 px-6 rounded-lg font-bold text-lg transition-colors"
            >
              Start Exercise
            </button>
          )}
        </div>

        {/* Target Selection Section */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">Target Identification</h2>
          
          <p className="text-white/80 mb-6">
            Listen to the audio and select the targets you identify:
          </p>

          <div className="grid grid-cols-1 gap-3">
            {availableTargets.map((target) => (
              <button
                key={target}
                onClick={() => handleTargetSelect(target)}
                disabled={!exerciseStarted || exerciseCompleted}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  selectedTargets.includes(target)
                    ? 'bg-duoGreen-default border-duoGreen-darker text-white'
                    : 'bg-white/20 border-white/30 text-white hover:bg-white/30'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{target}</span>
                  {selectedTargets.includes(target) && (
                    <FontAwesomeIcon icon={faCheck} className="w-5 h-5" />
                  )}
                </div>
              </button>
            ))}
          </div>

          {exerciseStarted && !exerciseCompleted && (
            <button
              onClick={completeExercise}
              disabled={selectedTargets.length === 0}
              className="w-full mt-6 bg-duoBlue-default hover:bg-duoBlue-darker disabled:bg-gray-400 text-white py-4 px-6 rounded-lg font-bold transition-colors"
            >
              Submit Answer{selectedTargets.length > 1 ? 's' : ''}
            </button>
          )}

          {selectedTargets.length > 0 && (
            <div className="mt-4 p-4 bg-white/20 rounded-lg">
              <p className="text-white font-medium mb-2">Selected targets:</p>
              <div className="flex flex-wrap gap-2">
                {selectedTargets.map((target) => (
                  <span
                    key={target}
                    className="bg-duoGreen-default text-white px-3 py-1 rounded-full text-sm"
                  >
                    {target}
                  </span>
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
                You identified {selectedTargets.length} target{selectedTargets.length !== 1 ? 's' : ''}.
              </p>
              <button
                onClick={() => onComplete(85, selectedTargets)}
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

export default FsaExercise; 