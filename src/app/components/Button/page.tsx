import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

export enum Color {
    blue = "Blue",
    green = "Green",
    gray = "Gray",
}

interface ButtonProps {
    label: string;
    icon?: IconDefinition;
    color: Color;
    onClick: () => void;
}

const Button: React.FC<ButtonProps> = ({ label, icon, color, onClick }) => {
    let buttonColor: string = "";
    let buttonBorderColor: string = "";
    let buttonHoverColor: string = "";
    let textColor: string = "";

    switch (color) {
        case "Blue":
            buttonColor = "bg-[#27B6F5]";
            buttonBorderColor = "bg-[#1A87BC]";
            buttonHoverColor = "hover:bg-[#1FC2FF]";
            textColor = "text-white";
            break;
        case "Green":
            buttonColor = "bg-[#59D101]";
            buttonBorderColor = "bg-[#61B800]";
            buttonHoverColor = "hover:bg-[#61E002]";
            textColor = "text-white";
            break;

        case "Gray":
            buttonColor = "bg-stone-500";
            buttonBorderColor = "bg-stone-700";
            buttonHoverColor = "hover:bg-[#8A837D]";
            textColor = "text-white";
            break;
    }

    return (
        <div
            className={`${buttonBorderColor} ${textColor} text-xl w-full flex flex-col justify-end
    mb-2 mt-2 cursor-pointer rounded-2xl border-b-[4px] border-transparent active:border-0`}
        >
            <button
                className={`flex flex-row justify-start items-center group ${buttonColor} pt-2 pb-2 pl-3 pr-3 w-full rounded-2xl ${buttonHoverColor}`}
                onClick={onClick}
            >
                {icon && (
                    <FontAwesomeIcon
                        className="h-6 w-6 mr-4 ml-2"
                        icon={`fa-xs fa-solid ${icon}`}
                    />
                )}
                {label}
            </button>
        </div>
    );
};

export default Button;
