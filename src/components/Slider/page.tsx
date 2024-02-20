'use client';
import _ from 'lodash';
import { useEffect, useRef } from 'react';
import Tooltip, { TooltipColors } from '@/components/Tooltip/page';

const Slider: React.FC<SliderProps> = (props) => {
  const isMultiple = props.isMultiple;
  const errorMode = props.errorMode;
  const numberOfSliders = props.numberOfSliders;
  const tooltipsValues = props.tooltipsValues;
  const propsMin = props.min;
  const propsMax = props.max;
  const propsStep = props.step;
  const propsValue = props.value;

  const propsAddedValLeftPerc = props.addedValLeftPercentage;

  const propsOnChange = props.onChange;
  const propsDeleteNode = props.deleteNode;
  const propsOnContextMenu = props.onContextMenu;

  //   const [redIndexes, setRedIndexes] = useState<number[]>([]);
  const rootMultiSlider = useRef<HTMLDivElement>(null);

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

  const handleContextMenuWrapper = (
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    if (propsOnContextMenu && rootMultiSlider.current) {
      const parentRect = rootMultiSlider.current.getBoundingClientRect();
      propsOnContextMenu(event, parentRect.left, parentRect.right);
    }
  };

  //   useEffect(() => {
  //     const element = document.querySelector('.range-check');
  //     console.log('useeffect', element);
  //     if (element) {
  //       element.addEventListener('contextmenu', () => console.log('clicked1'));
  //     }
  //   }, []);

  return (
    <>
      {isMultiple && numberOfSliders !== undefined && _.isObject(propsValue) ? (
        <>
          {Array.from({
            length: numberOfSliders > 0 ? numberOfSliders : 1,
          }).map((_, index) => (
            <section key={index}>
              <div
                ref={rootMultiSlider}
                className='range-check absolute flex h-[2rem] w-full'
              >
                <span
                  className='absolute top-3 h-[10px] w-full bg-transparent text-xs text-transparent'
                  onContextMenu={handleContextMenuWrapper}
                >
                  a
                </span>
                <input
                  type='range'
                  id={`range${index + 1}`}
                  name={`range${index + 1}`}
                  min={propsMin}
                  max={propsMax}
                  step={propsStep}
                  value={
                    !!(propsValue as number[])[index]
                      ? (propsValue as number[])[index].toString()
                      : []
                  }
                  onChange={(e) => propsOnChange(e, index)}
                  className='multi-range absolute mb-6 mt-3 w-full'
                />

                {!!propsAddedValLeftPerc && propsAddedValLeftPerc > -1 ? (
                  <p
                    className='absolute flex items-center justify-center text-center'
                    style={{ left: `${propsAddedValLeftPerc}%` }}
                  >
                    <Tooltip
                      isFloating={true}
                      color={TooltipColors.WHITE}
                      deletable={true}
                      editMode={true}
                    />
                  </p>
                ) : null}

                {tooltipsValues ? (
                  <div
                    className='absolute flex items-center justify-center text-center'
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
                    }}
                  >
                    <Tooltip
                      placeholder={tooltipsValues[index]}
                      isFloating={true}
                      color={TooltipColors.WHITE}
                      deletable={true}
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
                    top: '2.5rem',
                  }}
                >
                  {/* {(100 * propsValue[index]) / propsMax} */}
                  {/* {'  '} */}
                  {/* {8 - ((100 * propsValue[index]) / propsMax) * 0.15} */}
                  {`${
                    Math.floor((propsValue as number[])[index]) === 0
                      ? '00'
                      : Math.floor((propsValue as number[])[index]) < 10
                        ? `0${Math.floor((propsValue as number[])[index])}`
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
                className={`range-slide w-full ${
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
                  top: '-1rem',
                }}
              >
                <Tooltip
                  placeholder={propsValue === 0 ? '0' : propsValue}
                  isFloating={false}
                  color={TooltipColors.WHITE}
                  deletable={false}
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
