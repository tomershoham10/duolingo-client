'use client';
import { useCallback } from 'react';
import { useStore } from 'zustand';
import { usePopupStore, PopupsTypes } from '@/app/store/stores/usePopupStore';
import { useAlertStore, AlertSizes } from '@/app/store/stores/useAlertStore';
import Button, { ButtonColors } from '@/components/(buttons)/Button/page';
import { deleteUser } from '@/app/API/users-service/users/functions';
import pRetry from 'p-retry';
import PopupHeader, { PopupSizes } from '../../PopupHeader/page';

const DeleteUserPopup: React.FC = () => {
  const selectedUser = useStore(usePopupStore, (state) => state.selectedUser);
  const updateSelectedPopup = usePopupStore.getState().updateSelectedPopup;
  const setSelectedUser = usePopupStore.getState().setSelectedUser;
  const addAlert = useAlertStore.getState().addAlert;

  const handleDelete = useCallback(async () => {
    if (!selectedUser) return;

    try {
      const success = await pRetry(
        () => deleteUser(selectedUser._id),
        {
          retries: 3,
        }
      );

      if (success) {
        setSelectedUser(null);
        updateSelectedPopup(PopupsTypes.CLOSED);
        addAlert('User deleted successfully', AlertSizes.small);
        // Trigger a page refresh to update the users list
        window.location.reload();
      } else {
        addAlert('Failed to delete user', AlertSizes.small);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      addAlert('Error deleting user', AlertSizes.small);
    }
  }, [selectedUser, addAlert, updateSelectedPopup, setSelectedUser]);

  const handleCancel = useCallback(() => {
    setSelectedUser(null);
    updateSelectedPopup(PopupsTypes.CLOSED);
  }, [updateSelectedPopup, setSelectedUser]);

  return (
    <PopupHeader
      popupType={PopupsTypes.DELETE_USER}
      header="Delete User"
      size={PopupSizes.SMALL}
    >
      <div className="grid w-full grid-cols-1 gap-y-4 px-4 py-4">
        <p className="text-lg text-duoGray-darkest dark:text-duoGrayDark-lightest">
          Are you sure you want to delete the user "{selectedUser?.userName}"?
          <br />
          This action cannot be undone and will permanently remove all user data.
        </p>
        
        <div className="flex justify-end gap-4 mt-4">
          <Button
            label="Cancel"
            color={ButtonColors.GRAY}
            onClick={handleCancel}
          />
          <Button
            label="Delete"
            color={ButtonColors.RED}
            onClick={handleDelete}
          />
        </div>
      </div>
    </PopupHeader>
  );
};

export default DeleteUserPopup; 