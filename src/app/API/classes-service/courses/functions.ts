import { COURSES_API, COURSES_SERVICE_ENDPOINTS } from "../apis";

interface LessonData extends LessonType {
    exercises: ExerciseType[];
}

interface LevelData extends LevelType {
    lessons: LessonData[];
}

interface UnitData extends UnitType {
    levels: LevelData[];
}

interface CourseData extends CoursesType {
    units: UnitData[];
}

export const createCourse = async (name: string): Promise<number | null> => {
    try {
        console.log('createCourse', name);
        const response = await fetch(COURSES_SERVICE_ENDPOINTS.COURSES, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name: name })
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
            `http://localhost:8080/api/courses/${courseId}`,
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

            localStorage.setItem('courseData', updatedData);
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
        // console.log("courses api - courseName", courseName);
        const response = await fetch(`${COURSES_API.GET_COURSE_BY_NAME}/${courseName}`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });
        // console.log("courses api - response", response);

        if (response.ok) {
            const data = await response.json();
            const course = data.course as CoursesType;
            // console.log("api getCourseByType", course);
            // console.log("courses api - course", data, course);
            const storedData = localStorage.getItem('courseData');
            let courseData = storedData ? JSON.parse(storedData) : {};
            courseData['selectedCourse'] = course;
            const updatedData = JSON.stringify(courseData);

            localStorage.setItem(
                "courseData",
                JSON.stringify(updatedData),
            );
            // console.log("getCourseByType", course);
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
        // console.log("getCourseDataById", courseId);
        const response = await fetch(
            `${COURSES_API.GET_COURSE_DATA_BY_ID}/${courseId}`,
            {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );
        if (response.ok) {
            const data = await response.json();
            const resData = data.courseData[0] as CourseData;
            // console.log("resUnits", resUnits);
            return resData;
        } else {
            console.error('error while fetching course');
            return null;
        }
    } catch (error: any) {
        throw new Error(`error while fetching units: ${error.message}`);
    }
};

export const getUnsuspendedUnitsData = async (courseId: string): Promise<UnitType[]> => {
    try {
        // console.log("getUnsuspendedUnitsData", courseId);
        const response = await fetch(
            `${COURSES_API.GET_UNSUSPENDED_UNITS_BY_ID}/${courseId}`,
            {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );
        if (response.status === 404) {
            return [];
        }
        if (response.ok) {
            const data = await response.json();
            const resUnits = data.units as UnitType[];
            // console.log("resUnits", resUnits);
            return resUnits;
        } else {
            throw new Error('error while fetching units');
        }
    } catch (error: any) {
        throw new Error(`error while fetching units: ${error.message}`);
    }
};

export const updateCourse = async (course: Partial<CoursesType>): Promise<boolean> => {
    try {
        let fieldsToUpdate: Partial<CoursesType> = {};

        course.name ? fieldsToUpdate.name : null;
        course.unitsIds ? fieldsToUpdate.unitsIds : null;
        course.suspendedUnitsIds ? fieldsToUpdate.suspendedUnitsIds : null;

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

export const suspendUnit = async (courseId: string, unitId: string): Promise<boolean> => {
    try {
        const response = await fetch(
            `${COURSES_API.SUSPENDED_UNITS}/${courseId}/${unitId}`,
            {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );
        return response.status === 200;
    } catch (error: any) {
        throw new Error(`error while suspend Unit: ${error.message}`);
    }
}

export const unsuspendUnit = async (courseId: string, unitId: string): Promise<boolean> => {
    try {
        const response = await fetch(
            `${COURSES_API.UNSUSPENDED_UNIT}/${courseId}/${unitId}`,
            {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );
        return response.status === 200;
    } catch (error: any) {
        throw new Error(`error while unsuspend Unit: ${error.message}`);
    }
}