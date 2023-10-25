"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useStore from "./store/useStore";
import { useUserStore, TypesOfUser } from "./store/stores/useUserStore";

export default function Home() {
    const userRole = useStore(useUserStore, (state) => state.userRole);
    const isLoggedIn = useStore(useUserStore, (state) => state.isLoggedIn);

    const router = useRouter();

    useEffect(() => {
        console.log("/", isLoggedIn, "isLoggedIn", "userRole", userRole);
        !isLoggedIn
            ? router.push("/Login")
            : userRole === TypesOfUser.ADMIN
            ? router.push("/classroom")
            : router.push("/learn");
    }, [isLoggedIn, router, userRole]);
    return <></>;
}
