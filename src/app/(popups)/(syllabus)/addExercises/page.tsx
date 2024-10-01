'use client';
import Button, {
  ButtonColors,
  ButtonTypes,
} from '@/components/(buttons)/Button/page';
import PopupHeader, { PopupSizes } from '../../PopupHeader/page';
import { PopupsTypes } from '@/app/store/stores/usePopupStore';
import { useStore } from 'zustand';
import { useInfoBarStore } from '@/app/store/stores/useInfoBarStore';
import Pagination from '@/components/Navigation/Pagination/page';
import TargetsDropdowns from '@/components/TargetsDropdowns';

const AddExercises: React.FC = () => {
  const lessonId = useStore(useInfoBarStore, (state) => state.syllabusFieldId);
  const lessonIndex = useStore(
    useInfoBarStore,
    (state) => state.syllabusFieldIndex
  );

  return (
    <PopupHeader
      popupType={PopupsTypes.ADD_EXERCISES}
      size={PopupSizes.EXTRA_LARGE}
      header={`lesson no. ${lessonIndex + 1}`}
      onClose={() => {}}
    >
      <TargetsDropdowns />
    </PopupHeader>
  );
};

export default AddExercises;
