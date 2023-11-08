"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import useStore from "../store/useStore";
import { useUserStore } from "../store/stores/useUserStore";
import Input, { Types } from "../components/Input/page";
import Button, { Color } from "../components/Button/page";
import { handleAuth } from "../API/users-service/users/functions";

enum TypesOfUser {
    LOGGEDOUT = "loggedOut",
    ADMIN = "admin",
    SEARIDER = "searider",
    SENIOR = "senior",
    TEACHER = "teacher",
    CREW = "crew",
}

const Login: React.FC = () => {
    const router = useRouter();
    const [user, setUser] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const updateUserName = useUserStore.getState().updateUserName;

    const isLoggedIn = useStore(useUserStore, (state) => state.isLoggedIn);
    const userRole = useStore(useUserStore, (state) => state.userRole);

    useEffect(() => {
        if (isLoggedIn && userRole) {
            if (userRole === TypesOfUser.ADMIN) {
                router.push("/classroom");
            } else {
                router.push("/learn");
            }
        }
    }, [isLoggedIn, userRole]);

    const handleUser = (value: string) => {
        setUser(value);
        if (updateUserName) {
            updateUserName(value);
        }
    };

    const handlePassword = (value: string) => {
        setPassword(value);
    };

    return (
        <div
            className="flex flex-col justify-start items-center pt-10 mx-auto w-[350px] space-y-3"
            suppressHydrationWarning
        >
            {isLoggedIn ? null : (
                <>
                    <label className="font-extrabold text-2xl">Log in</label>
                    <Input
                        type={Types.text}
                        placeholder="Username"
                        value={user}
                        onChange={handleUser}
                    />
                    <Input
                        type={Types.password}
                        placeholder="Password"
                        value={password}
                        onChange={handlePassword}
                    />
                    <Button
                        label="LOG IN"
                        color={Color.blue}
                        onClick={() => handleAuth(user, password)}
                        href={""}
                    />
                </>
            )}
        </div>
    );
};

export default Login;
