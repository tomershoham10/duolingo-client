"use client"
import { create } from 'zustand';
import { mountStoreDevtool } from 'simple-zustand-devtools';

type CourseState = {
    _id: string | undefined;
    name: string | undefined;
    units: string[] | undefined
    coursesList: { _id: string | undefined, name: string | undefined, units: string[] | undefined }[];

}
type Action = {
    updateCourseId: (_id: CourseState['_id']) => void;
    updateCourseName: (name: CourseState['name']) => void;
    updateUnitsList: (units: CourseState['units']) => void;
    updateCoursesList: (coursesList: CourseState['coursesList']) => void;
}


export const useCourseStore = create<CourseState & Action>(
    (set) => ({
        _id: undefined,
        name: undefined,
        units: undefined,
        coursesList: [{ _id: undefined, name: undefined, units: undefined }],
        updateCourseId: (_id) => set(() => ({ _id: _id })),
        updateCourseName: (name) => set(() => ({ name: name })),
        updateUnitsList: (units) => set(() => ({ units: units })),
        updateCoursesList: (coursesList) => set(() => ({ coursesList: coursesList })),
    })
)

if (typeof window !== 'undefined' && localStorage) {
    const coursesData = localStorage.getItem("coursesData");
    if (coursesData) {
        const parsedData = JSON.parse(coursesData);
        console.log("useCourseStore parsedData", parsedData)
        useCourseStore.getState().updateCourseId(parsedData._id);
        useCourseStore.getState().updateCourseName(parsedData.name);
        useCourseStore.getState().updateUnitsList(parsedData.units);
    }
}

if (process.env.NODE_ENV === 'development') {
    mountStoreDevtool('CourseStore', useCourseStore);
}
