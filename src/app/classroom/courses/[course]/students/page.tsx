'use client';
import Table from '@/components/Table/page';
import useStore from '@/app/store/useStore';
import { useCourseStore } from '@/app/store/stores/useCourseStore';
import { useEffect, useState } from 'react';
import {
  UserType,
  getUsersByCourseId,
} from '@/app/API/users-service/users/functions';

const Students = () => {
  const courseId = useStore(useCourseStore, (state) => state._id);

  const [users, setUsers] = useState<UserType[] | null>(null);

  useEffect(() => {
    // console.log("CourseType in students page.tsx", courseType);

    const fetchData = async () => {
      if (courseId) {
        const response = await getUsersByCourseId(courseId);
        setUsers(response);
      }
    };
    fetchData();
  }, [courseId]);
  // console.log(`students in ${courseType} course: `, users);

  const headers = ['userName', 'permission', 'password'];

  return (
    <>
      {courseId && users ? (
        <div className='ml-10 mt-6'>
          <p className='text-2xl font-extrabold text-duoGray-darkest dark:text-duoGrayDark-lightest'>
            {Object.values(users).length} students
          </p>

          <Table headers={headers} data={users} />
        </div>
      ) : (
        <div className='ml-10 mt-6'>
          <p className='text-2xl font-extrabold text-duoGray-darkest dark:text-duoGrayDark-lightest'>
            0 students
          </p>

          <Table headers={headers} data={[]} />
        </div>
      )}
    </>
  );
};
export default Students;
