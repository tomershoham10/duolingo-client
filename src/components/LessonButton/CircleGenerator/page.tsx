'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const CircleGenerator: React.FC<CircleGeneratorProps> = (props) => {
  const { isDarkMode, numberOfTotalLessons, numberOfLessonsMade } = props;
  const [svgFile, setSvgFile] = useState<string | null>(null);
  // console.log("numberOfLessonsMade = ", numberOfLessonsMade);

  useEffect(() => {
    if (numberOfLessonsMade === 0) {
      setSvgFile(
        `/svgs/${isDarkMode ? 'darkCircles' : 'circles'}/fullGrayCircle.svg`
      );
    } else if (numberOfLessonsMade === numberOfTotalLessons) {
      setSvgFile(
        `/svgs/${isDarkMode ? 'darkCircles' : 'circles'}/fullGreenCircle.svg`
      );
    } else {
      switch (numberOfTotalLessons) {
        case 2:
          setSvgFile(
            `/svgs/${
              isDarkMode ? 'darkCircles' : 'circles'
            }/halfs/${numberOfLessonsMade}/circle.svg`
          );
          break;
        case 3:
          setSvgFile(
            `/svgs/${
              isDarkMode ? 'darkCircles' : 'circles'
            }/thirds/${numberOfLessonsMade}/circle.svg`
          );
          break;
        case 4:
          setSvgFile(
            `/svgs/${
              isDarkMode ? 'darkCircles' : 'circles'
            }/quarters/${numberOfLessonsMade}/circle.svg`
          );
          break;
        case 5:
          setSvgFile(
            `/svgs/${
              isDarkMode ? 'darkCircles' : 'circles'
            }/fifths/${numberOfLessonsMade}/circle.svg`
          );
          break;
        case 6:
          setSvgFile(
            `/svgs/${
              isDarkMode ? 'darkCircles' : 'circles'
            }/sixes/${numberOfLessonsMade}/circle.svg`
          );
          break;
      }
    }
  }, [isDarkMode, numberOfLessonsMade, numberOfTotalLessons]);

  return (
    <>
      {svgFile !== null ? (
        <Image priority src={svgFile} alt='circle' width={102} height={98} />
      ) : null}
    </>
  );
};

export default CircleGenerator;
