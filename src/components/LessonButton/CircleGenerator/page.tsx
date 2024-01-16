"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

const CircleGenerator: React.FC<CircleGeneratorProps> = ({
    numberOfTotalLessons,
    numberOfLessonsMade,
}) => {
    const [svgFile, setSvgFile] = useState<string>("");
    // console.log("numberOfLessonsMade = ", numberOfLessonsMade);

    useEffect(() => {
        if (numberOfLessonsMade === 0) {
            setSvgFile("/svgs/circles/fullGrayCircle.svg");
        } else if (numberOfLessonsMade === numberOfTotalLessons) {
            setSvgFile("/svgs/circles/fullGreenCircle.svg");
        } else {
            switch (numberOfTotalLessons) {
                case 2:
                    setSvgFile(
                        `/svgs/circles/halfs/${numberOfLessonsMade}/circle.svg`,
                    );
                    break;
                case 3:
                    setSvgFile(
                        `/svgs/circles/thirds/${numberOfLessonsMade}/circle.svg`,
                    );
                    break;
                case 4:
                    setSvgFile(
                        `/svgs/circles/quarters/${numberOfLessonsMade}/circle.svg`,
                    );
                    break;
                case 5:
                    setSvgFile(
                        `/svgs/circles/fifths/${numberOfLessonsMade}/circle.svg`,
                    );
                    break;
                case 6:
                    setSvgFile(
                        `/svgs/circles/sixes/${numberOfLessonsMade}/circle.svg`,
                    );
                    break;
            }
        }
    }, [numberOfLessonsMade, numberOfTotalLessons]);

    return (
        <>
            {svgFile !== "" ? (
                <Image
                    priority
                    src={svgFile}
                    alt="circle"
                    width={102}
                    height={98}
                />
            ) : null}
        </>
    );
};

export default CircleGenerator;
