"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import jwt from "jsonwebtoken";
import Input, { Types } from "../components/Input/page";
import Button, { Color } from "../components/Button/page";
import { useUser } from "@/app/utils/context/UserContext";

const Page: React.FC = () => {
    const router = useRouter();

    const { setUserRole, setLoggedIn } = useUser();

    const [user, setUser] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const handleUser = (value: string) => {
        setUser(value);
    };

    const handlePassword = (value: string) => {
        setPassword(value);
    };

    const handleAuth = async () => {
        try {
            console.log(user, password);
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
                        const role = decodedToken.role as string;
                        console.log(token, jwt.decode(token));
                        localStorage.setItem("jwtToken", token);
                        setUserRole(role);
                        setLoggedIn(true);
                        localStorage.setItem("userRole", role);

                        localStorage.setItem("isLoggedIn", "true");
                        router.push("/", { scroll: false });
                    } else {
                        alert("Authorization header not found in response");
                    }
                }
            } else if (response.status === 401) {
                alert("The username or password is incorrect.");
            } else {
                alert("Unknown error occurred.");
            }
        } catch (error) {
            console.error("Authentication Error:", error);
        }
    };

    return (
        <div className="flex flex-col justify-start items-center pt-10 mx-auto w-[350px]">
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
        </div>
    );
};

export default Page;
