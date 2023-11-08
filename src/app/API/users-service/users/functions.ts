import { useUserStore,TypesOfUser } from "@/app/store/stores/useUserStore";
import { useAlertStore, AlertSizes } from "@/app/store/stores/useAlertStore";


import jwt from "jsonwebtoken";
import { getCourseByType } from "../../classes-service/courses/functions";
import { TypesOfCourses } from "@/app/store/stores/useCourseStore";
const updateUserRole = useUserStore.getState().updateUserRole;
const updateIsLoggedIn = useUserStore.getState().updateIsLoggedIn;

const updateAccessToken = useUserStore.getState().updateAccessToken;

const addAlert = useAlertStore.getState().addAlert;

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
            console.log("response", response);
            const tokenHeader = response.headers.get(
                "Authorization",
            ) as string;
            console.log("tokenHeader", tokenHeader);
            if (tokenHeader) {
                const token = tokenHeader.split(" ")[1];
                if (token) {
                    const decodedToken = jwt.decode(
                        token,
                    ) as jwt.JwtPayload;
                    const role = decodedToken.role as TypesOfUser;
                    const userId = decodedToken.userId as string;

                    console.log("role", role);
                    console.log("userId", userId);

                    localStorage.setItem("jwtToken", token);
                    if (updateUserRole) {
                        updateUserRole(role);
                    }
                    if (updateIsLoggedIn) {
                        updateIsLoggedIn(true);
                    }
                    if (updateAccessToken) {
                        updateAccessToken(token);
                    }

                    if (role !== TypesOfUser.ADMIN) {
                        await getCourseByType(
                            mapUserRoleToCourseType(role),
                        );
                    }

                    const userData = {
                        userName: userName,
                        userId: userId,
                        isLoggedIn: true,
                        userPermission: role,
                        accessToken: token,
                    };

                    console.log("userData", userData);

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
