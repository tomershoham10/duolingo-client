'use client';
import pRetry from "p-retry";
import { useCallback, useEffect, useState } from "react";
import { getAllUsers, deleteUser } from "../API/users-service/users/functions";
import { getCourseById } from "../API/classes-service/courses/functions";
import Button, { ButtonColors } from '@/components/(buttons)/Button/page';
import { PopupsTypes, usePopupStore } from "../store/stores/usePopupStore";
import { UserType } from "../types";
import { FaUserEdit, FaTrash, FaUsers, FaUserGraduate, FaUserTie, FaSearch } from "react-icons/fa";
import { HiUsers } from "react-icons/hi";
import RoundButton from "@/components/RoundButton";
import { useAlertStore, AlertSizes } from "../store/stores/useAlertStore";
const updateSelectedPopup = usePopupStore.getState().updateSelectedPopup;
const setSelectedUser = usePopupStore.getState().setSelectedUser;
const addAlert = useAlertStore.getState().addAlert;

// CSS for hiding scrollbars
const scrollbarHideStyle = `
  .scrollbar-hide {
    -ms-overflow-style: none;  /* Internet Explorer 10+ */
    scrollbar-width: none;  /* Firefox */
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;  /* Safari and Chrome */
  }
`;

const Users: React.FC = () => {
    const [users, setUsers] = useState<UserType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [courseNames, setCourseNames] = useState<Record<string, string>>({});

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
                
                // Fetch course names for students who have courseId
                const uniqueCourseIds = [...new Set(
                    response
                        .filter(user => user.permission.toLowerCase() === 'student' && user.courseId)
                        .map(user => user.courseId!)
                )];
                
                if (uniqueCourseIds.length > 0) {
                    const courseNamesMap: Record<string, string> = {};
                    
                    await Promise.all(
                        uniqueCourseIds.map(async (courseId) => {
                            try {
                                const courseData = await getCourseById(courseId);
                                if (courseData) {
                                    courseNamesMap[courseId] = courseData.name;
                                }
                            } catch (error) {
                                console.error(`Error fetching course ${courseId}:`, error);
                                courseNamesMap[courseId] = `Course ${courseId.slice(-6)}`;
                            }
                        })
                    );
                    
                    setCourseNames(courseNamesMap);
                }
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

    const filteredUsers = users.filter(user => {
        const searchLower = searchQuery.toLowerCase();
        const courseName = user.courseId ? courseNames[user.courseId] : '';
        
        return user.userName.toLowerCase().includes(searchLower) ||
               user.permission.toLowerCase().includes(searchLower) ||
               (courseName && courseName.toLowerCase().includes(searchLower));
    });

    const createNewUser = useCallback(() => {
        updateSelectedPopup(PopupsTypes.NEW_USER);
    }, []);

    const handleEditUser = (user: UserType) => {
        setSelectedUser(user);
        updateSelectedPopup(PopupsTypes.EDIT_USER);
    };

    const handleDeleteUser = (user: UserType) => {
        setSelectedUser(user);
        updateSelectedPopup(PopupsTypes.DELETE_USER);
    };

    const getUserIcon = (permission: string) => {
        switch (permission.toLowerCase()) {
            case 'admin':
                return FaUserTie;
            case 'teacher':
                return FaUserGraduate;
            case 'student':
                return FaUsers;
            default:
                return FaUsers;
        }
    };

    const getUserRoleColor = (permission: string) => {
        switch (permission.toLowerCase()) {
            case 'admin':
                return 'from-duoRed-default to-duoRed-dark dark:from-duoRedDark-default dark:to-duoRedDark-dark';
            case 'teacher':
                return 'from-duoGreen-default to-duoGreen-dark dark:from-duoGreenDark-default dark:to-duoGreenDark-dark';
            case 'student':
                return 'from-duoBlue-default to-duoBlue-dark dark:from-duoBlueDark-default dark:to-duoBlueDark-dark';
            default:
                return 'from-duoGray-default to-duoGray-dark dark:from-duoGrayDark-default dark:to-duoGrayDark-dark';
        }
    };

    // Calculate statistics
    const totalUsers = filteredUsers.length;
    const adminCount = filteredUsers.filter(user => user.permission.toLowerCase() === 'admin').length;
    const teacherCount = filteredUsers.filter(user => user.permission.toLowerCase() === 'teacher').length;
    const studentCount = filteredUsers.filter(user => user.permission.toLowerCase() === 'student').length;

    return (
        <>
            <style dangerouslySetInnerHTML={{ __html: scrollbarHideStyle }} />
            <main className='flex h-full w-full flex-col items-center justify-start gap-8 p-6 bg-duoGray-lighter dark:bg-duoGrayDark-darkest overflow-y-auto scrollbar-hide'>
            {/* Header Section */}
            <section className='flex w-full max-w-7xl items-center justify-between'>
                <div className='flex items-center gap-4'>
                    <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-duoBlue-default dark:bg-duoBlueDark-default'>
                        <HiUsers className='h-7 w-7 text-white' />
                    </div>
                    <div>
                        <h1 className='text-3xl font-extrabold text-duoGray-darkest dark:text-duoGrayDark-lightest'>
                            Users
                        </h1>
                        <p className='text-duoGray-dark dark:text-duoGrayDark-light'>
                            Manage system users and permissions
                        </p>
                    </div>
                </div>
                <Button
                    label='New User'
                    color={ButtonColors.BLUE}
                    onClick={createNewUser}
                />
            </section>

            {/* Search Section */}
            <section className='w-full max-w-7xl'>
                <div className='relative'>
                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                        <FaSearch className='h-4 w-4 text-duoGray-dark dark:text-duoGrayDark-light' />
                    </div>
                    <input
                        type="text"
                        placeholder="Search users by name or role..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-duoGray-light dark:border-duoGrayDark-light rounded-xl focus:ring-2 focus:ring-duoBlue-default focus:border-transparent bg-white dark:bg-duoGrayDark-darkest text-duoGray-darkest dark:text-duoGrayDark-lightest placeholder-duoGray-dark dark:placeholder-duoGrayDark-light"
                    />
                </div>
            </section>

            {/* Statistics Dashboard */}
            <section className='w-full max-w-7xl'>
                <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
                    <div className='bg-white dark:bg-duoGrayDark-darkest rounded-xl border border-duoGray-light dark:border-duoGrayDark-light p-6 shadow-sm'>
                        <div className='flex items-center gap-3'>
                            <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-duoBlue-lightest dark:bg-duoBlueDark-dark'>
                                <HiUsers className='h-5 w-5 text-duoBlue-default dark:text-duoBlueDark-text' />
                            </div>
                            <div>
                                <p className='text-sm font-medium text-duoGray-dark dark:text-duoGrayDark-light'>Total Users</p>
                                <p className='text-2xl font-bold text-duoGray-darkest dark:text-duoGrayDark-lightest'>{totalUsers}</p>
                            </div>
                        </div>
                    </div>
                    <div className='bg-white dark:bg-duoGrayDark-darkest rounded-xl border border-duoGray-light dark:border-duoGrayDark-light p-6 shadow-sm'>
                        <div className='flex items-center gap-3'>
                            <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-duoRed-lightest dark:bg-duoRedDark-dark'>
                                <FaUserTie className='h-5 w-5 text-duoRed-default dark:text-duoRedDark-text' />
                            </div>
                            <div>
                                <p className='text-sm font-medium text-duoGray-dark dark:text-duoGrayDark-light'>Admins</p>
                                <p className='text-2xl font-bold text-duoGray-darkest dark:text-duoGrayDark-lightest'>{adminCount}</p>
                            </div>
                        </div>
                    </div>
                    <div className='bg-white dark:bg-duoGrayDark-darkest rounded-xl border border-duoGray-light dark:border-duoGrayDark-light p-6 shadow-sm'>
                        <div className='flex items-center gap-3'>
                            <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-duoGreen-lightest dark:bg-duoGreenDark-dark'>
                                <FaUserGraduate className='h-5 w-5 text-duoGreen-default dark:text-duoGreenDark-text' />
                            </div>
                            <div>
                                <p className='text-sm font-medium text-duoGray-dark dark:text-duoGrayDark-light'>Teachers</p>
                                <p className='text-2xl font-bold text-duoGray-darkest dark:text-duoGrayDark-lightest'>{teacherCount}</p>
                            </div>
                        </div>
                    </div>
                    <div className='bg-white dark:bg-duoGrayDark-darkest rounded-xl border border-duoGray-light dark:border-duoGrayDark-light p-6 shadow-sm'>
                        <div className='flex items-center gap-3'>
                            <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-duoBlue-lightest dark:bg-duoBlueDark-dark'>
                                <FaUsers className='h-5 w-5 text-duoBlue-default dark:text-duoBlueDark-text' />
                            </div>
                            <div>
                                <p className='text-sm font-medium text-duoGray-dark dark:text-duoGrayDark-light'>Students</p>
                                <p className='text-2xl font-bold text-duoGray-darkest dark:text-duoGrayDark-lightest'>{studentCount}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Users Grid */}
            <section className='w-full max-w-7xl'>
                {isLoading ? (
                    <div className="flex justify-center items-center py-16">
                        <div className="w-8 h-8 border-4 border-duoBlue-default border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : filteredUsers.length > 0 ? (
                    <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                        {filteredUsers.map((user) => {
                            const UserIcon = getUserIcon(user.permission);
                            const roleColor = getUserRoleColor(user.permission);
                            
                            return (
                                <div 
                                    key={user._id} 
                                    className='group relative overflow-hidden rounded-xl border border-duoGray-light bg-white shadow-sm transition-all duration-300 hover:border-duoBlue-light hover:shadow-lg hover:-translate-y-1 dark:border-duoGrayDark-light dark:bg-duoGrayDark-darkest dark:hover:border-duoBlueDark-text'
                                >
                                    {/* Delete Button */}
                                    <button
                                        onClick={() => handleDeleteUser(user)}
                                        className='absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-duoRed-default opacity-0 transition-all duration-200 hover:bg-duoRed-lighter hover:text-duoRed-darker group-hover:opacity-100 dark:bg-duoGrayDark-darkest/80 dark:hover:bg-duoRed-default dark:hover:text-white'
                                        title='Delete user'
                                    >
                                        <FaTrash className="h-3 w-3" />
                                    </button>

                                    {/* User Header */}
                                    <div className={`h-20 bg-gradient-to-br ${roleColor}`}>
                                        <div className='flex h-full items-center justify-center'>
                                            <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm'>
                                                <UserIcon className='h-6 w-6 text-white' />
                                            </div>
                                        </div>
                                    </div>

                                    {/* User Content */}
                                    <div className='p-6'>
                                        <div className='flex flex-col gap-3'>
                                            <div className='flex items-center justify-between'>
                                                <h2 className='text-xl font-bold text-duoGray-darkest dark:text-duoGrayDark-lightest'>
                                                    {user.userName}
                                                </h2>
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    user.permission.toLowerCase() === 'admin' 
                                                        ? 'bg-duoRed-lightest text-duoRed-light dark:bg-duoRed-default dark:text-duoRed-text'
                                                        : user.permission.toLowerCase() === 'teacher'
                                                        ? 'bg-duoGreen-lightest text-duoGreen-dark dark:bg-duoGreenDark-dark dark:text-duoGreenDark-text'
                                                        : 'bg-duoBlue-lightest text-duoBlue-dark dark:bg-duoBlueDark-dark dark:text-duoBlueDark-text'
                                                }`}>
                                                    {user.permission}
                                                </span>
                                            </div>
                                            
                                            {/* User Actions */}
                                            <div className='flex items-center justify-between pt-3 border-t border-duoGray-light dark:border-duoGrayDark-light'>
                                                <button
                                                    onClick={() => handleEditUser(user)}
                                                    className='flex items-center gap-2 py-2 px-3 rounded-lg transition-all hover:bg-duoBlue-lightest dark:hover:bg-duoBlueDark-dark hover:text-duoBlue-dark dark:hover:text-duoBlueDark-text'
                                                >
                                                    <div className='flex h-6 w-6 items-center justify-center rounded-full bg-duoBlue-lightest dark:bg-duoBlueDark-dark'>
                                                        <FaUserEdit className='h-3 w-3 text-duoBlue-default dark:text-duoBlueDark-text' />
                                                    </div>
                                                    <span className='text-xs font-medium text-duoGray-dark dark:text-duoGrayDark-light'>
                                                        Edit
                                                    </span>
                                                </button>
                                                {user.permission.toLowerCase() === 'student' && (
                                                    <div className='text-xs text-duoGray-dark dark:text-duoGrayDark-light'>
                                                        {user.courseId ? (courseNames[user.courseId] || `Loading...`) : 'No course'}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    /* Empty State */
                    <div className='flex flex-col items-center justify-center py-16'>
                        <div className='flex h-24 w-24 items-center justify-center rounded-full bg-duoGray-light dark:bg-duoGrayDark-light'>
                            <HiUsers className='h-12 w-12 text-duoGray-dark dark:text-duoGrayDark-lightest' />
                        </div>
                        <h3 className='mt-6 text-xl font-bold text-duoGray-darkest dark:text-duoGrayDark-lightest'>
                            {searchQuery ? 'No users found' : 'No users yet'}
                        </h3>
                        <p className='mt-2 text-center text-duoGray-dark dark:text-duoGrayDark-light max-w-md'>
                            {searchQuery 
                                ? `No users match your search for "${searchQuery}". Try adjusting your search terms.`
                                : 'Get started by creating your first user. You can assign different roles and permissions.'
                            }
                        </p>
                        {!searchQuery && (
                            <div className='mt-6'>
                                <Button
                                    label='Create Your First User'
                                    color={ButtonColors.BLUE}
                                    onClick={createNewUser}
                                />
                            </div>
                        )}
                    </div>
                )}
            </section>
            </main>
        </>
    );
};

export default Users;

