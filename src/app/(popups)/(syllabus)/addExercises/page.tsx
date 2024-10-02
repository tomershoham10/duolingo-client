'use client';
import Button, {
  ButtonColors,
  ButtonTypes,
} from '@/components/(buttons)/Button/page';
import PopupHeader, { PopupSizes } from '../../PopupHeader/page';
import { PopupsTypes } from '@/app/store/stores/usePopupStore';
import { useStore } from 'zustand';
import { useInfoBarStore } from '@/app/store/stores/useInfoBarStore';
import TargetsDropdowns from '@/components/TargetsDropdowns';
import { getExercisesByModelId } from '@/app/API/classes-service/exercises/functions';
import { useCallback, useState } from 'react';
import pRetry from 'p-retry';
import Table from '@/components/Table/page';
import Link from 'next/link';
import RoundButton from '@/components/RoundButton';
import { TiPlus } from 'react-icons/ti';

const AddExercises: React.FC = () => {
  const lessonId = useStore(useInfoBarStore, (state) => state.syllabusFieldId);
  const lessonIndex = useStore(
    useInfoBarStore,
    (state) => state.syllabusFieldIndex
  );

  const [exercisesList, setExercisesList] = useState<ExerciseType[] | null>(
    null
  );

  const fetchExercises = useCallback(async (model: TargetType | null) => {
    if (model) {
      const exercises = await pRetry(() => getExercisesByModelId(model._id), {
        retries: 5,
      });
      setExercisesList(exercises);
    }
  }, []);

  return (
    <PopupHeader
      popupType={PopupsTypes.ADD_EXERCISES}
      size={PopupSizes.EXTRA_LARGE}
      header={`lesson no. ${lessonIndex + 1}`}
      onClose={() => {}}
    >
      <TargetsDropdowns
        excludeFileType={true}
        onModelSelected={fetchExercises}
      />
      {exercisesList && (
        <section className='mx-auto w-fit pt-6'>
          <Table
            headers={[
              { key: 'type', label: 'exercise type' },
              { key: 'adminComments', label: 'comments' },
              { key: 'link', label: 'preview' },
              { key: 'add', label: 'add' },
            ]}
            rows={exercisesList.map((exercise) => {
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
                add: <RoundButton Icon={TiPlus} onClick={() => {}} />,
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
