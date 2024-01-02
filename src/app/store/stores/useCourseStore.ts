"use client"
import { create } from 'zustand';
import { mountStoreDevtool } from 'simple-zustand-devtools';

type CourseState = {
    courseId: string | undefined;
    courseName: string | undefined;
    unitsList: string[] | undefined
    coursesList: { courseName: string | undefined; courseId: string | undefined, unitsList: string[] | undefined }[];

}
type Action = {
    updateCourseId: (courseId: CourseState['courseId']) => void;
    updateCourseName: (courseName: CourseState['courseName']) => void;
    updateUnitsList: (unitsList: CourseState['unitsList']) => void;
    updateCoursesList: (coursesList: CourseState['coursesList']) => void;
}


export const useCourseStore = create<CourseState & Action>(
    (set) => ({
        courseId: undefined,
        courseName: undefined,
        unitsList: undefined,
        coursesList: [{ courseName: undefined, courseId: undefined, unitsList: undefined }],
        updateCourseName: (courseName) => set(() => ({ courseName: courseName })),
        updateCourseId: (courseId) => set(() => ({ courseId: courseId })),
        updateUnitsList: (unitsList) => set(() => ({ unitsList: unitsList })),
        updateCoursesList: (coursesList) => set(() => ({ coursesList: coursesList })),
    })
)

if (typeof window !== 'undefined' && localStorage) {
    const userData = localStorage.getItem("courseData");
    if (userData) {
        const parsedData = JSON.parse(userData);
        console.log("useCourseStore parsedData", parsedData)
        useCourseStore.getState().updateCourseId(parsedData._id);
        useCourseStore.getState().updateCourseName(parsedData.name);
        useCourseStore.getState().updateUnitsList(parsedData.units);
    }
}

if (process.env.NODE_ENV === 'development') {
    mountStoreDevtool('CourseStore', useCourseStore);
}


