'use client';
import Button, {
  ButtonColors,
  ButtonTypes,
} from '@/components/(buttons)/Button/page';
import PopupHeader, { PopupSizes } from '../../PopupHeader/page';
import { PopupsTypes, usePopupStore } from '@/app/store/stores/usePopupStore';
import { useStore } from 'zustand';
import { useInfoBarStore } from '@/app/store/stores/useInfoBarStore';
import { getExercisesByModelId, getAllExercises } from '@/app/API/classes-service/exercises/functions';
import { getLevelById, updateLevel, getExercisesByLevelId } from '@/app/API/classes-service/levels/functions';
import { useCallback, useState, useEffect } from 'react';
import pRetry from 'p-retry';
import Table from '@/components/Table/page';
import Link from 'next/link';
import RoundButton from '@/components/RoundButton';
import { TiPlus } from 'react-icons/ti';
import { ExerciseType, TargetType, CountryType, OrganizationType } from '@/app/types';
import { AlertSizes, useAlertStore } from '@/app/store/stores/useAlertStore';
import { useCourseStore } from '@/app/store/stores/useCourseStore';
import { getCourseDataById } from '@/app/API/classes-service/courses/functions';
import { useFetchTargets } from '@/app/_utils/hooks/(dropdowns)/useFechTargets';
import { useFetchCountries } from '@/app/_utils/hooks/(dropdowns)/useFechCountries';
import { useFetchOrganizations } from '@/app/_utils/hooks/(dropdowns)/useFechOrganizations';
import Dropdown, { DropdownSizes } from '@/components/Dropdown';

