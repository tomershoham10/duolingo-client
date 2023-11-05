"use client"
import { create } from 'zustand';
import { mountStoreDevtool } from 'simple-zustand-devtools';

export enum TypesOfCourses {
    UNDEFINED = "undefined",
    SEARIDER = "searider",
    CREW = "crew",
    SENIOR = "senior",
}

type CourseState = {
    courseType: TypesOfCourses;
    courseId: string | undefined;
    coursesList: { courseType: TypesOfCourses | undefined; courseId: string | undefined }[];

}
type Action = {
    updateCourseType: (courseType: CourseState['courseType']) => void;
    updateCourseId: (courseId: CourseState['courseId']) => void;
    updateCoursesList: (coursesList: CourseState['coursesList']) => void;
}


export const useCourseStore = create<CourseState & Action>(
    (set) => ({
        courseType: TypesOfCourses.undefined,
        courseId: undefined,
        coursesList: [{ courseType: TypesOfCourses.undefined, courseId: undefined }],
        updateCourseType: (courseType) => set(() => ({ courseType: courseType })),
        updateCourseId: (courseId) => set(() => ({ courseId: courseId })),
        updateCoursesList: (coursesList) => set(() => ({ coursesList: coursesList })),
    })
)

if (process.env.NODE_ENV === 'development') {
    mountStoreDevtool('CourseStore', useCourseStore);
}


