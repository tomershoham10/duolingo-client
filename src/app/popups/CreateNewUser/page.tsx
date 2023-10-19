import React, { useContext, useState } from "react";
import { PopupContext, usePopup } from "@/app/utils/context/PopupContext";
import Input, { Types } from "@/app/components/Input/page";
import Button, { Color } from "@/app/components/Button/page";

const CreateNewUser: React.FC = () => {
    const { selectedPopup } = useContext(PopupContext);
    const setSelectedPopup = usePopup();

    const [userName, setUserName] = useState<string>("");
    const handleUserName = (value: string) => {
        setUserName(value);
    };

    return (
        <div
            className={
                selectedPopup === "NEW STUDENT"
                    ? "z-50 fixed flex justify-center items-center overflow-auto bg-[rgb(0,0,0)] bg-[rgba(0,0,0,0.4)] w-full h-full"
                    : "hidden"
            }
        >
            <div className="bg-white w-[40rem] h-[27rem] rounded-md">
                <button
                    onClick={() => {
                        setSelectedPopup("");
                    }}
                >
                    <span>x</span>
                </button>
                <div className="my-4 mx-24 grid grid-cols-4 grid-rows-6 flex-col justify-center items-center">
                    <p className="col-span-4 font-extrabold text-2xl flex justify-center items-center mb-10 text-[#4B4B4B]">
                        CREATE NEW STUDENT
                    </p>

                    <p className="col-span-1 font-bold text-lg text-[#4B4B4B]">
                        User Name:
                    </p>

                    <div className="col-span-3 flex flex-col justify-center items-center">
                        <Input
                            type={Types.text}
                            placeholder={"User Name"}
                            value={userName}
                            onChange={handleUserName}
                        />
                    </div>

                    <p className="col-span-1 font-bold text-lg text-[#4B4B4B]">
                        Password:
                    </p>

                    <div className="col-span-3 flex flex-col justify-center items-center">
                        <Input
                            type={Types.password}
                            placeholder={"Password"}
                            value={userName}
                            onChange={handleUserName}
                        />
                    </div>

                    <div className="col-span-2 col-start-2 row-start-5 flex justify-center">
                        <Button
                            label={"CREATE"}
                            color={Color.blue}
                            onClick={function (): void {
                                throw new Error("Function not implemented.");
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateNewUser;
