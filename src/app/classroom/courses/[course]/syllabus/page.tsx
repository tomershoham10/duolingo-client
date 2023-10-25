"use client";
import { useCourseStore } from "@/app/store/stores/useCourseStore";
import { useUserStore } from "@/app/store/stores/useUserStore";
import useStore from "@/app/store/useStore";
// import { CourseContext } from "@/app/utils/context/CourseConext";
// import { useContext } from "react";

const Syllabus: React.FC = () => {
    // const { CourseId } = useContext(CourseContext);
    
    const courseId = useStore(useCourseStore, (state) => state.courseId);


    const userRole = useStore(useUserStore, (state) => state.userRole);

    const getUnits = async () => {
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

                return data;
            } else {
                console.error("Failed to fetch course by id.");
                return [];
            }
        } catch (error) {
            console.error("Error fetching courses:", error);
            return [];
        }
    };

    return <div>syllabus {courseId}</div>;
};

export default Syllabus;
