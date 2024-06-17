'use client';
import Image from 'next/image';
import { useRef, useState } from 'react';
import audioIcon from '../../../public/svgs/audioPlayer/playing.svg';

const AudioPlayer: React.FC<AudioPlayerProps> = (props) => {
  const src = props.src;
  const audioRef = useRef<HTMLAudioElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);

  //   const onLoadedMetadata = () => {
  //     if (audioRef.current) {
  //       setDuration(audioRef.current.duration);
  //     }
  //   };

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <section
      className={`flex h-[12.5rem] w-[12.5rem] cursor-pointer flex-col justify-end rounded-[25%] border-b-[8px] active:dark:bg-transparent  lg:h-[20rem] lg:w-[20rem] 2xl:h-[30rem] 2xl:w-[30rem] 3xl:h-[35rem] 3xl:w-[35rem] ${
        isPlaying
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
        className={`flex h-full w-full items-center justify-center rounded-[25%] ${
          isPlaying
            ? 'active:translate-y-[8px] dark:bg-duoBlueDark-text hover:dark:bg-duoBlueDark-textHover'
            : 'active:translate-y-[8px] dark:bg-duoGrayDark-lightestOpacity hover:dark:bg-[#7F8D96]'
        }`}
        onClick={togglePlayPause}
      >
        <Image
          priority
          src={audioIcon}
          alt='alt'
          width={120}
          className='w-1/2'
        />
      </button>
    </section>
  );
};
export default AudioPlayer;
