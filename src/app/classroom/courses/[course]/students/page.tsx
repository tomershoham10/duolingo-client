'use client';
import Table from '@/components/Table/page';
import useStore from '@/app/store/useStore';
import { useCourseStore } from '@/app/store/stores/useCourseStore';
import { useCallback, useEffect, useState } from 'react';
import { getUsersByCourseId } from '@/app/API/users-service/users/functions';
import pRetry from 'p-retry';

const Students: React.FC = () => {
  const selectedCourse = useStore(
    useCourseStore,
    (state) => state.selectedCourse
  );

  const [users, setUsers] = useState<UserType[]>([]);

  const fetchData = useCallback(async () => {
    try {
      if (selectedCourse) {
        const response = await pRetry(
          () => getUsersByCourseId(selectedCourse._id),
          {
            retries: 5,
          }
        );
        console.log('getUsersByCourseId', response);
        !!response ? setUsers(response) : null;
      }
    } catch (err) {
      console.error('fetchData error:', err);
    }
  }, [selectedCourse]);

  useEffect(() => {
    console.log('selectedCourse', selectedCourse);

    fetchData();
  }, [fetchData, selectedCourse]);

  const headers = [
    { key: 'userName', label: 'User name' },
    { key: 'password', label: 'Password' },
  ];

  useEffect(() => {
    console.log('users', users);
  }, [users]);

  return (
    <>
      {selectedCourse && selectedCourse._id && users ? (
        <div className='ml-10 mt-6'>
          <p className='text-2xl font-extrabold text-duoGray-darkest dark:text-duoGrayDark-lightest'>
            {Object.values(users).length} students
          </p>
          <section className='my-5 flex justify-start'>
            <Table headers={headers} rows={users} isLoading={false} />
          </section>
        </div>
      ) : (
        <div className='ml-10 mt-6'>
          <p className='text-2xl font-extrabold text-duoGray-darkest dark:text-duoGrayDark-lightest'>
            0 students
          </p>

          <Table headers={headers} rows={[]} isLoading={false} />
        </div>
      )}
    </>
  );
};
export default Students;
