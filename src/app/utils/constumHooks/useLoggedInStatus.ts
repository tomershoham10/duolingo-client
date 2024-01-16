// "use client";
// import { useState, useEffect } from 'react';
// import { useStore } from 'zustand';
// import { useUserStore } from '@/app/store/stores/userStore';

// interface LoggedInStatus {
//     loggedIn: boolean;
// }

// export const useLoggedInStatus = (): LoggedInStatus => {
//     const [loggedIn, setLoggedIn] = useState<boolean>(false);
//     const isLoggedIn = useStore(useUserStore, (state) => state.isLoggedIn);
//     console.log("useLoggedInStatus", isLoggedIn);
//     useEffect(() => {
//         if (isLoggedIn) {
//             setLoggedIn(true);
//         }
//     }, [isLoggedIn]);

//     return { loggedIn };
// };
