"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import useStore from "../store/useStore";
import { useUserStore } from "../store/stores/useUserStore";
import { useAlertStore, AlertSizes } from "../store/stores/useAlertStore";

import jwt from "jsonwebtoken";
import Input, { Types } from "../components/Input/page";
import Button, { Color } from "../components/Button/page";

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
    const updateAccessToken = useUserStore.getState().updateAccessToken;
    const updateUserRole = useUserStore.getState().updateUserRole;
    const updateIsLoggedIn = useUserStore.getState().updateIsLoggedIn;

    const isLoggedIn = useStore(useUserStore, (state) => state.isLoggedIn);
    const userRole = useStore(useUserStore, (state) => state.userRole);

    const addAlert = useAlertStore.getState().addAlert;

    console.log("login", isLoggedIn, userRole);
    useEffect(() => {
        if (isLoggedIn && userRole) {
            if (userRole === TypesOfUser.ADMIN) {
                router.push("/classroom");
            } else {
                router.push("/learn");
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
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

    const handleAuth = async () => {
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
                        userName: user,
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
                        const role = decodedToken.role as TypesOfUser;
                        // console.log(token, jwt.decode(token));
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

                        const userData = {
                            userName: user,
                            isLoggedIn: true,
                            userPermission: role,
                            accessToken: token,
                        };

                        localStorage.setItem(
                            "userData",
                            JSON.stringify(userData),
                        );
                        router.push("/", { scroll: false });
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
                        onClick={handleAuth}
                        href={""}
                    />
                </>
            )}
        </div>
    );
};

export default Login;
