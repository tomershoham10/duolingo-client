// import React from "react";
import Image from "next/image";

interface CircleGeneratorProps {
    numberOfTotalLessons: number;
    numberOfLessonsMade: number;
}

const CircleGenerator: React.FC<CircleGeneratorProps> = ({
    numberOfTotalLessons,
    numberOfLessonsMade,
}) => {
    let svgFile = "";

    if (numberOfLessonsMade === 0) {
        svgFile = "/svgs/circles/fullGrayCircle.svg";
    } else if (numberOfLessonsMade === numberOfTotalLessons) {
        svgFile = "/svgs/circles/fullGreenCircle.svg";
    } else {
        switch (numberOfTotalLessons) {
            case 3:
                svgFile = `/svgs/circles/thirds/${numberOfLessonsMade}/circle.svg`;
                break;
            case 4:
                svgFile = `/svgs/circles/quarters/${numberOfLessonsMade}/circle.svg`;
                break;
            case 5:
                svgFile = `/svgs/circles/fifths/${numberOfLessonsMade}/circle.svg`;
                break;
            case 6:
                svgFile = `/svgs/circles/sixes/${numberOfLessonsMade}/circle.svg`;
                break;
            default:
                svgFile = "";
        }
    }

    return (
        <Image priority src={svgFile} alt="circle" width={102} height={98} />
    );
};

export default CircleGenerator;
