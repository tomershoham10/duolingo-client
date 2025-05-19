'use client';
import pRetry from "p-retry";
import { useCallback, useEffect, useState } from "react";
import Table from "@/components/Table/page";
import { getAllUsers } from "../API/users-service/users/functions";
import { getCourseById } from "../API/classes-service/courses/functions";
import Button, { ButtonColors } from '@/components/(buttons)/Button/page';
import { PopupsTypes, usePopupStore } from "../store/stores/usePopupStore";
const updateSelectedPopup = usePopupStore.getState().updateSelectedPopup;


const Users: React.FC = () => {

    const [users, setUsers] = useState<UserType[]>([]);

    const fetchData = useCallback(async () => {
        try {
            const response = await pRetry(
                () => getAllUsers(),
                {
                    retries: 5,
                }
            );
            console.log('getAllUsers', response);
            !!response ? setUsers(response) : null;
            response
            ?.filter(user => user.permission === 'student')
            ?.forEach(student => {
                console.log('student', student);
                if (student?.courseId) {
                    getCourseById(student?.courseId)
                        .then((course) => {
                            console.log('course', course);
                            if (course) {
                                setUsers((prevUsers) =>
                                    prevUsers.map((user) =>
                                        user._id === student._id
                                            ? { ...user, courseId: course.name }
                                            : user
                                    )
                                );
                            }
                        })
                        .catch((error) => {
                            console.error('Error fetching course:', error);
                        });
                };
            });
        } catch (err) {
            console.error('fetchData error:', err);
        }
    }, []);

    useEffect(() => {
        console.log('Get All Users');
        fetchData();
    }, []);

    const headers = [
        { key: 'permission', label: 'Role' },
        { key: 'userName', label: 'User name' },
        { key: 'courseId', label: 'Course' },
    ];
    const createNewUser = useCallback(() => {
        updateSelectedPopup(PopupsTypes.NEW_USER);
      }, [updateSelectedPopup]);
    return (
        <>
        <main className='flex h-full w-full flex-col items-center justify-start gap-6 p-6'>
      <section className='flex w-full items-center justify-between'>
        <h1 className='text-3xl font-bold'>Users</h1>
        <Button
          label='New User'
          color={ButtonColors.BLUE}
          onClick={createNewUser}
        />
      </section>
            {users ? (
                <div className='ml-10 mt-6'>
                    <p className='text-2xl font-extrabold text-duoGray-darkest dark:text-duoGrayDark-lightest'>
                        {Object.values(users).length} Users
                    </p>
                    <section className='my-5 flex justify-start'>
                        <Table headers={headers} rows={users} isLoading={false} />
                    </section>
                </div>
            ) : (
                <div className='ml-10 mt-6'>
                    <p className='text-2xl font-extrabold text-duoGray-darkest dark:text-duoGrayDark-lightest'>
                        0 Users
                    </p>
                    <Table headers={headers} rows={[]} isLoading={false} />
                </div>
            )}
            </main>
        </>
    );
};

export default Users;

