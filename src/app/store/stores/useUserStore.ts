"use client"
import { create } from 'zustand';
import { mountStoreDevtool } from 'simple-zustand-devtools';

//*********************************************************************//
// to import a store value :
// // const userRole = useStore(useUserStore, (state) => state.userRole);

// to import a store function :
// // const updateUserRole = useUserStore.getState().updateUserRole;
//*********************************************************************//


export enum TypesOfUser {
    LOGGEDOUT = "loggedOut",
    ADMIN = "admin",
    SEARIDER = "searider",
    SENIOR = "senior",
    TEACHER = "teacher",
    CREW = "crew",
}

type UserState = {
    userName: string | undefined;
    userId: string | undefined;
    userRole: TypesOfUser;
    isLoggedIn: boolean;
    accessToken: string | undefined;
}
type Action = {
    updateUserName: (userName: UserState['userName']) => void;
    updateUserId: (userId: UserState['userId']) => void;
    updateUserRole: (userRole: UserState['userRole']) => void;
    updateIsLoggedIn: (isLoggedIn: UserState['isLoggedIn']) => void;
    updateAccessToken: (accessToken: UserState['accessToken']) => void;
}


export const useUserStore = create<UserState & Action>(
    (set) => ({
        userName: undefined,
        userId: undefined,
        userRole: TypesOfUser.LOGGEDOUT,
        isLoggedIn: false,
        accessToken: undefined,
        updateUserName: (userName) => set(() => ({ userName: userName })),
        updateUserId: (userId) => set(() => ({ userId: userId })),
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
        // console.log("parsedData", parsedData);
        useUserStore.getState().updateUserName(parsedData.userName);
        useUserStore.getState().updateUserId(parsedData.userId);
        useUserStore.getState().updateUserRole(parsedData.userPermission);
        useUserStore.getState().updateIsLoggedIn(parsedData.isLoggedIn);
        useUserStore.getState().updateAccessToken(parsedData.accessToken);
        // console.log("getState", useUserStore.getState())
    }
}

if (process.env.NODE_ENV === 'development') {
    mountStoreDevtool('UserStore', useUserStore);
}