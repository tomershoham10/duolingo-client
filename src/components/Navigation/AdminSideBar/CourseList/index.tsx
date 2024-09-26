import Link from 'next/link';

interface CoursesListProp {
  coursesList: CoursesType[] | null | undefined;
  pathname: string;
}

const CourseList: React.FC<CoursesListProp> = (props) => {
  const { coursesList, pathname } = props;
  return (
    <section className='flex items-center justify-center border-b-2 dark:border-duoGrayDark-light'>
      <ul className='border- w-full cursor-default text-center text-[0.75rem] uppercase md:text-[0.9rem] lg:text-lg'>
        {coursesList ? (
          coursesList.length > 0 && !!coursesList[0]._id ? (
            // coursesList.map((item,index)=><></>)
            coursesList.map((item, index) => (
              <li
                key={item._id}
                className={`${
                  item.name
                    ? pathname.includes(item.name.toLocaleLowerCase())
                      ? 'dark:text-duoBlueDark-texst bg-duoBlue-lightest text-duoBlue-light dark:bg-sky-800'
                      : 'text-duoGray-darkest hover:bg-duoBlue-lightest hover:text-duoBlue-light dark:text-duoGrayDark-lightest dark:hover:bg-sky-800 dark:hover:text-duoBlue-light'
                    : 'text-duoGray-darkest hover:bg-duoBlue-lightest hover:text-duoBlue-light dark:text-duoGrayDark-lightest dark:hover:bg-sky-800 dark:hover:text-duoBlue-light'
                }`}
              >
                <Link
                  className='block h-full w-full p-3'
                  href={`${
                    item.name
                      ? `/classroom/courses/${item.name.toLocaleLowerCase()}/students`
                      : ''
                  }`}
                >
                  {item.name}
                </Link>
              </li>
            ))
          ) : (
            <span className='flex items-center justify-center p-3 text-duoGray-darkest opacity-70 dark:text-duoGrayDark-lightest'>
              NO COURSES
            </span>
          )
        ) : (
          <span className='flex items-center justify-center p-3 text-duoGray-darkest opacity-70 dark:text-duoGrayDark-lightest'>
            NO COURSES
          </span>
        )}
      </ul>
    </section>
  );
};

export default CourseList;
