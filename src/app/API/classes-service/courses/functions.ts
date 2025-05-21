import { COURSES_API, COURSES_SERVICE_ENDPOINTS } from "../apis";

interface LevelData extends LevelType {
    exercises: ExerciseType[];
    exercisesIds?: string[];
    suspendedExercisesIds?: string[];
}

interface CourseData extends CoursesType {
    description: string;
    levels: LevelData[];
}

export const createCourse = async (name: string, description?: string): Promise<number | null> => {
    try {
        console.log('createCourse', name, description);
        const response = await fetch(
            COURSES_SERVICE_ENDPOINTS.COURSES,
            {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ 
                    name: name,
                    description: description 
                })
            });

        return response.status;

    } catch (error) {
        console.error("Error creating a course:", error);
        return null;
    }
}

export const getCourseById = async (courseId: string): Promise<CoursesType | null> => {
    try {
        const response = await fetch(
            `${COURSES_SERVICE_ENDPOINTS.COURSES}/${courseId}`,
            {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        if (response.ok) {
            const data = await response.json();
            const courseData = data.course;
            return courseData;
        } else {
            console.error("Failed to fetch course by id.");
            return null;
        }
    } catch (error) {
        console.error("Error fetching course by id:", error);
        return null;
    }
};

export const getCourses = async (): Promise<CoursesType[] | null> => {
    try {
        const response = await fetch(COURSES_SERVICE_ENDPOINTS.COURSES, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });

        console.log('try');
        if (response.ok) {
            const data = await response.json();
            const coursesList = data.courses as CoursesType[];

            const storedData = localStorage.getItem('courseData');

            let courseData = storedData ? JSON.parse(storedData) : {};

            courseData['coursesList'] = coursesList;

            const updatedData = JSON.stringify(courseData);

            localStorage.setItem('coursesData', updatedData);
            return coursesList;
        } else {
            console.error("Failed to fetch courses.");
            return null;
        }
    } catch (error) {
        console.error("Error fetching courses:", error);
        return null;
    }
};

export const getCourseByName = async (courseName: string): Promise<CoursesType | null> => {
    try {
        const response = await fetch(`${COURSES_API.GET_COURSE_BY_NAME}/${courseName}`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.ok) {
            const data = await response.json();
            const course = data.course as CoursesType;
            const storedData = localStorage.getItem('courseData');
            let courseData = storedData ? JSON.parse(storedData) : {};
            courseData['selectedCourse'] = course;
            const updatedData = JSON.stringify(courseData);

            localStorage.setItem(
                "coursesData",
                JSON.stringify(updatedData),
            );
            return course;
        } else {
            console.error("Failed to fetch course.");
            return null;
        }
    } catch (error) {
        console.error("Error fetching course:", error);
        return null;
    }
};

export const getCourseDataById = async (courseId: string): Promise<CourseData | null> => {
    try {
        console.log("getCourseDataById - Fetching data for course:", courseId);
        const response = await fetch(
            `${COURSES_API.GET_COURSE_DATA_BY_ID}/${courseId}`,
            {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        
        console.log(`API response status: ${response.status} ${response.statusText}`);
        
        if (response.ok) {
            let data;
            
            try {
                data = await response.json();
                console.log('getCourseDataById RAW RESPONSE:', data);
            } catch (jsonError) {
                console.error('Failed to parse response JSON:', jsonError);
                return null;
            }
            
            if (!data.courseData || !Array.isArray(data.courseData) || data.courseData.length === 0) {
                console.error('Invalid course data format returned from API:', data);
                return null;
            }
            
            const resData = data.courseData[0] as CourseData;
            
            // Ensure all expected arrays exist (defensive coding)
            resData.levelsIds = resData.levelsIds || [];
            resData.levels = resData.levels || [];
            resData.suspendedLevelsIds = resData.suspendedLevelsIds || [];
            
            // Log difference between levelsIds and actual levels
            console.log('Course has', resData.levelsIds.length, 'level IDs and', 
                        resData.levels.length, 'level objects were returned');
                        
            // Ensure each level has the required properties
            if (resData.levels && resData.levels.length > 0) {
                resData.levels = resData.levels.map(level => {
                    if (!level) return null;
                    
                    // Ensure required properties exist
                    return {
                        ...level,
                        _id: level._id || '',
                        exercisesIds: level.exercisesIds || [],
                        exercises: level.exercises || [],
                        suspendedExercisesIds: level.suspendedExercisesIds || []
                    };
                }).filter(Boolean) as any[]; // Filter out nulls
            }
            
            return resData;
        } else {
            console.error(`Error fetching course data: ${response.status} ${response.statusText}`);
            
            try {
                const errorText = await response.text();
                console.error('Error response body:', errorText);
            } catch (err) {
                console.error('Could not read error response body');
            }
            
            return null;
        }
    } catch (error: any) {
        console.error(`Exception in getCourseDataById: ${error.message}`, error);
        throw new Error(`error while fetching course data: ${error.message}`);
    }
};

export const updateCourse = async (course: Partial<CoursesType>): Promise<boolean> => {
    try {
        let fieldsToUpdate: Partial<CoursesType> = {};

        course.name ? fieldsToUpdate.name = course.name : null;
        course.description ? fieldsToUpdate.description = course.description : null;
        course.levelsIds ? fieldsToUpdate.levelsIds = course.levelsIds : null;
        course.suspendedLevelsIds ? fieldsToUpdate.suspendedLevelsIds = course.suspendedLevelsIds : null;

        const response = await fetch(
            `${COURSES_SERVICE_ENDPOINTS.COURSES}/${course._id}`,
            {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(fieldsToUpdate)
            },
        );
        return response.status === 200;
    } catch (error: any) {
        throw new Error(`error while updating course: ${error.message}`);
    }
}

export const deleteCourse = async (courseId: string): Promise<boolean> => {
    try {
        const response = await fetch(
            `${COURSES_SERVICE_ENDPOINTS.COURSES}/${courseId}`,
            {
                method: "DELETE",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        return response.status === 200;
    } catch (error: any) {
        throw new Error(`Error while deleting course: ${error.message}`);
    }
};