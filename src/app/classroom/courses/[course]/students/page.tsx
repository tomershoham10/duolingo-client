"use client";
import Table from "@/app/components/Table/page";
import useStore from "@/app/store/useStore";
import { useCourseStore } from "@/app/store/stores/useCourseStore";
import { useEffect, useState } from "react";

interface UserType {
    id: string;
    userName: string;
    permission: string;
    password: string;
}

const Students = () => {
    const courseType = useStore(useCourseStore, (state) => state.courseType);

    const [users, setUsers] = useState<UserType[]>([]);

    useEffect(() => {
        // console.log("CourseType in students page.tsx", courseType);

        if (courseType) {
            const getStudents = async () => {
                const response = await fetch(
                    `http://localhost:4001/api/users/permission/${courseType}`,
                    {
                        method: "GET",
                        credentials: "include",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    },
                );
                const users = await response.json();
                setUsers(users);
            };
            getStudents();
        }
    }, [courseType]);
    // console.log(`students in ${courseType} course: `, users);

    const headers = ["userName", "permission", "password"];

    return (
        <>
            {courseType ? (
                <div className="ml-10 mt-6">
                    <p className="text-2xl text-duoGray-darkest font-extrabold">
                        {Object.values(users).length} students
                    </p>

                    <Table headers={headers} data={users} />
                </div>
            ) : null}
        </>
    );
};
export default Students;
