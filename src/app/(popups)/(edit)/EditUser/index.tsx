'use client';
import { useCallback, useState } from "react";
import { UserType } from "../../../types";
import Input, { InputTypes } from '@/components/Input/page';
import Button, { ButtonColors } from '@/components/(buttons)/Button/page';
import Dropdown, { DropdownSizes } from '@/components/Dropdown';
import PopupHeader from '../../PopupHeader/page';
import useStore from '@/app/store/useStore';
import { useCourseStore } from '@/app/store/stores/useCourseStore';
import { AlertSizes, useAlertStore } from '@/app/store/stores/useAlertStore';
import { PopupsTypes } from '@/app/store/stores/usePopupStore';
import pRetry from 'p-retry';
import { updateUser } from '@/app/API/users-service/users/functions';

interface EditUserPopupProps {
    user: UserType;
    onClose: () => void;
    onSave: () => void;
}

const permissions = ['admin', 'teacher', 'student'];

const EditUserPopup: React.FC<EditUserPopupProps> = ({ user, onClose, onSave }) => {
    const addAlert = useAlertStore.getState().addAlert;

    const [userName, setUserName] = useState(user.userName);
    const [password, setPassword] = useState('');
    const [role, setRole] = useState(user.permission);
    const [failedFields, setFailedFields] = useState<string[]>([]);
    const [isSaving, setIsSaving] = useState(false);

    const handleUserName = (value: string) => setUserName(value);
    const handlePassword = (value: string) => setPassword(value);
    const handleRole = (value: string) => setRole(value);
    
    const addFailedFields = (value: string) => {
        setFailedFields((prevFields: string[]) => [...prevFields, value]);
    };

    const handleSave = useCallback(async () => {
        setFailedFields([]);
        
        // Validation according to Hebrew specs
        if (userName.length === 0 || userName.length > 20 || role === '' || 
            (password.length > 0 && password.length > 20)) {
            if (userName.length === 0) {
                addAlert('Please enter a user name.', AlertSizes.small);
                addFailedFields('userName');
            } else if (userName.length > 20) {
                addAlert('User name must be 20 characters or less.', AlertSizes.small);
                addFailedFields('userName');
            }
            
            if (password.length > 20) {
                addAlert('Password must be 20 characters or less.', AlertSizes.small);
                addFailedFields('password');
            }
            
            if (role === '') {
                addAlert('Please select a role.', AlertSizes.small);
                addFailedFields('role');
            }
            return;
        }
        
        setIsSaving(true);
        
        try {
            // Only include password in update if it's not empty
            const updateData: any = { 
                userName, 
                permission: role
            };
            
            if (password.length > 0) {
                updateData.password = password;
            }
            
            const success = await pRetry(() => updateUser(user._id, updateData), { retries: 3 });
            
            if (success) {
                addAlert('User updated successfully!', AlertSizes.small);
                onSave();
                onClose();
            } else {
                addAlert('Failed to update user. Please try again.', AlertSizes.small);
            }
        } catch (error) {
            console.error('Error updating user:', error);
            addAlert('Error updating user. Please try again.', AlertSizes.small);
        } finally {
            setIsSaving(false);
        }
    }, [userName, password, role, addAlert, onSave, onClose, user._id]);

    return (
        <PopupHeader
            popupType={PopupsTypes.EDIT_USER}
            header="Edit user"
            onClose={onClose}
        >
            <div className='mt-12 grid w-full grid-cols-4 grid-rows-4 gap-y-4 px-4 py-4 3xl:gap-y-12'>
                <p className='col-span-1 flex-none text-lg font-bold text-duoGray-darkest dark:text-duoGrayDark-lightest'>
                    User Name:
                </p>
                <div className='col-span-3 mx-4 flex flex-none flex-col items-center justify-center'>
                    <Input
                        type={InputTypes.TEXT}
                        placeholder={'User Name (max 20 characters)'}
                        value={userName}
                        onChange={handleUserName}
                        failed={failedFields.includes('userName') ? true : false}
                    />
                </div>
                
                <p className='col-span-1 flex-none text-lg font-bold text-duoGray-darkest dark:text-duoGrayDark-lightest'>
                    Password:
                </p>
                <div className='col-span-3 mx-4 flex flex-none flex-col items-center justify-center'>
                    <Input
                        type={InputTypes.PASSWORD}
                        placeholder={'New Password (max 20 characters, leave empty to keep current)'}
                        value={password}
                        onChange={handlePassword}
                        failed={failedFields.includes('password') ? true : false}
                    />
                </div>
                
                <p className='col-span-1 flex-none text-lg font-bold text-duoGray-darkest dark:text-duoGrayDark-lightest'>
                    User Type:
                </p>
                <div className='col-span-3 mx-4 flex flex-none flex-col items-center justify-center'>
                    <Dropdown
                        isSearchable={false}
                        items={permissions}
                        placeholder='Select user type'
                        value={role}
                        onChange={handleRole}
                        isFailed={failedFields.includes('role') ? true : false}
                        size={DropdownSizes.DEFAULT}
                    />
                </div>
                
                <div className='relative col-span-2 col-start-2 mt-2 flex h-full w-full flex-none items-center justify-center py-5'>
                    <div className='absolute inset-x-0'>
                        <Button
                            label={isSaving ? 'Saving...' : 'Save'}
                            color={ButtonColors.BLUE}
                            onClick={handleSave}
                            isDisabled={isSaving}
                        />
                    </div>
                </div>
            </div>
        </PopupHeader>
    );
};

export default EditUserPopup; 