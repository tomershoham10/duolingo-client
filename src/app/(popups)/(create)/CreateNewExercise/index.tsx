'use client';
import { useState } from 'react';
import { ExercisesTypes, createExercise } from '@/app/API/classes-service/exercises/functions';
import { AlertSizes, useAlertStore } from '@/app/store/stores/useAlertStore';
import { PopupsTypes } from '@/app/store/stores/usePopupStore';
import PopupHeader from '../../PopupHeader/page';
import { useInfoBarStore } from '@/app/store/stores/useInfoBarStore';
import Button, { ButtonColors } from '@/components/(buttons)/Button/page';
import { COURSES_SERVICE_ENDPOINTS } from '@/app/API/classes-service/apis';

// Button color reference
const buttonColor: ButtonColors = ButtonColors.BLUE;

// FSA exercise form component
const FSAExerciseForm: React.FC<{ onSubmit: (data: any) => void }> = ({ onSubmit }) => {
  const [description, setDescription] = useState('');
  const [adminComments, setAdminComments] = useState('');
  
  const handleSubmit = () => {
    onSubmit({
      type: ExercisesTypes.FSA,
      description,
      adminComments,
      timeBuffers: [{ timeBuffer: 60, grade: 100 }], // Default time buffer
      fileRoute: {
        mainId: '',
        subTypeId: '',
        modelId: '',
        fileType: 'records',
        objectName: ''
      }
    });
  };

  return (
    <div className="grid w-full grid-cols-1 gap-4 px-4 py-4">
      <div className="mb-4">
        <label className="block text-sm font-medium text-duoGray-darkest mb-1">Description</label>
        <textarea 
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border border-duoGray-lighter rounded-md p-2 h-24"
          placeholder="Enter exercise description"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-duoGray-darkest mb-1">Admin Comments</label>
        <textarea 
          value={adminComments}
          onChange={(e) => setAdminComments(e.target.value)}
          className="w-full border border-duoGray-lighter rounded-md p-2 h-16"
          placeholder="Optional notes for administrators"
        />
      </div>
      
      <div className="flex justify-end mt-4">
        <Button 
          onClick={handleSubmit}
          label="Create FSA Exercise"
          color={ButtonColors.GREEN}
        />
      </div>
    </div>
  );
};

// SPOTRECC exercise form component
const SPOTRECCExerciseForm: React.FC<{ onSubmit: (data: any) => void }> = ({ onSubmit }) => {
  const [adminComments, setAdminComments] = useState('');
  const [subExercises, setSubExercises] = useState([
    { description: '', fileRoute: { mainId: '', subTypeId: '', modelId: '', fileType: 'records', objectName: '' }, exerciseTime: 60, bufferTime: 10 }
  ]);
  
  const addSubExercise = () => {
    setSubExercises([...subExercises, { 
      description: '', 
      fileRoute: { mainId: '', subTypeId: '', modelId: '', fileType: 'records', objectName: '' }, 
      exerciseTime: 60, 
      bufferTime: 10 
    }]);
  };
  
  const updateSubExercise = (index: number, field: string, value: any) => {
    const updatedExercises = [...subExercises];
    updatedExercises[index] = { ...updatedExercises[index], [field]: value };
    setSubExercises(updatedExercises);
  };
  
  const handleSubmit = () => {
    onSubmit({
      type: ExercisesTypes.SPOTRECC,
      adminComments,
      subExercises
    });
  };

  return (
    <div className="grid w-full grid-cols-1 gap-4 px-4 py-4">
      <div className="mb-4">
        <label className="block text-sm font-medium text-duoGray-darkest mb-1">Admin Comments</label>
        <textarea 
          value={adminComments}
          onChange={(e) => setAdminComments(e.target.value)}
          className="w-full border border-duoGray-lighter rounded-md p-2 h-16"
          placeholder="Optional notes for administrators"
        />
      </div>
      
      <div className="mb-4">
        <h3 className="font-medium text-duoGray-darkest mb-2">Sub Exercises</h3>
        {subExercises.map((subEx, index) => (
          <div key={index} className="border border-duoGray-lighter rounded-md p-3 mb-3">
            <label className="block text-sm font-medium text-duoGray-darkest mb-1">Description</label>
            <textarea 
              value={subEx.description}
              onChange={(e) => updateSubExercise(index, 'description', e.target.value)}
              className="w-full border border-duoGray-lighter rounded-md p-2 h-16 mb-2"
              placeholder="Enter sub-exercise description"
            />
            
            <div className="grid grid-cols-2 gap-3 mb-2">
              <div>
                <label className="block text-sm font-medium text-duoGray-darkest mb-1">Exercise Time (s)</label>
                <input 
                  type="number" 
                  value={subEx.exerciseTime}
                  onChange={(e) => updateSubExercise(index, 'exerciseTime', parseInt(e.target.value))}
                  className="w-full border border-duoGray-lighter rounded-md p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-duoGray-darkest mb-1">Buffer Time (s)</label>
                <input 
                  type="number" 
                  value={subEx.bufferTime}
                  onChange={(e) => updateSubExercise(index, 'bufferTime', parseInt(e.target.value))}
                  className="w-full border border-duoGray-lighter rounded-md p-2"
                />
              </div>
            </div>
          </div>
        ))}
        
        <button 
          onClick={addSubExercise}
          className="text-duoGreen-dark hover:text-duoGreen-darkest flex items-center"
        >
          <span className="mr-1">+</span> Add Sub-exercise
        </button>
      </div>
      
      <div className="flex justify-end mt-4">
        <Button 
          onClick={handleSubmit}
          label="Create SPOTRECC Exercise"
          color={ButtonColors.GREEN}
        />
      </div>
    </div>
  );
};

