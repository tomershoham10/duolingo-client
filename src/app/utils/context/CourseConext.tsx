"use client";
import { TypesOfCourses } from "@/app/store/stores/useCourseStore";
import { usePathname } from "next/navigation";
import { ReactNode, createContext, useContext, useState } from "react";


interface CourseContextType {
    CourseType: TypesOfCourses | undefined;
    setCourseType: (course: TypesOfCourses) => void;
    CourseId: string | undefined;
    setCourseId: (courseId: string | undefined) => void;
    CoursesList: { courseType: TypesOfCourses; courseId: string }[];
    setCoursesList: (
        couses: { courseType: TypesOfCourses; courseId: string }[],
    ) => void;
}

export const CourseContext = createContext<CourseContextType>({
    CourseType: undefined,
    setCourseType: () => {},
    CourseId: undefined,
    setCourseId: () => {},
    CoursesList: [],
    setCoursesList: () => {},
});

export function CourseProvider({ children }: { children: ReactNode }) {
    const pathname = usePathname();

    const [courseType, setCourseType] = useState<TypesOfCourses | undefined>(
        undefined,
    );
    const [CourseId, setCourseId] = useState<string | undefined>(undefined);

    const [CoursesList, setCoursesList] = useState<
        { courseType: TypesOfCourses; courseId: string }[]
    >([]);

    if (
        pathname.includes("/classroom/courses/searider") &&
        courseType !== TypesOfCourses.searider
    ) {
        setCourseType(TypesOfCourses.searider);
    } else if (
        pathname.includes("/classroom/courses/senior") &&
        courseType !== TypesOfCourses.senior
    ) {
        setCourseType(TypesOfCourses.senior);
    }

    return (
        <CourseContext.Provider
            value={{
                CourseType: courseType,
                setCourseType,
                CourseId,
                setCourseId,
                CoursesList,
                setCoursesList,
            }}
        >
            {children}
        </CourseContext.Provider>
    );
}

export function useCourseType(): TypesOfCourses | undefined {
    const { CourseType } = useContext(CourseContext);
    return CourseType;
}

export function useSetCourseType() {
    const { setCourseType } = useContext(CourseContext);
    return setCourseType;
}

export function useCourseId() {
    const { CourseId } = useContext(CourseContext);
    return CourseId;
}

export function useSetCourseId() {
    const { setCourseId } = useContext(CourseContext);
    return setCourseId;
}
