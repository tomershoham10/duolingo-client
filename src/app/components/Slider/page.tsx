'use client';
import _ from 'lodash';
import { useEffect } from 'react';
import Tooltip, { TooltipColors } from '../Tooltip/page';

interface SliderProps {
  isMultiple: boolean;
  errorMode?: boolean;
  numberOfSliders?: number;
  tooltipsValues?: number[] | string[];
  min: number;
  max: number;
  step: number;
  value: number | number[];
  onChange: (
    event: React.ChangeEvent<HTMLInputElement>,
    index?: number
  ) => void;
  deleteNode?: (index: number) => void;
}

const Slider: React.FC<SliderProps> = (props) => {
  const isMultiple = props.isMultiple;
  const errorMode = props.errorMode;
  const numberOfSliders = props.numberOfSliders;
  const tooltipsValues = props.tooltipsValues;
  const propsMin = props.min;
  const propsMax = props.max;
  const propsStep = props.step;
  const propsValue = props.value;
  const propsOnChange = props.onChange;
  const propsDeleteNode = props.deleteNode;
  //   const [redIndexes, setRedIndexes] = useState<number[]>([]);

  useEffect(() => {
    console.log('timeBufferRangeValues', propsValue);
    if (_.isObject(propsValue)) {
      for (let i = 0; i < propsValue.length; i++) {
        if (propsValue[i] > propsValue[i + 1]) {
          propsValue[i + 1] = propsValue[i] - propsStep;
        }
      }
    }
  }, [propsStep, propsValue]);

  //   useEffect(() => {
  // console.log('redIndexes', redIndexes);
  //   }, [redIndexes]);

  const deleteNode = (index: number) => {
    console.log('slider - deleteNode - index', index);
    propsDeleteNode ? propsDeleteNode(index) : null;
  };

  return (
    <>
      {isMultiple && numberOfSliders && _.isObject(propsValue) ? (
        <>
          {Array.from({ length: numberOfSliders }).map((_, index) => (
            <section key={index}>
              <input
                type='range'
                id={`range${index + 1}`}
                name={`range${index + 1}`}
                min={propsMin}
                max={propsMax}
                step={propsStep}
                value={(propsValue as number[])[index].toString()}
                onChange={(e) => propsOnChange(e, index)}
                className={`multi-range absolute mb-6 mt-3 w-full`}
              />
              {tooltipsValues ? (
                <div
                  className={`absolute flex items-center justify-center text-center `}
                  style={{
                    left: `${
                      index === 0
                        ? Math.round(100 * (propsValue[index] / 2)) / propsMax
                        : Math.round(
                            100 *
                              (((propsValue[index] - propsValue[index - 1]) /
                                2 +
                                propsValue[index - 1]) /
                                propsMax)
                          )
                    }%`,
                    top: '6.5rem',
                  }}
                >
                  <Tooltip
                    placeholder={tooltipsValues[index]}
                    isFloating={true}
                    color={TooltipColors.WHITE}
                    edittable={true}
                    onDelete={() => deleteNode(index)}
                  />
                </div>
              ) : null}
              <div
                className={`absolute flex items-center justify-center text-center`}
                style={{
                  left: `calc(${Number(
                    (100 * propsValue[index]) / propsMax
                  )}% + (${
                    0 - ((100 * propsValue[index]) / propsMax) * 0.35
                  }px))`,
                  top: '10rem',
                }}
              >
                {/* {(100 * propsValue[index]) / propsMax} */}
                {/* {'  '} */}
                {/* {8 - ((100 * propsValue[index]) / propsMax) * 0.15} */}
                {`${
                  Math.floor((propsValue as number[])[index]) === 0
                    ? '00'
                    : Math.floor((propsValue as number[])[index])
                }:${
                  (propsValue as number[])[index] ===
                  Math.floor((propsValue as number[])[index])
                    ? '00'
                    : Math.round(
                        60 *
                          ((propsValue as number[])[index] -
                            Math.floor((propsValue as number[])[index]))
                      )
                }`}
              </div>
            </section>
          ))}
        </>
      ) : (
        <>
          {_.isNumber(propsValue) ? (
            <section>
              <input
                type='range'
                min={propsMin}
                max={propsMax}
                step={propsStep}
                value={propsValue as number}
                onChange={propsOnChange}
                className={`range-slide mb-6 mt-3 w-full ${
                  errorMode ? 'range-slide-error-mode' : ''
                }`}
                style={{
                  background: `linear-gradient(to right, #20a6ec 0%, #20a6ec ${
                    (100 * propsValue) / 10
                  }%, #ebeaeb ${(100 * propsValue) / 10}%, #ebeaeb 100%)`,
                }}
              />
              <div
                className={`absolute flex items-center justify-center text-center `}
                style={{
                  left: `calc(${(100 * propsValue) / propsMax}% + ${
                    16 - ((100 * propsValue) / propsMax) * 0.32
                  }px)`,
                  top: '4.7rem',
                }}
              >
                <Tooltip
                  placeholder={propsValue === 0 ? '0' : propsValue}
                  isFloating={false}
                  color={TooltipColors.WHITE}
                  edittable={false}
                />
              </div>
            </section>
          ) : (
            <></>
          )}
        </>
      )}
    </>
  );
};

export default Slider;
