'use client';
import React, {
  useImperativeHandle,
  forwardRef,
  useRef,
  ChangeEvent,
} from 'react';

interface UploadProps {
  onFileChange: (file: File | null) => void;
  fileLength: (size: number | null) => void;
}

export interface UploadRef {
  focus: () => void;
  clear: () => void;
}

const Upload = forwardRef<UploadRef, UploadProps>((props: UploadProps, ref) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const audioContext = new window.AudioContext();
      props.onFileChange(file);
      const reader = new FileReader();
      console.log('reader', reader);
      reader.onload = async (event) => {
        console.log('reader2', reader);
        if (event && event.target) {
          const arrayBuffer = event.target.result as ArrayBuffer;
          if (arrayBuffer) {
            const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

            // Get the duration in seconds
            const durationInSeconds = audioBuffer.duration;
            console.log('Duration:', durationInSeconds, 'seconds');
            props.fileLength(durationInSeconds / 60);
          }
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  useImperativeHandle(ref, () => ({
    focus: () => {
      if (inputRef && inputRef.current) {
        inputRef.current.focus();
      }
    },
    clear: () => {
      if (inputRef && inputRef.current) {
        inputRef.current.value = '';
      }
    },
  }));

  return (
    <label htmlFor='upload-input' className='cursor-pointer'>
      <span>Choose a .wav file</span>

      <input
        id='upload-input'
        type='file'
        ref={inputRef}
        onChange={handleFileChange}
        className='hidden'
      />
    </label>
  );
});

// Add display name to the component
Upload.displayName = 'Upload';

export default Upload;
