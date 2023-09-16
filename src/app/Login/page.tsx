"use client";
import { useState } from "react";
import Input, { Types } from "../components/Input/page";
import Button, { Color } from "../components/Button/page";
import { NextResponse } from "next/server";

export default function Page() {
    const API_KEY: string = "DaveGrayTeachingCode";

    const [user, setUser] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [data, setData] = useState(null);

    const handleUser = (value: string) => {
        setUser(value);
    };

    const handlePassword = (value: string) => {
        setPassword(value);
    };

    const handleAuth = async (user: string, password: string) => {
        try {
            console.log(user, password);
            const response = await fetch(
                "http://localhost:8080/api/users/validate/",
                {
                    method: "POST",
                    body: JSON.stringify({
                        userName: user,
                        password: password,
                    }),
                },
            );
            console.log(response);
            if (response.ok) {
                const responseData = await response.json();
                console.log("Authentication Response:", responseData);
            }
            // const ress = NextResponse.json(response);
            // console.log(ress);
            // console.log("abc");
            // console.log("Authentication Response:", response);
        } catch (error) {
            console.error("Authentication Error:");

            console.error("Authentication Error:", error);
        }
    };
    return (
        <div className="flex flex-col justify-end items-center mx-auto w-[350px]">
            <label className="font-extrabold text-2xl">Log in</label>
            <Input
                type={Types.text}
                placeholder="Username"
                value={user}
                isPassword={false}
                onChange={handleUser}
            />
            <Input
                type={Types.password}
                placeholder="Password"
                value={password}
                isPassword={true}
                onChange={handlePassword}
            />
            <Button
                label="LOG IN"
                color={Color.blue}
                onClick={() => handleAuth(user, password)}
            />
        </div>
    );
}
