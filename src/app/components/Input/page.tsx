import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamation } from "@fortawesome/free-solid-svg-icons";

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
    failed?: boolean;
}

const Input: React.FC<InputProps> = ({
    type,
    placeholder,
    value,
    onChange,
    className,
    failed,
}) => {
    return (
        <div className={`relative ${className} w-full`}>
            <input
                type={type}
                className={`bg-[#F7F7F7] border-2 rounded-xl p-3 w-full focus:outline-none text-[#4B4B4B] ${
                    failed
                        ? 'border-[#FFB2B2]'
                        : 'border-[#E5E5E5]'
                }`}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
            {failed && (
                <FontAwesomeIcon
                    icon={faExclamation}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#EA2B2B] rounded-full border-2 border-[#EA2B2B] w-4 p-[0.1rem]"
                />
            )}
        </div>
    );
};
export default Input;
