import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faLock, faStar, faCheck } from "@fortawesome/free-solid-svg-icons";

import CircleGenerator from "./CircleGenerator/page";
library.add(faLock, faStar, faCheck);

export enum Status {
    DONE = "done",
    PROGRESS = "progress",
    LOCKED = "locked",
}

interface LessonButton {
    status: Status;
    numberOfTotalLessons?: number;
    numberOfLessonsMade?: number;
}

const LessonButton: React.FC<LessonButton> = ({
    status,
    numberOfTotalLessons,
    numberOfLessonsMade,
}) => {
    // console.log(
    //     "status",
    //     status,
    //     "numberOfTotalLessons",
    //     numberOfTotalLessons,
    //     "numberOfLessonsMade",
    //     numberOfLessonsMade,
    //     status === Status.PROGRESS &&
    //         numberOfTotalLessons !== undefined &&
    //         numberOfLessonsMade !== undefined,
    // );
    return (
        <div className="relative h-[98px] w-[102px] z-10">
            {status === Status.PROGRESS &&
            numberOfTotalLessons !== undefined &&
            numberOfLessonsMade !== undefined ? (
                <>
                    <CircleGenerator
                        numberOfTotalLessons={numberOfTotalLessons}
                        numberOfLessonsMade={numberOfLessonsMade}
                    />
                </>
            ) : null}

            {status === Status.LOCKED && (
                <button
                    disabled
                    className="left-0 top-0 lesson-button absolute justify-center items-center ml-[18px] mt-[19px] w-[70px] h-[57px]
                 bg-duoGray-default rounded-[50%] cursor-pointer active:shadow-none active:translate-y-[8px] text-duoGray-dark text-2xl"
                >
                    <FontAwesomeIcon icon={faLock} className="text-md" />
                </button>
            )}
            {status === Status.PROGRESS && (
                <button className="left-0 top-0 lesson-button absolute justify-center items-center ml-[16px] mt-[17px] w-[70px] h-[57px] bg-duoGreen-default rounded-[50%] cursor-pointer active:shadow-none active:translate-y-[8px] text-white text-3xl">
                    <FontAwesomeIcon icon={faStar} className="text-md" />
                </button>
            )}

            {status === Status.DONE && (
                <button className="left-0 top-0 lesson-button absolute justify-center items-center ml-[16px] mt-[17px] w-[70px] h-[57px] bg-duoGreen-default rounded-[50%] cursor-pointer active:shadow-none active:translate-y-[8px] text-white text-3xl">
                    <FontAwesomeIcon icon={faCheck} className="text-md" />
                </button>
            )}
        </div>
    );
};

export default LessonButton;