const CreateNewExercise: React.FC = () => {
  const [selectedType, setSelectedType] = useState<ExercisesTypes | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const addAlert = useAlertStore.getState().addAlert;
  const levelId = useInfoBarStore.getState().syllabusFieldId;

  const handleCreateExercise = async (exerciseData: any) => {
    try {
      if (!levelId) {
        addAlert('No level selected', AlertSizes.small);
        return;
      }
      
      setIsLoading(true);
      
      // Add the level ID and timestamp to the exercise data for reference
      const creationTime = new Date();
      const completeExerciseData = {
        ...exerciseData,
        dateCreated: creationTime
      };
      
      // 1. Create the exercise
      const success = await createExercise(completeExerciseData);
      
      if (success) {
        try {
          console.log('Exercise created successfully, looking for the new exercise...');
          // Give the server a moment to complete the creation process
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // 2. Fetch all exercises to find the newly created one
          const exercisesResponse = await fetch(
            `${COURSES_SERVICE_ENDPOINTS.EXERCISES}`,
            {
              method: "GET",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          
          if (!exercisesResponse.ok) {
            throw new Error('Failed to fetch exercises');
          }
          
          const exercisesData = await exercisesResponse.json();
          let exercises = exercisesData.exercises || [];
          console.log(`Fetched ${exercises.length} exercises`);
          
          // Sort exercises by date created (newest first)
          exercises = exercises.sort((a: any, b: any) => {
            return new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime();
          });
          
          console.log('Searching for exercise matching:', {
            type: exerciseData.type,
            creationTime: creationTime,
            description: exerciseData.description
          });
          
          // Find the newest exercise matching our criteria
          // Create a timestamp threshold (5 minutes ago)
          const fiveMinutesAgo = new Date(creationTime.getTime() - 5 * 60 * 1000);
          
          const newExercise = exercises.find((exercise: any) => {
            // Check type matches (case insensitive)
            const exerciseType = exercise.type?.toLowerCase() || '';
            const expectedType = exerciseData.type?.toLowerCase() || '';
            const typeMatches = exerciseType.includes(expectedType) || expectedType.includes(exerciseType);
            
            // Check creation time is recent (within last 5 minutes)
            const creationDate = new Date(exercise.dateCreated);
            const isRecent = creationDate > fiveMinutesAgo;
            
            // For FSA exercises, check additional fields if available
            if (exerciseData.type === ExercisesTypes.FSA && exercise.description && exerciseData.description) {
              return typeMatches && isRecent && exercise.description === exerciseData.description;
            }
            
            return typeMatches && isRecent;
          });
          
          if (!newExercise || !newExercise._id) {
            console.error('Could not find newly created exercise. Newest 3 exercises:', exercises.slice(0, 3));
            throw new Error('Could not find newly created exercise');
          }
          
          console.log('Found new exercise:', newExercise);
          
          // 3. Get the current level data
          const levelResponse = await fetch(
            `${COURSES_SERVICE_ENDPOINTS.LEVELS}/${levelId}`,
            {
              method: "GET",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          
          if (levelResponse.ok) {
            const levelData = await levelResponse.json();
            const level = levelData.level;
            
            // 4. Add the actual exercise ID to the level's exercisesIds array
            const updatedLevel = {
              _id: levelId,
              exercisesIds: [...(level.exercisesIds || []), newExercise._id]
            };
            
            // 5. Update the level with the new exercise ID
            const updateResponse = await fetch(
              `${COURSES_SERVICE_ENDPOINTS.LEVELS}/${levelId}`,
              {
                method: "PUT",
                credentials: "include",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedLevel)
              }
            );
            
            if (updateResponse.ok) {
              addAlert('Exercise added to level successfully', AlertSizes.small);
              setSelectedType(null); // Close popup or reset form
            } else {
              addAlert('Created exercise but failed to add to level', AlertSizes.small);
            }
          } else {
            addAlert('Created exercise but failed to retrieve level', AlertSizes.small);
          }
        } catch (innerError) {
          console.error('Error updating level with exercise:', innerError);
          addAlert('Created exercise but failed to update level', AlertSizes.small);
        }
      } else {
        addAlert('Failed to create exercise', AlertSizes.small);
      }
    } catch (error) {
      console.error('Error creating exercise:', error);
      addAlert('Error creating exercise', AlertSizes.small);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PopupHeader popupType={PopupsTypes.ADD_EXERCISES} header='Create New Exercise'>
      <div className="p-6">
        {!selectedType ? (
          <div className="flex flex-col items-center">
            <h2 className="text-xl font-bold mb-6">Select Exercise Type</h2>
            <div className="flex space-x-4">
              <button 
                onClick={() => setSelectedType(ExercisesTypes.FSA)}
                className="bg-duoGreen-light hover:bg-duoGreen-dark text-white font-bold py-6 px-8 rounded-lg shadow-md transition-colors"
                disabled={isLoading}
              >
                FSA Exercise
              </button>
              <button 
                onClick={() => setSelectedType(ExercisesTypes.SPOTRECC)}
                className="bg-duoBlueDark-medium hover:bg-duoBlueDark-dark text-white font-bold py-6 px-8 rounded-lg shadow-md transition-colors"
                disabled={isLoading}
              >
                SPOTRECC Exercise
              </button>
            </div>
          </div>
        ) : selectedType === ExercisesTypes.FSA ? (
          <div>
            <div className="mb-4 flex items-center">
              <button 
                onClick={() => setSelectedType(null)}
                className="text-duoGray-darkText hover:text-duoGray-darkest mr-2"
                disabled={isLoading}
              >
                ← Back
              </button>
              <h2 className="text-xl font-bold">Create FSA Exercise</h2>
            </div>
            {isLoading ? (
              <div className="flex justify-center items-center p-10">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-duoGreen-dark"></div>
                <span className="ml-3 text-duoGray-darkText">Creating exercise...</span>
              </div>
            ) : (
              <FSAExerciseForm onSubmit={handleCreateExercise} />
            )}
          </div>
        ) : (
          <div>
            <div className="mb-4 flex items-center">
              <button 
                onClick={() => setSelectedType(null)}
                className="text-duoGray-darkText hover:text-duoGray-darkest mr-2"
                disabled={isLoading}
              >
                ← Back
              </button>
              <h2 className="text-xl font-bold">Create SPOTRECC Exercise</h2>
            </div>
            {isLoading ? (
              <div className="flex justify-center items-center p-10">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-duoGreen-dark"></div>
                <span className="ml-3 text-duoGray-darkText">Creating exercise...</span>
              </div>
            ) : (
              <SPOTRECCExerciseForm onSubmit={handleCreateExercise} />
            )}
          </div>
        )}
      </div>
    </PopupHeader>
  );
};

export default CreateNewExercise; 