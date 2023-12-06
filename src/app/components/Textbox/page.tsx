// components/Textbox.tsx
import React, { useState, useEffect, useMemo } from 'react';

export enum FontSizes {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
}

interface TextboxProps {
  prevData?: string;
  isEditMode: boolean;
  fontSizeProps: FontSizes;
  placeHolder?: string;
}

const Textbox: React.FC<TextboxProps> = ({
  prevData,
  isEditMode,
  fontSizeProps,
  placeHolder,
}) => {
  const [text, setText] = useState<string>(prevData ? prevData : '');

  const [fontSize, setFontSize] = useState<string>();

  function handleChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setText(event.target.value);
  }

  useEffect(() => {
    console.log(text);
  }, [text]);

  const memoizedValue = useMemo(() => text, [text]);

  useEffect(() => {
    switch (fontSizeProps) {
      case FontSizes.SMALL:
        setFontSize('text-sm font-normal');
        break;
      case FontSizes.MEDIUM:
        setFontSize('text-lg font-medium');
        break;
      case FontSizes.LARGE:
        setFontSize('text-xl font-semibold');
        break;
      default:
        setFontSize('text-md font-medium');
        break;
    }
  }, [fontSizeProps]);

  return (
    <form className={`${fontSize}`}>
      <div className='relative overflow-hidden'>
        <textarea
          style={isEditMode ? {} : { resize: 'none' }}
          value={memoizedValue}
          onChange={handleChange}
          className={`w-full rounded-md border-2 px-3 py-2 focus:outline-none bg-duoGray-lighter
          ${
            isEditMode
              ? prevData !== memoizedValue
                ? 'max-h-32 min-h-[2.5rem] border-duoRed-light text-duoRed-default'
                : 'max-h-32 min-h-[2.5rem]'
              : 'h-[6rem] 3xl:h-[10rem]'
          }`}
          placeholder={placeHolder}
        />
      </div>
    </form>
  );
};

export default Textbox;
