import React, { useState, useEffect, useMemo } from 'react';

export enum FontSizes {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
}

const Textbox: React.FC<TextboxProps> = (props) => {
  const {
    prevData,
    isEditMode,
    fontSizeProps,
    placeHolder,
    value,
    onChange,
    errorMode,
  } = props;
  //   const prevData = props.prevData;
  //   const isEditMode = props.isEditMode;
  //   const fontSizeProps = props.fontSizeProps;
  //   const placeHolder = props.placeHolder;
  //   const propsVal = props.value;
  //   const onChange = props.onChange;
  //   const errorMode = props.errorMode;

  const [fontSize, setFontSize] = useState<string>();

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
    <section className={`${fontSize} h-full`}>
      <div className='relative h-full overflow-hidden'>
        <textarea
          style={isEditMode ? {} : { resize: 'none' }}
          value={value}
          onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
            onChange(event.target.value);
          }}
          className={`h-full w-full rounded-md border-2 px-3 py-2 focus:outline-none dark:focus:border-duoBlueDark-text ${
            errorMode
              ? 'border-duoRed-default bg-duoRed-lighter text-duoRed-darker'
              : 'textarea-dark-placeholder bg-duoGray-lighter dark:border-duoGrayDark-light dark:bg-duoGrayDark-dark'
            // : 'bg-duoGray-lighter dark:border-duoGrayDark-light dark:bg-duoGrayDark-dark'
          } `}
          //   ${
          //     isEditMode
          //       ? prevData !== propsVal
          //         ? 'max-h-32 min-h-[2.5rem] border-duoRed-light text-duoRed-default'
          //         : 'max-h-32 min-h-[2.5rem]'
          //       : 'h-[6rem] 3xl:h-[10rem]'
          //   }
          placeholder={placeHolder}
        />
      </div>
    </section>
  );
};

export default Textbox;
