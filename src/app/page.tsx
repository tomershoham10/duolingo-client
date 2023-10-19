"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLoggedIn, useUser } from "./utils/context/UserContext";

export default function Home() {
    const isLoggedIn = useLoggedIn();
    const { userRole } = useUser();
    const router = useRouter();

    useEffect(() => {
        console.log("/", isLoggedIn, "isLoggedIn", "userRole", userRole);
        !isLoggedIn
            ? router.push("/Login")
            : userRole === "admin"
            ? router.push("/classroom")
            : router.push("/learn");
    }, [isLoggedIn, router, userRole]);
    return <></>;
}
