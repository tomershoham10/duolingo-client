"use client";

export enum Types {
    text = "text",
    password = "password",
}

interface InputProps {
    type: Types;
    placeholder?: string;
    value: string;
    onChange: (value: string) => void;
    className?: string;
}

const Input: React.FC<InputProps> = ({
    type,
    placeholder,
    value,
    onChange,
    className,
}) => {
    return (
        <form
            className={`${className} mb-4 text-[16px] w-full text-[#AFAFAF] flex flex-row items-center justify-center h-fit content-center`}
        >
            <input
                type={type}
                className="bg-[#F7F7F7] border-2 border-[#E5E5E5] rounded-lg px-3 py-2 w-full 
                focus:outline-none text-[#4B4B4B]"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </form>
    );
};
export default Input;
