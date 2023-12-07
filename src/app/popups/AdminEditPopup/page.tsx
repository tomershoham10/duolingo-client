'use client';
import { useState, useEffect } from 'react';

import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { GoPlus } from 'react-icons/go';
import { FaRegTrashAlt } from 'react-icons/fa';

import useStore from '@/app/store/useStore';
import { useAlertStore } from '@/app/store/stores/useAlertStore';
import { PopupsTypes, usePopupStore } from '@/app/store/stores/usePopupStore';
import {
  fieldToEditType,
  useEditSyllabusStore,
} from '@/app/store/stores/useEditSyllabus';
import { UnitType } from '@/app/API/classes-service/courses/functions';
import { getUnitById } from '@/app/API/classes-service/units/functions';
import SortableItem from '@/app/components/SortableItem/page';
import Textbox, { FontSizes } from '@/app/components/Textbox/page';

library.add(faXmark);

const AdminEditPopup: React.FC = () => {
  const selectedPopup = useStore(usePopupStore, (state) => state.selectedPopup);
  const fieldToEdit = useStore(
    useEditSyllabusStore,
    (state) => state.fieldToEdit
  );
  const fieldId = useStore(useEditSyllabusStore, (state) => state.fieldId);
  const addAlert = useAlertStore.getState().addAlert;
  const updateSelectedPopup = usePopupStore.getState().updateSelectedPopup;

  const [unit, setUnit] = useState<UnitType>();
  const [grabbedTargetId, setGrabbedTargetId] = useState<string>('released');
  const [edittedArray, setEdittedArray] = useState<string[]>([]);

  useEffect(() => {
    const fetchUnit = async (unitId: string) => {
      const response = await getUnitById(unitId);
      if (response) {
        setUnit(response);
      }
    };

    if (
      selectedPopup === PopupsTypes.ADMINEDIT &&
      fieldToEdit === fieldToEditType.UNIT &&
      fieldId
    ) {
      fetchUnit(fieldId);
    }
  }, [selectedPopup, fieldToEdit, fieldId]);

  useEffect(() => {
    if (unit && unit.levels) {
      setEdittedArray(unit?.levels);
    }
  }, [unit]);

  const handleDragMove = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setEdittedArray((items) => {
        const activeIndex = items.indexOf(active.id as string);
        const overIndex = items.indexOf(over.id as string);
        return arrayMove(items, activeIndex, overIndex);
      });
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setGrabbedTargetId('released');

    if (over && active.id !== over.id) {
      setEdittedArray((items) => {
        // const ids = levelsIds.map((item) => item);
        // console.log('ids', levelsIds, active.id, over.id);

        const activeIndex = items.indexOf(active.id.toString());
        const overIndex = items.indexOf(over.id.toString());
        return arrayMove(items, activeIndex, overIndex);
      });
    }
  };

  useEffect(() => {
    console.log('edittedArray', edittedArray);
  }, [edittedArray]);

  const removeItem = (itemId: string) => {
    setEdittedArray(edittedArray.filter((item) => item != itemId));
  };

  return (
    <div
      className={
        selectedPopup === PopupsTypes.ADMINEDIT
          ? 'fixed z-20 flex h-screen w-screen items-center justify-center overflow-auto bg-[rgb(0,0,0)] bg-[rgba(0,0,0,0.4)] transition duration-200 ease-out'
          : 'z-0 opacity-0 transition duration-200 ease-in'
      }
    >
      {selectedPopup === PopupsTypes.ADMINEDIT ? (
        <div className='relative m-5 flex h-[30rem] w-[40rem] rounded-md bg-white p-5 xl:h-[35rem] xl:w-[55rem] 2xl:h-[50rem] 2xl:w-[78.5rem] 3xl:h-[70rem] 3xl:w-[110rem]'>
          <button
            onClick={() => {
              updateSelectedPopup(PopupsTypes.CLOSED);
            }}
            className='z-50 h-fit w-fit flex-none rounded-md text-duoGray-dark'
          >
            <FontAwesomeIcon
              className='fa-lg fa-solid flex-none'
              icon={faXmark}
            />
          </button>
          <div className='w-full items-start justify-start'>
            <div className='absolute left-0 flex h-10 w-full justify-center border-b-2'>
              <span className='text-xl font-extrabold tracking-widest text-duoGray-dark'>
                {fieldToEdit} I
              </span>
            </div>
            {unit ? (
              <div className='mt-12 w-full'>
                <div className='my-2'>{unit._id}</div>
                <div className='my-2 w-[69%]'>
                  <span className='text-2xl font-bold'>Description:</span>
                  {unit.description ? (
                    <Textbox
                      prevData={unit.description}
                      isEditMode={true}
                      fontSizeProps={FontSizes.SMALL}
                    />
                  ) : null}
                </div>
                <div className='my-2'>{unit.guidebook}</div>
                <div className='w-full'>
                  <div className='my-2 flex flex-row items-center justify-start gap-3'>
                    <span className='text-2xl font-bold'>Levels:</span>
                    <button
                      onClick={() =>
                        setEdittedArray((prev) => [
                          ...prev,
                          `new_${new Date().getTime()}`,
                        ])
                      }
                      className='flex flex-row items-center justify-center rounded-3xl bg-duoGray-lighter px-3 py-1 font-bold text-duoGray-darkest'
                    >
                      <span className='text-xl'> Add </span>
                      <GoPlus />
                    </button>
                  </div>
                  {edittedArray && edittedArray.length > 0 ? (
                    <div className='flex h-fit w-full flex-col items-start justify-between font-bold'>
                      <DndContext
                        collisionDetection={closestCenter}
                        onDragStart={(event: DragEndEvent) => {
                          const { active } = event;
                          setGrabbedTargetId(active.id.toString());
                        }}
                        onDragMove={handleDragMove}
                        onDragEnd={handleDragEnd}
                      >
                        <SortableContext
                          items={edittedArray}
                          strategy={horizontalListSortingStrategy}
                        >
                          <div className='flex flex-wrap gap-1'>
                            {edittedArray.map((levelId, index) => (
                              <div
                                key={index}
                                className='mb-2 flex w-[8rem] flex-row'
                              >
                                <SortableItem
                                  id={levelId}
                                  key={index}
                                  name={`${
                                    unit.levels && unit.levels.includes(levelId)
                                      ? `level ${
                                          unit.levels
                                            ? unit.levels.indexOf(levelId) + 1
                                            : '0'
                                        }`
                                      : 'new level'
                                  }`}
                                  isGrabbed={
                                    grabbedTargetId
                                      ? grabbedTargetId === levelId
                                      : false
                                  }
                                  isDisabled={false}
                                  addedStyle={`${
                                    unit.levels && unit.levels.includes(levelId)
                                      ? unit.levels &&
                                        unit.levels.indexOf(levelId) !==
                                          edittedArray.indexOf(levelId)
                                        ? 'border-duoYellow-buttonBorder text-duoYellow-darker hover:bg-duoYellow-lighter'
                                        : ''
                                      : 'border-duoGreen-buttonBorder text-duoGreen-dark hover:bg-duoGreen-lighter'
                                  }`}
                                />
                                {grabbedTargetId !== levelId ? (
                                  <button
                                    onClick={() => {
                                      removeItem(levelId);
                                    }}
                                    className='text-duoGray-darkest'
                                  >
                                    <FaRegTrashAlt />
                                  </button>
                                ) : null}
                              </div>
                            ))}
                          </div>
                        </SortableContext>
                      </DndContext>
                    </div>
                  ) : (
                    <>
                      {unit && unit.levels && unit.levels.length > 0 ? (
                        <div className='text-lg font-semibold text-duoRed-default'>
                          all the levels has been removed!{' '}
                        </div>
                      ) : (
                        <div>no levels</div>
                      )}
                    </>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default AdminEditPopup;
