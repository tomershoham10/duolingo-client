// components/Textbox.tsx
import React, { useState, useEffect, useMemo } from 'react';

interface TextboxProps {
  prevData: string;
}

const Textbox: React.FC<TextboxProps> = ({ prevData }) => {
  const [text, setText] = useState<string>(prevData);

  function handleChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setText(event.target.value);
  }

  useEffect(() => {
    console.log(text);
  }, [text]);

  const memoizedValue = useMemo(() => text, [text]);

  return (
    <form className='text-xl font-semibold'>
      <div className={`relative overflow-hidden`}>
        <textarea
          value={memoizedValue}
          onChange={handleChange}
          className={`max-h-32 min-h-[2.5rem] w-full rounded-md border-2 px-3 py-2 focus:outline-none
          ${
            prevData !== memoizedValue
              ? 'border-duoRed-light text-duoRed-default'
              : ''
          }`}
        />
      </div>
    </form>
  );
};

export default Textbox;
