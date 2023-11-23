"use client";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useEffect } from "react";

interface SortableItemProps {
    id: string;
    name: string;
    isGrabbed: boolean;
}

const SortableItem: React.FC<SortableItemProps> = ({ id, name, isGrabbed }) => {
    useEffect(() => {
        console.log("isGrabbed", isGrabbed);
    }, [isGrabbed]);
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id: id });

    const style = { transform: CSS.Transform.toString(transform), transition };
    return (
        <div className="w-[75%] h-[5rem] flex flex-none justify-center items-center">
            <div
                ref={setNodeRef}
                style={style}
                {...attributes}
                {...listeners}
                className={`border-2 border-b-4 rounded-xl w-[80%] py-4 
        border-border-duoGray-regular flex-none font-bold text-lg cursor-pointer
         active:border-b-2 active:translate-y-[1px] ${
             isGrabbed ? "z-50 bg-white opacity-100" : ""
         }`}
            >
                <span
                    className="flex items-center justify-center relative 
                text-center text-ellipsis"
                >
                    {name}
                </span>
            </div>
        </div>
    );
};

export default SortableItem;
