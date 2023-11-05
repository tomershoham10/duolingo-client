// "use client";
// import { useEffect, useState } from "react";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import useStore from "@/app/store/useStore";
import { useUserStore, TypesOfUser } from "@/app/store/stores/useUserStore";
import { usePathname } from "next/navigation";
import { useCourseStore } from "@/app/store/stores/useCourseStore";
import { useEditSyllabusStore } from "@/app/store/stores/useEditSyllabus";

const InfoBar: React.FC = () => {
    const userName = useStore(useUserStore, (state) => state.userName);
    const courseType = useStore(useCourseStore, (state) => state.courseType);
    const fieldToEdit = useStore(
        useEditSyllabusStore,
        (state) => state.fieldToEdit,
    );
    const fieldId = useStore(useEditSyllabusStore, (state) => state.fieldId);
    const pathname = usePathname();
    // const [selected, setSelected] = useState<number>();

    return (
        <div className="w-72 h-full flex flex-col justify-start items-center border-l-2 tracking-wide border-duoGray-light text-duoGray-darkest font-extrabold">
            {pathname.includes("syllabus") ? (
                <div>
                    <div>{courseType}</div>
                    {fieldToEdit ? (
                        <div>
                            {fieldToEdit} {fieldId}
                        </div>
                    ) : null}
                </div>
            ) : (
                <ul className="flex-grow">
                    <li className="text-xl uppercase">hello {userName}!</li>
                </ul>
            )}
        </div>
    );
};

export default InfoBar;
