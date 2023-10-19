"use client";
import Table from "@/app/components/Table/page";
import { useCourse } from "@/app/utils/context/CourseConext";
// import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface UserType {
    id: string;
    userName: string;
    permission: string;
    password: string;
}

const Students = () => {
    const { CourseType } = useCourse();
    const [users, setUsers] = useState<UserType[]>([]);

    useEffect(() => {
        console.log("CourseType in students page.tsx", CourseType);

        const getStudents = async () => {
            const response = await fetch(
                `http://localhost:4001/api/users/permission/${CourseType}`,
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
    }, [CourseType]);
    console.log(`students in ${CourseType} course: `, users);

    const headers = ["userName", "permission", "password"];

    const data = [
        { userName: "John", permission: "Admin", grade: 95, time: "1h" },
        { userName: "Alice", permission: "User", grade: 80, time: "1.5h" },
        { userName: "John", permission: "Admin", grade: 95, time: "1h" },
        { userName: "Alice", permission: "User", grade: 80, time: "1.5h" },
        { userName: "John", permission: "Admin", grade: 95, time: "1h" },
        { userName: "Alice", permission: "User", grade: 80, time: "1.5h" },
        { userName: "John", permission: "Admin", grade: 95, time: "1h" },
        { userName: "Alice", permission: "User", grade: 80, time: "1.5h" },
        { userName: "John", permission: "Admin", grade: 95, time: "1h" },
        { userName: "Alice", permission: "User", grade: 80, time: "1.5h" },
        { userName: "John", permission: "Admin", grade: 95, time: "1h" },
        { userName: "Alice", permission: "User", grade: 80, time: "1.5h" },
        { userName: "John", permission: "Admin", grade: 95, time: "1h" },
        { userName: "Alice", permission: "User", grade: 80, time: "1.5h" },
        { userName: "John", permission: "Admin", grade: 95, time: "1h" },
        { userName: "Alice", permission: "User", grade: 80, time: "1.5h" },
        { userName: "John", permission: "Admin", grade: 95, time: "1h" },
        { userName: "Alice", permission: "User", grade: 80, time: "1.5h" },
        { userName: "John", permission: "Admin", grade: 95, time: "1h" },
        { userName: "Alice", permission: "User", grade: 80, time: "1.5h" },
        { userName: "John", permission: "Admin", grade: 95, time: "1h" },
        { userName: "Alice", permission: "User", grade: 80, time: "1.5h" },
        { userName: "John", permission: "Admin", grade: 95, time: "1h" },
        { userName: "Alice", permission: "User", grade: 80, time: "1.5h" },
        { userName: "John", permission: "Admin", grade: 95, time: "1h" },
        { userName: "Alice", permission: "User", grade: 80, time: "1.5h" },
        { userName: "John", permission: "Admin", grade: 95, time: "1h" },
        { userName: "Alice", permission: "User", grade: 80, time: "1.5h" },
    ];

    return (
        <div className="m-10">
            <p className="text-2xl text-[#4B4B4B] font-extrabold">
                {Object.values(users).length} students
            </p>
            {/* {users.map((user, index) => (
                <p key={index}>{user.userName}</p>
            ))} */}
            <Table headers={headers} data={users} />
        </div>
    );
};
export default Students;
