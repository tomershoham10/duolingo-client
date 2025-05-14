import { useAlertStore, AlertSizes } from "@/app/store/stores/useAlertStore";
import { PermissionsTypes, useUserStore } from "@/app/store/stores/useUserStore";
import jwt from "jsonwebtoken";
import Cookies from 'js-cookie';

const useUserStoreObj = {

    updateUserName: useUserStore.getState().updateUserName,
    updatepermission: useUserStore.getState().updatepermission,
    updateCourseId: useUserStore.getState().updateCourseId,
    updateIsLoggedIn: useUserStore.getState().updateIsLoggedIn,
    updateNextLessonId: useUserStore.getState().updateNextLessonId,
    updateAccessToken: useUserStore.getState().updateAccessToken,
}

const addAlert = useAlertStore.getState().addAlert;

const host = process.env.NEXT_PUBLIC_HOST || 'localhost';

const ROUT = `http://${host}:4001`;

const USERS_SERVICE_ENDPOINT = `${ROUT}/api/users`;

export const USERS_API = {
    GET_USERS_BY_COURSE_ID: `${USERS_SERVICE_ENDPOINT}/getUsersByCourseId`,
    LOGIN: `${USERS_SERVICE_ENDPOINT}/login`,
    UPDATE_NEXT_LESSON_ID: `${USERS_SERVICE_ENDPOINT}/updateNextLessonId`,
    GET_ALL_USERS: `${USERS_SERVICE_ENDPOINT}/`,
}

export const registerUser = async (userName: string, tId: string, password: string, permission: string, courseId: string | undefined): Promise<number | undefined> => {
    try {
        const response = await fetch(`${USERS_SERVICE_ENDPOINT}`, {
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
        const response = await fetch(`${USERS_API.GET_USERS_BY_COURSE_ID}/${courseId}`, {
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
            `${USERS_API.LOGIN}`,
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
                    const role = decodedToken.role as PermissionsTypes;
                    const userId = decodedToken.userId as string;
                    const courseId = decodedToken.courseId as string;
                    const nextLessonId = decodedToken.nextLessonId as string;

                    // console.log("role", role);
                    // console.log("api nextLessonId", nextLessonId);

                    localStorage.setItem("jwtToken", token);
                    Cookies.set('jwtToken', token);
                    useUserStoreObj.updateUserName(userName);
                    useUserStoreObj.updatepermission(role);
                    useUserStoreObj.updateIsLoggedIn(true);
                    useUserStoreObj.updateNextLessonId(nextLessonId);
                    useUserStoreObj.updateAccessToken(token);

                    if (role !== PermissionsTypes.ADMIN) {
                        useUserStoreObj.updateCourseId(decodedToken.courseId); //

                        // console.log('getting course data to local storage');
                        // await getCourseByType(
                        //     mappermissionToCourseType(role),
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
            `${USERS_API.UPDATE_NEXT_LESSON_ID}/${userId}`,
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
            let userData: any = { userName: data.userName, userId: data._id, permission: data.permission, nextLessonId: data.nextLessonId, isLoggedIn: true }

            data.courseId ? userData = { ...userData, 'courseId': data.courseId } : null
            localStorage.setItem(
                "userData",
                JSON.stringify(userData),
            );
            return userData;
        } else return null
    } catch (error) {
        console.error("updating user Error:", error);
        return null;
    }
}

export const getAllUsers = async (): Promise<UserType[] | null> => {
    try {
        const response = await fetch(`${USERS_API.GET_ALL_USERS}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if (response.ok) {
            const usersList = await response.json() as UserType[];
            console.log("get all users", usersList);
            return usersList;
        } else return null;
    }
    catch (error) {
        console.error("getAllUsers Error:", error);
        return null;
    }
}
