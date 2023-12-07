'use client';
import _ from 'lodash';
import { useState, useEffect } from 'react';

interface SliderProps {
  isMultiple: boolean;
  numberOfSliders?: number;
  min: number;
  max: number;
  step: number;
  value: number | number[];
  onChange: (
    event: React.ChangeEvent<HTMLInputElement>,
    index?: number
  ) => void;
}

const Slider: React.FC<SliderProps> = (props) => {
  const isMultiple = props.isMultiple;
  const numberOfSliders = props.numberOfSliders;
  const propsMin = props.min;
  const propsMax = props.max;
  const propsStep = props.step;
  const propsValue = props.value;
  const propsOnChange = props.onChange;

  const [redIndexes, setRedIndexes] = useState<number[]>([]);

  useEffect(() => {
    console.log('timeBufferRangeValues', propsValue);
    if (_.isObject(propsValue)) {
      for (let i = 0; i < propsValue.length; i++) {
        if (propsValue[i] > propsValue[i + 1]) {
          propsValue[i+1] = propsValue[i ] - propsStep;
        } 
      }
    }
  }, [propsValue]);

  useEffect(() => {
    console.log('redIndexes', redIndexes);
  }, [redIndexes]);

  return (
    <>
      {isMultiple && numberOfSliders && _.isObject(propsValue) ? (
        <>
          {Array.from({ length: numberOfSliders }).map((_, index) => (
            <input
              key={index}
              type='range'
              id={`range${index + 1}`}
              name={`range${index + 1}`}
              min={propsMin}
              max={propsMax}
              step={propsStep}
              value={(propsValue as number[])[index].toString()}
              onChange={(e) => propsOnChange(e, index)}
              className={`multi-range absolute mb-6 mt-3 w-full ${
                redIndexes.includes(index) ? 'unplaced-index bg-black' : ''
              }`}
            />
          ))}
        </>
      ) : (
        <>
          {_.isNumber(propsValue) ? (
            <input
              type='range'
              min={propsMin}
              max={propsMax}
              step={propsStep}
              value={propsValue as number}
              onChange={propsOnChange}
              className='range-slide mb-6 mt-3 w-full'
              style={
                isMultiple
                  ? {}
                  : {
                      background: `linear-gradient(to right, #20a6ec 0%, #20a6ec ${
                        (100 * propsValue) / 10
                      }%, #ebeaeb ${(100 * propsValue) / 10}%, #ebeaeb 100%)`,
                    }
              }
            />
          ) : (
            <></>
          )}
        </>
      )}
    </>
  );
};

export default Slider;
