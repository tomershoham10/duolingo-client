'use client';
import { useStore } from 'zustand';
import { usePopupStore, PopupsTypes } from '@/app/store/stores/usePopupStore';
import EditUserPopup from './index';

const EditUserPage: React.FC = () => {
    const selectedUser = useStore(usePopupStore, (state) => state.selectedUser);
    const { updateSelectedPopup, setSelectedUser } = usePopupStore.getState();

    const handleClose = () => {
        setSelectedUser(null);
        updateSelectedPopup(PopupsTypes.CLOSED);
    };

    const handleSave = () => {
        // Instead of a full page reload, we'll close the popup and let the parent component handle refresh
        // The parent component (Users page) should ideally re-fetch data when the popup closes
        setSelectedUser(null);
        updateSelectedPopup(PopupsTypes.CLOSED);
        
        // For now, we'll still use reload but this could be improved with a global refresh mechanism
        setTimeout(() => {
            window.location.reload();
        }, 100);
    };

    if (!selectedUser) {
        return null;
    }

    return (
        <EditUserPopup 
            user={selectedUser} 
            onClose={handleClose} 
            onSave={handleSave} 
        />
    );
};

export default EditUserPage; 