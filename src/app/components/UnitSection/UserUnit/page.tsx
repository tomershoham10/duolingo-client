import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook } from "@fortawesome/free-solid-svg-icons";
library.add(faBook);

const UnitSection = () => {
    return (
        <div
            className="grid grid-rows-2 grid-col-3 grid-flow-col  
    bg-duoGreen-default w-[35rem] h-[6rem] rounded-xl text-white mb-5"
        >
            <label className="col-span-2 flex justify-start items-center pt-4 pl-4 font-extrabold text-xl">
                Unit 1
            </label>
            <label className="col-span-2 flex justify-start items-center pb-3 pl-4">
                Form basic sentences, greet people
            </label>
            <div className="row-span-2 flex justify-end items-center mr-4 cursor-pointer">
                <button
                    className="flex flex-row justify-start items-center w-40 text-sm font-bold
            border-b-[4px] border-[2.5px] border-duoGreen-darker bg-duoGreen-button p-3 rounded-2xl
            hover:border-duoGreen-borderHover hover:bg-duoGreen-default hover:text-duoGreen-textHover active:border-[2.5px]"
                >
                    <FontAwesomeIcon
                        className="h-6 w-6 mr-2 ml-2"
                        icon={faBook}
                    />
                    <label className="text-center justify-center items-center cursor-pointer">
                        GUIDEBOOK
                    </label>
                </button>
            </div>
        </div>
    );
};

export default UnitSection;
