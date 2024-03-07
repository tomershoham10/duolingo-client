'use client';
import Table from '@/components/Table/page';
import useStore from '@/app/store/useStore';
import { useCourseStore } from '@/app/store/stores/useCourseStore';
import { useEffect, useState } from 'react';
import { getUsersByCourseId } from '@/app/API/users-service/users/functions';

const Students = () => {
  const courseId = useStore(useCourseStore, (state) => state._id);

  const [users, setUsers] = useState<UserType[] | null>(null);

  useEffect(() => {
    console.log('courseId sdfs', courseId);

    const fetchData = async () => {
      if (courseId) {
        const response = await getUsersByCourseId(courseId);
        setUsers(response);
      }
    };
    fetchData();
  }, [courseId]);

  const headers = [
    { key: 'userName', label: 'User name' },
    { key: 'permission', label: 'Permission' },
    { key: 'password', label: 'Password' },
  ];

  useEffect(() => {
    console.log('users', users);
  }, [users]);

  return (
    <>
      {courseId && users ? (
        <div className='ml-10 mt-6'>
          <p className='text-2xl font-extrabold text-duoGray-darkest dark:text-duoGrayDark-lightest'>
            {Object.values(users).length} students
          </p>
          <section className='my-5 flex justify-start'>
            <Table headers={headers} rows={users} isSelectable={false} />
          </section>
        </div>
      ) : (
        <div className='ml-10 mt-6'>
          <p className='text-2xl font-extrabold text-duoGray-darkest dark:text-duoGrayDark-lightest'>
            0 students
          </p>

          <Table headers={headers} rows={[]} isSelectable={false} />
        </div>
      )}
    </>
  );
};
export default Students;
