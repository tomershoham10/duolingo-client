"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useStore from "./store/useStore";
import { useUserStore, TypesOfUser } from "./store/stores/useUserStore";
import { TypesOfCourses, useCourseStore } from "./store/stores/useCourseStore";

export default function Home() {
    const userRole = useStore(useUserStore, (state) => state.userRole);
    const isLoggedIn = useStore(useUserStore, (state) => state.isLoggedIn);
    const updateCourseType = useCourseStore.getState().updateCourseType;
    const router = useRouter();

    useEffect(() => {
        if (!isLoggedIn) {
            router.push("/Login");
        }
        if (userRole === TypesOfUser.ADMIN) {
            router.push("/classroom");
        } else if (userRole && userRole !== TypesOfUser.LOGGEDOUT) {
            const courseType = mapUserRoleToCourseType(userRole);
            updateCourseType(courseType);
            router.push("/learn");
        }
    }, [isLoggedIn, router, userRole]);

    const mapUserRoleToCourseType = (userRole: TypesOfUser): TypesOfCourses => {
        // Map user roles to course types here
        switch (userRole) {
            case TypesOfUser.SEARIDER:
                return TypesOfCourses.SEARIDER;
            case TypesOfUser.SENIOR:
                return TypesOfCourses.SENIOR;
            case TypesOfUser.TEACHER:
                return TypesOfCourses.UNDEFINED;
            case TypesOfUser.CREW:
                return TypesOfCourses.CREW;
            default:
                return TypesOfCourses.UNDEFINED;
        }
    };

    return null;
}
