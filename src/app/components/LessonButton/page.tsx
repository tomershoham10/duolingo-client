import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faLock, faStar } from "@fortawesome/free-solid-svg-icons";
import { LessonButton } from "../../../../types";
library.add(faLock, faStar);

const LessonButton: React.FC<LessonButton> = ({ isDisabled }) => {
    return (
        <div className="relative h-56">
            <svg
                width="102"
                height="95"
                viewBox="0 0 102 95"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M102 47.5C102 73.7335 79.1665 95 51 95C22.8335 95 0 73.7335 0 47.5C0 21.2665 22.8335 0 51 0C79.1665 0 102 21.2665 102 47.5ZM9.18 47.5C9.18 69.0115 27.9035 86.45 51 86.45C74.0965 86.45 92.82 69.0115 92.82 47.5C92.82 25.9885 74.0965 8.55 51 8.55C27.9035 8.55 9.18 25.9885 9.18 47.5Z"
                    fill="#D9D9D9"
                />
                <mask
                    id="path-2-outside-1_7_75"
                    maskUnits="userSpaceOnUse"
                    x="-2"
                    y="-2"
                    width="106"
                    height="99"
                    fill="black"
                >
                    <rect fill="white" x="-2" y="-2" width="106" height="99" />
                    <path d="M51 4.275C51 1.91398 52.917 -0.0174069 55.2708 0.166804C64.5247 0.891015 73.4204 3.95827 80.977 9.07169C89.6903 14.9678 96.1757 23.2816 99.5039 32.8217C102.832 42.3618 102.832 52.6382 99.5039 62.1783C96.1757 71.7184 89.6903 80.0322 80.977 85.9283C72.2638 91.8244 61.7701 95 51 95C40.2299 95 29.7362 91.8244 21.0229 85.9283C12.3097 80.0322 5.82427 71.7184 2.49612 62.1783C-0.34968 54.0209 -0.762129 45.3251 1.25877 37.0116C1.83574 34.6381 4.34113 33.38 6.67905 34.0875V34.0875C9.15937 34.8381 10.486 37.5021 9.95448 40.0385C8.59879 46.5075 9.0229 53.2188 11.2268 59.5362C13.9559 67.3591 19.274 74.1764 26.4188 79.0112C33.5637 83.846 42.1685 86.45 51 86.45C59.8315 86.45 68.4363 83.846 75.5812 79.0112C82.726 74.1764 88.0441 67.3591 90.7732 59.5362C93.5023 51.7134 93.5023 43.2866 90.7732 35.4638C88.0441 27.6409 82.726 20.8236 75.5812 15.9888C69.5937 11.9372 62.5809 9.45216 55.2687 8.7534C52.9184 8.5288 51 6.63602 51 4.275V4.275Z" />
                </mask>
                <path
                    d="M51 4.275C51 1.91398 52.917 -0.0174069 55.2708 0.166804C64.5247 0.891015 73.4204 3.95827 80.977 9.07169C89.6903 14.9678 96.1757 23.2816 99.5039 32.8217C102.832 42.3618 102.832 52.6382 99.5039 62.1783C96.1757 71.7184 89.6903 80.0322 80.977 85.9283C72.2638 91.8244 61.7701 95 51 95C40.2299 95 29.7362 91.8244 21.0229 85.9283C12.3097 80.0322 5.82427 71.7184 2.49612 62.1783C-0.34968 54.0209 -0.762129 45.3251 1.25877 37.0116C1.83574 34.6381 4.34113 33.38 6.67905 34.0875V34.0875C9.15937 34.8381 10.486 37.5021 9.95448 40.0385C8.59879 46.5075 9.0229 53.2188 11.2268 59.5362C13.9559 67.3591 19.274 74.1764 26.4188 79.0112C33.5637 83.846 42.1685 86.45 51 86.45C59.8315 86.45 68.4363 83.846 75.5812 79.0112C82.726 74.1764 88.0441 67.3591 90.7732 59.5362C93.5023 51.7134 93.5023 43.2866 90.7732 35.4638C88.0441 27.6409 82.726 20.8236 75.5812 15.9888C69.5937 11.9372 62.5809 9.45216 55.2687 8.7534C52.9184 8.5288 51 6.63602 51 4.275V4.275Z"
                    fill="#58CC02"
                />
                <path
                    d="M51 4.275C51 1.91398 52.917 -0.0174069 55.2708 0.166804C64.5247 0.891015 73.4204 3.95827 80.977 9.07169C89.6903 14.9678 96.1757 23.2816 99.5039 32.8217C102.832 42.3618 102.832 52.6382 99.5039 62.1783C96.1757 71.7184 89.6903 80.0322 80.977 85.9283C72.2638 91.8244 61.7701 95 51 95C40.2299 95 29.7362 91.8244 21.0229 85.9283C12.3097 80.0322 5.82427 71.7184 2.49612 62.1783C-0.34968 54.0209 -0.762129 45.3251 1.25877 37.0116C1.83574 34.6381 4.34113 33.38 6.67905 34.0875V34.0875C9.15937 34.8381 10.486 37.5021 9.95448 40.0385C8.59879 46.5075 9.0229 53.2188 11.2268 59.5362C13.9559 67.3591 19.274 74.1764 26.4188 79.0112C33.5637 83.846 42.1685 86.45 51 86.45C59.8315 86.45 68.4363 83.846 75.5812 79.0112C82.726 74.1764 88.0441 67.3591 90.7732 59.5362C93.5023 51.7134 93.5023 43.2866 90.7732 35.4638C88.0441 27.6409 82.726 20.8236 75.5812 15.9888C69.5937 11.9372 62.5809 9.45216 55.2687 8.7534C52.9184 8.5288 51 6.63602 51 4.275V4.275Z"
                    stroke="white"
                    strokeWidth="4"
                    strokeLinejoin="round"
                    mask="url(#path-2-outside-1_7_75)"
                />
            </svg>

            <button
                className={`${
                    isDisabled
                        ? "left-0 top-0 lesson-button absolute justify-center items-center ml-[18px] mt-[19px] w-[70px] h-[55px] bg-[#E5E5E5] rounded-[50%] cursor-pointer active:shadow-none active:translate-y-[8px] text-[#AFAFAF] text-2xl"
                        : "left-0 top-0 lesson-button absolute justify-center items-center ml-[16px] mt-[16px] w-[70px] h-[55px] bg-[#58cc02] rounded-[50%] cursor-pointer active:shadow-none active:translate-y-[8px] text-white text-3xl"
                }`}
                disabled={isDisabled}
            >
                {isDisabled ? (
                    <FontAwesomeIcon icon="fa-solid fa-lock" />
                ) : (
                    <FontAwesomeIcon icon="fa-solid fa-star" />
                )}
            </button>
        </div>
    );
};

export default LessonButton;
