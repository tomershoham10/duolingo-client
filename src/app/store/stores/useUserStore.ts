"use client"
import { create } from 'zustand';
import { mountStoreDevtool } from 'simple-zustand-devtools';

//*********************************************************************//
// to import a store value :
// // const permission = useStore(useUserStore, (state) => state.permission);

// to import a store function :
// // const updatepermission = useUserStore.getState().updatepermission;
//*********************************************************************//


export enum PermissionsTypes {
    ADMIN = "admin",
    TEACHER = "teacher",
    CREW = "crew",
    STUDENT = "student",
    LOGGEDOUT= "loggedOut"
}

type UserState = {
    userName: string | undefined;
    userId: string | undefined;
    courseId: string | undefined;
    permission: PermissionsTypes;
    nextLessonId: string | undefined;
    isLoggedIn: boolean;
    accessToken: string | undefined;
}
type Action = {
    updateUserName: (userName: UserState['userName']) => void;
    updateUserId: (userId: UserState['userId']) => void;
    updateCourseId: (courseId: UserState['courseId']) => void;
    updatepermission: (permission: UserState['permission']) => void;
    updateNextLessonId: (nextLessonId: UserState['nextLessonId']) => void;
    updateIsLoggedIn: (isLoggedIn: UserState['isLoggedIn']) => void;
    updateAccessToken: (accessToken: UserState['accessToken']) => void;
}


export const useUserStore = create<UserState & Action>(
    (set) => ({
        userName: undefined,
        userId: undefined,
        courseId: undefined,
        permission: PermissionsTypes.LOGGEDOUT,
        nextLessonId: undefined,
        isLoggedIn: false,
        accessToken: undefined,
        updateUserName: (userName) => set(() => ({ userName: userName })),
        updateUserId: (userId) => set(() => ({ userId: userId })),
        updateCourseId: (courseId) => set(() => ({ courseId: courseId })),
        updatepermission: (permission) => set(() => ({ permission: permission })),
        updateNextLessonId: (nextLessonId) => set(() => ({ nextLessonId: nextLessonId })),
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
        useUserStore.getState().updateCourseId(parsedData.courseId);
        useUserStore.getState().updatepermission(parsedData.userPermission);
        useUserStore.getState().updateNextLessonId(parsedData.nextLessonId);
        useUserStore.getState().updateIsLoggedIn(parsedData.isLoggedIn);
        useUserStore.getState().updateAccessToken(parsedData.accessToken);
        // console.log("getState", useUserStore.getState())
    }
}

if (process.env.NODE_ENV === 'development') {
    mountStoreDevtool('UserStore', useUserStore);
}