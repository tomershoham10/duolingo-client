"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useStore from "./store/useStore";
import { useUserStore, TypesOfUser } from "./store/stores/useUserStore";
// import { getTargetsList } from "./API/classes-service/targets/functions";

const Home: React.FC = () => {
    const userRole = useStore(useUserStore, (state) => state.userRole);
    const isLoggedIn = useStore(useUserStore, (state) => state.isLoggedIn);
    const router = useRouter();

    useEffect(() => {
        if (!isLoggedIn) {
            router.push("/login");
        }
        if (userRole === TypesOfUser.ADMIN) {
            router.push("/classroom");
        } else if (userRole && userRole !== TypesOfUser.LOGGEDOUT) {
            router.push("/learn");
        }
    }, [isLoggedIn, router, userRole]);

    return null;
};

export default Home;
