'use client';
import Image from 'next/image';
import { useRef, useState } from 'react';
import playing from '../../../public/svgs/audioPlayer/playing.svg';
import AnimatedSVG from '../../../public/svgs/audioPlayer/animatedSVG';
import { useKeyDown } from '@/app/utils/hooks/useKeyDown';
const AudioPlayer: React.FC<AudioPlayerProps> = (props) => {
  const src = props.src;
  const isDisabled = props.isDisabled || false;
  const isPauseable = props.isPauseable || false;

  const audioRef = useRef<HTMLAudioElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);

  //   const onLoadedMetadata = () => {
  //     if (audioRef.current) {
  //       setDuration(audioRef.current.duration);
  //     }
  //   };

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (!isPauseable) {
        if (!isPlaying) {
          audioRef.current.play();
          setIsPlaying(true);
        }
      } else {
        if (isPlaying) {
          audioRef.current.pause();
        } else {
          audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
      }
    }
  };

  useKeyDown(togglePlayPause, [' ']);

  return (
    <section
      className={`flex h-[12.5rem] w-[12.5rem] cursor-pointer flex-col justify-end rounded-[25%] border-b-[8px] active:dark:bg-transparent  lg:h-[20rem] lg:w-[20rem] 2xl:h-[30rem] 2xl:w-[30rem] 3xl:h-[35rem] 3xl:w-[35rem] ${
        !isDisabled
          ? 'hover:dark:border[#2E75A0] border-[#3383B1] dark:bg-duoBlueDark-text hover:dark:bg-duoBlueDark-textHover'
          : 'border-[#5F666F] dark:bg-duoGrayDark-lightestOpacity hover:dark:border-[#565D65] hover:dark:bg-[#7F8D96]'
      }`}
    >
      <audio
        ref={audioRef}
        className='hidden'
        src={src}
        // onTimeUpdate={onTimeUpdate}
        // onLoadedMetadata={onLoadedMetadata}
      />
      <button
        className={`relative flex h-full w-full items-center justify-center rounded-[25%] ${
          !isDisabled
            ? 'active:translate-y-[8px] dark:bg-duoBlueDark-text hover:dark:bg-duoBlueDark-textHover'
            : 'active:translate-y-[8px] dark:bg-duoGrayDark-lightestOpacity hover:dark:bg-[#7F8D96]'
        }`}
        onClick={togglePlayPause}
      >
        {!isPlaying ? (
          <Image
            priority
            src={playing}
            alt='alt'
            width={120}
            className='w-1/2'
          />
        ) : (
          <AnimatedSVG />
        )}
      </button>
    </section>
  );
};
export default AudioPlayer;