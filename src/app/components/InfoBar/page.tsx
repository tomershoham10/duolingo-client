// "use client";
// import { useEffect, useState } from "react";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import useStore from "@/app/store/useStore";
import { useUserStore, TypesOfUser } from "@/app/store/stores/useUserStore";

const InfoBar: React.FC = () => {
    const userName = useStore(useUserStore, (state) => state.userName);
    // const [selected, setSelected] = useState<number>();

    return (
        <div
            className="w-[15rem] flex flex-col justify-start items-center 
            border-l-2 h-full tracking-wide border-duoGray-light text-duoGray-darkest font-extrabold"
        >
            {/* <ul className="flex-grow"></ul> */}
            INFO BAR
        </div>
    );
};

export default InfoBar;
