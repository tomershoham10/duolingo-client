"use client"
import { create } from 'zustand';

enum TypesOfUser {
    LOGGEDOUT = "loggedOut",
    ADMIN = "admin",
    SEARIDER = "searider",
    SENIOR = "senior",
    TEACHER = "teacher",
    CREW = "crew",
}

type UserState = {
    userName: string | undefined;
    userRole: TypesOfUser;
    isLoggedIn: boolean;
    accessToken: string | undefined;
}
type Action = {
    updateUserName: (userName: UserState['userName']) => void;
    updateUserRole: (userRole: UserState['userRole']) => void;
    updateIsLoggedIn: (isLoggedIn: UserState['isLoggedIn']) => void;
    updateAccessToken: (accessToken: UserState['accessToken']) => void;
}


export const useUserStore = create<UserState & Action>(
    (set) => ({
        userName: undefined,
        userRole: TypesOfUser.LOGGEDOUT,
        isLoggedIn: false,
        accessToken: undefined,
        updateUserName: (userName) => set(() => ({ userName: userName })),
        updateUserRole: (userRole) => set(() => ({ userRole: userRole })),
        updateIsLoggedIn(value) {
            set(state => ({ ...state, isLoggedIn: value }))
        },
        updateAccessToken: (accessToken) => set(() => ({ accessToken: accessToken })),
    })
)

if (typeof window !== 'undefined' && localStorage) {
    const userData = localStorage.getItem("userData");
    if (userData) {
        const parsedData = JSON.parse(userData);
        console.log("parsedData", parsedData);
        useUserStore.getState().updateUserName(parsedData.userName);
        useUserStore.getState().updateUserRole(parsedData.userPermission);
        useUserStore.getState().updateIsLoggedIn(parsedData.isLoggedIn);
        useUserStore.getState().updateAccessToken(parsedData.accessToken);
        console.log("getState", useUserStore.getState())
    }
    // useUserStore.setState((state: any) => ({
    //     ...state,
    //     userName: parsedData.userName,
    //     userRole: parsedData.userPermission,
    //     isLoggedIn: parsedData.isLoggedIn,
    //     accessToken: parsedData.accessToken,
    // }));
}

