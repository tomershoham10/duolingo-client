"use client"
import { create } from 'zustand';
import { mountStoreDevtool } from 'simple-zustand-devtools';



type CourseState = {
    selectedCourse: CoursesType | null;
    coursesList: CoursesType[];
}
type Action = {
    // updateCourseId: (_id: CoursesType['_id']) => void;
    // updateCourseName: (name: CoursesType['name']) => void;
    // updateUnitsList: (units: CoursesType['unitsIds']) => void;
    // addCourse: (course:) => void;
    updateSelectedCourse: (selectedCourse: CourseState['selectedCourse']) => void;
    updateCoursesList: (coursesList: CourseState['coursesList']) => void;
}


export const useCourseStore = create<CourseState & Action>(
    (set) => ({
        selectedCourse: null,
        coursesList: [],
        // updateSelectedCourse: () => set((selectedCourse) => (selectedCourse: selectedCourse)),
        updateSelectedCourse: (selectedCourse) => set(() => ({ selectedCourse: selectedCourse })),
        // updateCourseName: (name) => set(() => ({ name: name })),
        // updateUnitsList: (units) => set(() => ({ units: units })),
        // addCourse: (course) => set((state) => ({ [...state.coursesList, course] })),
        updateCoursesList: (coursesList) => set(() => ({ coursesList: coursesList })),
    })
)

if (typeof window !== 'undefined' && localStorage) {
    const coursesData = localStorage.getItem("coursesData");
    if (coursesData) {
        const parsedData = JSON.parse(coursesData);
        console.log("useCourseStore parsedData", parsedData)
        // useCourseStore.getState().updateCourseId(parsedData._id);
        // useCourseStore.getState().updateCourseName(parsedData.name);
        // useCourseStore.getState().updateUnitsList(parsedData.units);
        useCourseStore.getState().updateSelectedCourse(parsedData.selectedCourse);
        useCourseStore.getState().updateCoursesList(parsedData.coursesList);
    }
}

if (process.env.NODE_ENV === 'development') {
    mountStoreDevtool('CourseStore', useCourseStore);
}
