'use client';
import pRetry from "p-retry";
import { useCallback, useEffect, useState } from "react";
import { getAllUsers } from "../API/users-service/users/functions";
import Button, { ButtonColors } from '@/components/(buttons)/Button/page';
import { PopupsTypes, usePopupStore } from "../store/stores/usePopupStore";
import { UserType } from "../types";

const updateSelectedPopup = usePopupStore.getState().updateSelectedPopup;
const setSelectedUser = usePopupStore.getState().setSelectedUser;

const Users: React.FC = () => {
    const [users, setUsers] = useState<UserType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await pRetry(
                () => getAllUsers(),
                {
                    retries: 5,
                }
            );
            if (response) {
                setUsers(response);
            }
        } catch (err) {
            console.error('fetchData error:', err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const filteredUsers = users.filter(user => 
        user.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.permission.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const headers = [
        { key: 'permission', label: 'User Type' },
        { key: 'userName', label: 'User Name' },
    ];

    const createNewUser = useCallback(() => {
        updateSelectedPopup(PopupsTypes.NEW_USER);
    }, [updateSelectedPopup]);

    const handleEditUser = (user: UserType) => {
        setSelectedUser(user);
        updateSelectedPopup(PopupsTypes.EDIT_USER);
    };

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Users</h1>
                        <Button
                            label="New User"
                            color={ButtonColors.BLUE}
                            onClick={createNewUser}
                        />
                    </div>

                    <div className="mb-6">
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        />
                    </div>

                    <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 mb-8">
                        <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                            Total Users: {filteredUsers.length}
                        </p>
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center items-center py-12">
                            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : filteredUsers.length === 0 ? (
                        <div className="flex justify-center items-center py-12">
                            <span className="text-gray-400 dark:text-gray-500 text-lg">No users found.</span>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600 rounded-lg overflow-hidden shadow-md">
                                <thead className="bg-blue-50 dark:bg-gray-900">
                                    <tr>
                                        {headers.map((header) => (
                                            <th
                                                key={header.key}
                                                className="px-6 py-3 text-left text-xs font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider"
                                            >
                                                {header.label}
                                            </th>
                                        ))}
                                        <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map((row, idx) => (
                                        <tr
                                            key={row._id}
                                            className={
                                                idx % 2 === 0
                                                    ? "bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
                                                    : "bg-gray-50 dark:bg-gray-900 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
                                            }
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 dark:text-gray-100">{row.permission}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-700 dark:text-gray-200">{row.userName}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <button
                                                    className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 transition"
                                                    onClick={() => handleEditUser(row)}
                                                >
                                                    Edit
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
};

export default Users;

