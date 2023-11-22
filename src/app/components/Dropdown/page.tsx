"use client";
import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

export enum DropdownSizes {
    SMALL = "small",
    DEFAULT = "default",
    LARGE = "large",
}

interface DropdownProps {
    placeholder: string;
    items: string[];
    value: string;
    onChange: (value: string) => void;
    className?: string;
    isFailed?: boolean;
    isDisabled?: boolean;
    size: DropdownSizes;
}

const Dropdown: React.FC<DropdownProps> = ({
    placeholder,
    items,
    value,
    onChange,
    className,
    isFailed,
    isDisabled,
    size,
}) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [maxHight, setMaxHight] = useState<string>();
    const [selectedValue, setSelectedValue] = useState<string | undefined>(
        value,
    );
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    const handleItemClick = (item: string) => {
        setSelectedValue(item);
        onChange && onChange(item);
        setIsOpen(false);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (
            dropdownRef.current &&
            !dropdownRef.current.contains(event.target as Node)
        ) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const setHigh = () => {
            switch (size) {
                case DropdownSizes.SMALL:
                    return "xl:h-32 3xl:h-52";
                case DropdownSizes.DEFAULT:
                    return "";
                case DropdownSizes.LARGE:
                    return "xl:h-64 3xl:h-96";
            }
        };
        setMaxHight(setHigh);
    }, [size]);

    return (
        <div ref={dropdownRef} className={`relative ${className} z-10`}>
            <button
                className={
                    isDisabled
                        ? "flex justify-between items-center p-3 bg-duoGray-light border-2 border-duoGray-default w-full rounded-xl cursor-default text-duoGray-dark uppercase font-bold"
                        : isFailed
                        ? "flex justify-between items-center p-3 bg-duoGray-lighter border-2 border-duoRed-light w-full rounded-xl cursor-pointer text-duoGray-darkest uppercase font-bold"
                        : "flex justify-between items-center p-3 bg-duoGray-lighter border-2 border-duoGray-default w-full rounded-xl cursor-pointer text-duoGray-darkest uppercase font-bold"
                }
                onClick={() => setIsOpen(!isOpen)}
            >
                <span>{selectedValue || placeholder}</span>
                <FontAwesomeIcon icon={faChevronDown} />
            </button>
            {isOpen && !isDisabled && (
                <div
                    className={`absolute flex flex-col justify-start items-start ${maxHight} mt-2 w-full bg-duoGray-lighter border-2 border-duoGray-default rounded-xl text-duoGray-dark uppercase font-bold overflow-auto`}
                >
                    {items.map((item, index) => (
                        <div
                            key={index}
                            className={
                                index === 0
                                    ? "p-2 cursor-pointer hover:bg-duoGray-hover w-full rounded-t-md"
                                    : index === items.length - 1
                                    ? "p-2 cursor-pointer hover:bg-duoGray-hover w-full rounded-b-md"
                                    : "p-2 cursor-pointer hover:bg-duoGray-hover w-full"
                            }
                            onClick={() => handleItemClick(item)}
                        >
                            {item}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dropdown;
