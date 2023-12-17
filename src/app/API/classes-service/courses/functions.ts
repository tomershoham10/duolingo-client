import { TypesOfCourses } from "@/app/store/stores/useCourseStore";
import { UnitType } from "../units/functions";

export interface CoursesType {
    _id: string;
    type: TypesOfCourses;
    units: string[];
}

export const getCourses = async () => {
    try {
        const response = await fetch("http://localhost:8080/api/courses/", {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.ok) {
            const data = await response.json();
            const coursesObject = data.courses as {
                _id: string;
                type: TypesOfCourses;
                units: UnitType[];
            }[];

            const coursesList: {
                courseId: string;
                courseType: TypesOfCourses;
                units: UnitType[]
            }[] = Object.values(coursesObject).map(
                (course: { _id: string; type: TypesOfCourses; units: UnitType[] }) => ({
                    courseId: course._id as string,
                    courseType: course.type as TypesOfCourses,
                    units: course.units as UnitType[],
                }),
            );
            // console.log("coursesList check", coursesList);
            return coursesList;
        } else {
            console.error("Failed to fetch courses.");
            return [];
        }
    } catch (error) {
        console.error("Error fetching courses:", error);
        return [];
    }
};

export const getCourseByType = async (courseType: TypesOfCourses): Promise<CoursesType | null> => {
    try {
        console.log("courses api - courseType", courseType);
        const response = await fetch(`http://localhost:8080/api/courses/getByType/${courseType}`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });
        console.log("courses api - response", response);

        if (response.ok) {
            const data = await response.json();
            const course = data.course as CoursesType;
            // console.log("api getCourseByType", course);
            console.log("courses api - course", data, course);

            localStorage.setItem(
                "courseData",
                JSON.stringify(course),
            );
            // console.log("getCourseByType", course);
            return course;
        } else {
            console.error("Failed to fetch courses.");
            return null;
        }
    } catch (error) {
        console.error("Error fetching courses:", error);
        return null;
    }
};

export const getUnitsData = async (courseId: string) => {
    try {
        // console.log("getUnitsData", courseId);
        const response = await fetch(
            `http://localhost:8080/api/courses/getUnitsById/${courseId}`,
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
            const resUnits = data.units;
            // console.log("resUnits", resUnits);
            return resUnits
        } else {
            console.error("Failed to fetch course by id.");
            return null;
        }
    } catch (error) {
        console.error("Error fetching courses:", error);
        return null;
    }
};