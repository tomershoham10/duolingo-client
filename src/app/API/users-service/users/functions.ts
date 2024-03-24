import { useAlertStore, AlertSizes } from "@/app/store/stores/useAlertStore";
import { TypesOfUser, useUserStore } from "@/app/store/stores/useUserStore";

import jwt from "jsonwebtoken";
// import { getCourseByType } from "../../classes-service/courses/functions";

const useUserStoreObj = {

    updateUserName: useUserStore.getState().updateUserName,
    updateUserRole: useUserStore.getState().updateUserRole,
    updateCourseId: useUserStore.getState().updateCourseId,
    updateIsLoggedIn: useUserStore.getState().updateIsLoggedIn,
    updateNextLessonId: useUserStore.getState().updateNextLessonId,
    updateAccessToken: useUserStore.getState().updateAccessToken,
}

const addAlert = useAlertStore.getState().addAlert;

// const mapUserRoleToCourseType = (userRole: TypesOfUser): TypesOfCourses => {
//     // Map user roles to course types here
//     switch (userRole) {
//         case TypesOfUser.SEARIDER:
//             return TypesOfCourses.SEARIDER;
//         case TypesOfUser.SENIOR:
//             return TypesOfCourses.SENIOR;
//         case TypesOfUser.TEACHER:
//             return TypesOfCourses.UNDEFINED;
//         case TypesOfUser.CREW:
//             return TypesOfCourses.CREW;
//         default:
//             return TypesOfCourses.UNDEFINED;
//     }
// };

export const registerUser = async (userName: string, tId: string, password: string, permission: string, courseId: string | undefined): Promise<number | undefined> => {
    try {
        const response = await fetch(`http://localhost:4001/api/users/`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userName: userName,
                tId: tId,
                password: password,
                permission: permission,
                courseId: courseId
            }),
        });

        console.log("response - response user", response);
        return response.status;
    }
    catch (error) {
        console.error("registerUser Error:", error);
        return 404;
    }
}

export const getUsersByCourseId = async (courseId: string): Promise<UserType[] | null> => {
    try {
        const response = await fetch(`http://localhost:4001/api/users/getUsersByCourseId/${courseId}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if (response.ok) {
            const usersList = await response.json() as UserType[];
            console.log("get users by courseId", usersList);
            return usersList;
        } else return null;
    }
    catch (error) {
        console.error("registerUser Error:", error);
        return null;
    }
}

export const handleAuth = async (userName: string, password: string) => {
    try {
        const response = await fetch(
            "http://localhost:4001/api/users/login/",
            {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userName: userName,
                    password: password,
                }),
            },
        );

        if (response.status === 200) {
            // console.log("response", response);
            const tokenHeader = response.headers.get(
                "Authorization",
            ) as string;
            // console.log("tokenHeader", tokenHeader);
            if (tokenHeader) {
                const token = tokenHeader.split(" ")[1];
                if (token) {
                    const decodedToken = jwt.decode(
                        token,
                    ) as jwt.JwtPayload;
                    // console.log("api decodedToken",decodedToken);
                    const role = decodedToken.role as TypesOfUser;
                    const userId = decodedToken.userId as string;
                    const courseId = decodedToken.courseId as string;
                    const nextLessonId = decodedToken.nextLessonId as string;

                    // console.log("role", role);
                    // console.log("api nextLessonId", nextLessonId);

                    localStorage.setItem("jwtToken", token);
                    useUserStoreObj.updateUserName(userName);
                    useUserStoreObj.updateUserRole(role);
                    useUserStoreObj.updateIsLoggedIn(true);
                    useUserStoreObj.updateNextLessonId(nextLessonId);
                    useUserStoreObj.updateAccessToken(token);

                    if (role !== TypesOfUser.ADMIN) {
                        useUserStoreObj.updateCourseId(decodedToken.courseId); //

                        // console.log('getting course data to local storage');
                        // await getCourseByType(
                        //     mapUserRoleToCourseType(role),
                        // );
                    }

                    const userData = {
                        userName: userName,
                        userId: userId,
                        courseId: courseId,
                        isLoggedIn: true,
                        userPermission: role,
                        nextLessonId: nextLessonId,
                        accessToken: token,
                    };

                    console.log("decodedToken", decodedToken);

                    localStorage.setItem(
                        "userData",
                        JSON.stringify(userData),
                    );
                    return response.status;
                } else {
                    addAlert(
                        "Authorization header not found in response.",
                        AlertSizes.small,
                    );
                }
            }
        } else if (response.status === 401) {
            addAlert(
                "The username or password is incorrect.",
                AlertSizes.small,
            );
        } else {
            addAlert("Unknown error occurred.", AlertSizes.small);
        }
    } catch (error) {
        console.error("Authentication Error:", error);
    }
};

export const updateNextLessonIdForUser = async (userId: string): Promise<any | null> => {
    try {
        const response = await fetch(
            `http://localhost:4001/api/users/updateNextLessonId/${userId}`,
            {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );
        console.log("updateNextLessonIdForUser - response", response);
        if (response.ok) {
            const data = await response.json();
            const userData = { userName: data.userName, userId: data._id, userRole: data.permission, nextLessonId: data.nextLessonId, isLoggedIn: true }
            localStorage.setItem(
                "userData",
                JSON.stringify(userData),
            );
            return data;
        } else return null
    } catch (error) {
        console.error("updating user Error:", error);
        return null;
    }
}
