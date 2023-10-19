"use client";
import { usePathname } from "next/navigation";
import { ReactNode, createContext, useContext, useState } from "react";

enum TypesOfCourses {
    searider = "searider",
    crew = "crew",
    senior = "senior",
}

interface CourseContextType {
    CourseType: TypesOfCourses | undefined;
    setCourseType: (course: TypesOfCourses) => void;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export function CourseProvider({ children }: { children: ReactNode }) {
    const pathname = usePathname();

    const [courseType, setCourseType] = useState<TypesOfCourses | undefined>(
        undefined,
    );

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
            value={{ CourseType: courseType, setCourseType }}
        >
            {children}
        </CourseContext.Provider>
    );
}

export function useCourse() {
    const context = useContext(CourseContext);
    if (context === undefined) {
        throw new Error("useCourse must be used within a CourseProvider");
    }
    return context;
}