const AddExercises: React.FC = () => {
  const levelId = useStore(useInfoBarStore, (state) => state.syllabusFieldId);
  const levelIndex = useStore(
    useInfoBarStore,
    (state) => state.syllabusFieldIndex
  );
  const updateSelectedPopup = usePopupStore.getState().updateSelectedPopup;
  const addAlert = useAlertStore.getState().addAlert;
  const selectedCourse = useStore(useCourseStore, (state) => state.selectedCourse);

  const [allExercises, setAllExercises] = useState<ExerciseType[] | null>(null);
  const [exercisesList, setExercisesList] = useState<ExerciseType[] | null>(null);
  const [levelExercises, setLevelExercises] = useState<ExerciseType[]>([]);
  const [isAdding, setIsAdding] = useState(false);

  // Filter state
  const [selectedCountry, setSelectedCountry] = useState<CountryType | null>(null);
  const [selectedOrganization, setSelectedOrganization] = useState<OrganizationType | null>(null);
  const [selectedMainType, setSelectedMainType] = useState<TargetType | null>(null);
  const [selectedSubType, setSelectedSubType] = useState<TargetType | null>(null);
  const [selectedModel, setSelectedModel] = useState<TargetType | null>(null);

  // Fetch dropdown data
  const targetsList = useFetchTargets();
  const countriesList = useFetchCountries();
  const organizationsList = useFetchOrganizations();

  const fetchExercises = useCallback(async () => {
    try {
      const exercises = await pRetry(() => getAllExercises(), {
        retries: 5,
      });
      setAllExercises(exercises);
    } catch (error) {
      console.error('Error fetching exercises:', error);
      setAllExercises([]);
    }
  }, []);

  const fetchLevelExercises = useCallback(async () => {
    if (levelId) {
      try {
        const exercises = await pRetry(() => getExercisesByLevelId(levelId), {
          retries: 5,
        });
        setLevelExercises(exercises);
      } catch (error) {
        console.error('Error fetching level exercises:', error);
        setLevelExercises([]);
      }
    }
  }, [levelId]);

  // Fetch all exercises and level exercises on component mount
  useEffect(() => {
    fetchExercises();
    fetchLevelExercises();
  }, [fetchExercises, fetchLevelExercises]);

  // Filter exercises based on selected criteria
  const filterExercises = useCallback((exercises: ExerciseType[]) => {
    if (!exercises || !targetsList) return exercises;

    console.log('Filtering exercises:', {
      totalExercises: exercises.length,
      selectedCountry: selectedCountry?.country_name,
      selectedOrganization: selectedOrganization?.organization_name,
      selectedMainType: selectedMainType?.name,
      selectedSubType: selectedSubType?.name,
      selectedModel: selectedModel?.name
    });

    const filtered = exercises.filter((exercise) => {
      console.log('Processing exercise:', {
        id: exercise._id,
        type: exercise.type,
        comments: exercise.adminComments
      });

      // Handle different exercise types
      let fileRoutes: any[] = [];
      
      if (exercise.type === 'fsa') {
        // FSA exercises have a direct fileRoute
        const fsaExercise = exercise as any;
        if (fsaExercise.fileRoute) {
          fileRoutes = [fsaExercise.fileRoute];
        }
      } else if (exercise.type === 'spotrecc') {
        // SPOTRECC exercises have fileRoutes in subExercises
        const spotreccExercise = exercise as any;
        if (spotreccExercise.subExercises && spotreccExercise.subExercises.length > 0) {
          fileRoutes = spotreccExercise.subExercises
            .filter((subEx: any) => subEx.fileRoute)
            .map((subEx: any) => subEx.fileRoute);
        }
      }

      console.log('FileRoutes found:', fileRoutes.length);

      if (fileRoutes.length === 0) {
        // If no fileRoutes and no filters are applied, include it
        // If filters are applied, exclude exercises without fileRoute data
        const hasAnyFilter = selectedCountry || selectedOrganization || selectedMainType || selectedSubType || selectedModel;
        if (hasAnyFilter) {
          console.log('Filters applied but exercise has no fileRoute, excluding:', exercise._id);
          return false;
        }
        return true; // If no fileRoute and no filters, include it
      }

      // Check if any of the fileRoutes match the filters
      return fileRoutes.some(fileRoute => {
        const { mainId, subTypeId, modelId } = fileRoute;

        // Find the model target
        const modelTarget = targetsList.find(t => t._id === modelId);
        if (!modelTarget) return true;

        // Check model filter
        if (selectedModel && modelTarget._id !== selectedModel._id) return false;

        // Find the sub type target
        const subTypeTarget = targetsList.find(t => t._id === subTypeId);
        if (!subTypeTarget) return true;

        // Check sub type filter
        if (selectedSubType && subTypeTarget._id !== selectedSubType._id) return false;

        // Find the main type target
        const mainTypeTarget = targetsList.find(t => t._id === mainId);
        if (!mainTypeTarget) return true;

        // Check main type filter
        if (selectedMainType && mainTypeTarget._id !== selectedMainType._id) return false;

        // Check organization filter
        if (selectedOrganization && modelTarget.organization) {
          if (!modelTarget.organization.includes(selectedOrganization._id)) return false;
        }

        // Check country filter - should work independently
        if (selectedCountry && modelTarget.organization && organizationsList) {
          // Find all organizations in the selected country
          const countryOrganizations = organizationsList.filter(org => org.country === selectedCountry._id);
          const countryOrgIds = countryOrganizations.map(org => org._id);
          
          console.log('Country filter check:', {
            selectedCountry: selectedCountry.country_name,
            modelOrganizations: modelTarget.organization,
            countryOrgIds,
            countryOrganizations: countryOrganizations.map(org => org.organization_name)
          });
          
          // Check if the model belongs to any organization in the selected country
          const hasOrganizationInCountry = modelTarget.organization.some((orgId: string) => 
            countryOrgIds.includes(orgId)
          );
          
          console.log('Has organization in country:', hasOrganizationInCountry);
          
          if (!hasOrganizationInCountry) {
            console.log('Filtering out exercise due to country mismatch:', exercise._id);
            return false;
          }
        }

        return true;
      });
    });

    console.log('Filtered exercises:', filtered.length);
    return filtered;
  }, [targetsList, organizationsList, selectedCountry, selectedOrganization, selectedMainType, selectedSubType, selectedModel]);

  // Apply filtering when selections change
  useEffect(() => {
    if (allExercises) {
      const filtered = filterExercises(allExercises);
      setExercisesList(filtered);
    }
  }, [allExercises, filterExercises]);

  // Dropdown handlers that work with TargetsDropdowns component
  const handleCountryChange = useCallback((countryName: string) => {
    const country = countriesList?.find(c => c.country_name === countryName) || null;
    setSelectedCountry(country);
    setSelectedOrganization(null);
    setSelectedMainType(null);
    setSelectedSubType(null);
    setSelectedModel(null);
  }, [countriesList]);

  const handleOrganizationChange = useCallback((organizationName: string) => {
    const organization = organizationsList?.find(o => o.organization_name === organizationName) || null;
    setSelectedOrganization(organization);
    setSelectedMainType(null);
    setSelectedSubType(null);
    setSelectedModel(null);
  }, [organizationsList]);

  const handleMainTypeSelected = useCallback((mainType: TargetType | null) => {
    setSelectedMainType(mainType);
    setSelectedSubType(null);
    setSelectedModel(null);
  }, []);

  const handleSubTypeSelected = useCallback((subType: TargetType | null) => {
    setSelectedSubType(subType);
    setSelectedModel(null);
  }, []);

  const handleModelSelected = useCallback((model: TargetType | null) => {
    setSelectedModel(model);
  }, []);

  const handleAddExercise = async (exerciseId: string) => {
    try {
      console.log('handleAddExercise called with:', { exerciseId, levelId });
      
      if (!levelId) {
        addAlert('No level selected', AlertSizes.small);
        return;
      }
      
      setIsAdding(true);
      
      // Get the current level data
      console.log('Fetching level data for levelId:', levelId);
      const currentLevel = await getLevelById(levelId);
      console.log('Level data received:', currentLevel);
      
      if (!currentLevel) {
        addAlert('Failed to fetch level data', AlertSizes.small);
        setIsAdding(false);
        return;
      }

      // Check if exercise is already added
      if (currentLevel.exercisesIds?.includes(exerciseId)) {
        addAlert('Exercise already added to this level', AlertSizes.small);
        setIsAdding(false);
        return;
      }

      // Add the exercise ID to the level's exercisesIds array
      const updatedExercisesIds = [...(currentLevel.exercisesIds || []), exerciseId];
      console.log('Updating level with exercisesIds:', updatedExercisesIds);
      
      // Update the level with the new exercisesIds
      const success = await updateLevel({
        _id: levelId,
        exercisesIds: updatedExercisesIds
      });

      if (success) {
        addAlert('Exercise added successfully', AlertSizes.small);
        
        // Refresh the level exercises list
        await fetchLevelExercises();
        
        // Close the popup after a short delay
        setTimeout(() => {
          updateSelectedPopup(PopupsTypes.CLOSED);
          
          // The backend now properly clears caches, so the data should refresh automatically
          // when the parent component re-fetches data
        }, 1000);
      } else {
        addAlert('Failed to add exercise', AlertSizes.small);
      }
    } catch (error) {
      console.error('Error adding exercise:', error);
      addAlert('Error adding exercise', AlertSizes.small);
    } finally {
      setIsAdding(false);
    }
  };



  return (
    <PopupHeader
      popupType={PopupsTypes.ADD_EXERCISES}
      size={PopupSizes.EXTRA_LARGE}
      header={`Level ${levelIndex + 1}`}
      onClose={() => {}}
    >
      <section className='flex flex-wrap gap-[8px] mb-4'>
        <section className='w-[15rem]'>
          <Dropdown
            isSearchable={true}
            placeholder={'Country'}
            value={selectedCountry?.country_name}
            items={countriesList?.map((country) => country.country_name) || []}
            onChange={handleCountryChange}
            size={DropdownSizes.SMALL}
          />
        </section>
        <section className='w-[15rem]'>
          <Dropdown
            isSearchable={true}
            placeholder={'Organization'}
            items={
              selectedCountry
                ? organizationsList?.filter(org => org.country === selectedCountry._id)
                    .map(org => org.organization_name) || []
                : organizationsList?.map(org => org.organization_name) || []
            }
            value={selectedOrganization?.organization_name}
            onChange={handleOrganizationChange}
            size={DropdownSizes.SMALL}
          />
        </section>
        <section className='w-[15rem]'>
          <Dropdown
            isSearchable={true}
            placeholder={'Main type'}
            value={selectedMainType?.name}
            items={
              targetsList
                ?.filter((target) => target.level === 1)
                .map((target) => target.name) || []
            }
            onChange={(targetName: string) => {
              const mainType = targetsList?.find(
                (target) => target.name === targetName && target.level === 1
              ) || null;
              handleMainTypeSelected(mainType);
            }}
            size={DropdownSizes.SMALL}
          />
        </section>
        <section className='w-[15rem]'>
          <Dropdown
            isSearchable={true}
            placeholder={'Sub type'}
            value={selectedSubType?.name}
            items={
              selectedMainType
                ? targetsList?.filter(
                    (target) => target.level === 2 && target.father === selectedMainType._id
                  ).map((target) => target.name) || []
                : targetsList?.filter((target) => target.level === 2)
                    .map((target) => target.name) || []
            }
            onChange={(targetName: string) => {
              const subType = targetsList?.find(
                (target) => target.name === targetName && target.level === 2
              ) || null;
              handleSubTypeSelected(subType);
            }}
            size={DropdownSizes.SMALL}
          />
        </section>
        <section className='w-[15rem]'>
          <Dropdown
            isSearchable={true}
            placeholder={'Model'}
            value={selectedModel?.name}
            items={
              selectedSubType
                ? targetsList?.filter(
                    (target) =>
                      target.level === 3 &&
                      target.father === selectedSubType._id &&
                      (selectedOrganization
                        ? target.organization?.includes(selectedOrganization._id)
                        : true)
                  ).map((target) => target.name) || []
                : []
            }
            onChange={(targetName: string) => {
              const model = targetsList?.find(
                (target) =>
                  target.name === targetName &&
                  target.level === 3 &&
                  target.father === selectedSubType?._id &&
                  (selectedOrganization
                    ? target.organization?.includes(selectedOrganization._id)
                    : true)
              ) || null;
              handleModelSelected(model);
            }}
            size={DropdownSizes.SMALL}
          />
        </section>
      </section>
      {exercisesList && (
        <section className='mx-auto w-fit pt-6'>
          <Table
            headers={[
              { key: 'type', label: 'exercise type' },
              { key: 'adminComments', label: 'comments' },
              { key: 'link', label: 'preview' },
              { key: 'add', label: 'action' },
            ]}
            rows={exercisesList.map((exercise) => {
              const isInLevel = levelExercises.some(levelEx => levelEx._id === exercise._id);
              
              return {
                type: exercise.type,
                adminComments: exercise.adminComments,
                link: (
                  <Link
                    className='w-fit cursor-pointer gap-2 text-center text-duoBlue-default hover:text-duoBlue-default dark:text-duoPurpleDark-default dark:hover:opacity-90'
                    href={`${`/classroom/exercise-preview/${exercise._id}`}`}
                    target='_blank'
                  >
                    preview
                  </Link>
                ),
                add: isInLevel ? (
                  <span className="text-duoGreen-default text-sm font-medium">Already added</span>
                ) : (
                  <RoundButton 
                    Icon={TiPlus} 
                    onClick={() => handleAddExercise(exercise._id)}
                    className={isAdding ? 'opacity-50 cursor-not-allowed' : ''}
                  />
                ),
              };
            })}
            isLoading={false}
          />
        </section>
      )}
    </PopupHeader>
  );
};

export default AddExercises;
