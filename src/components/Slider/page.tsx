+'use client';
import _ from 'lodash';
import { useEffect, useRef, useState } from 'react';
import Tooltip, { TooltipColors } from '@/components/Tooltip/page';
import useClickOutside from '@/app/utils/hooks/useClickOutside';
import { AlertSizes, useAlertStore } from '@/app/store/stores/useAlertStore';
import { formatNumberToMinutes } from '@/app/utils/functions/formatNumberToMinutes';

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
  const propsOnSave = props.onSave;
  const propsDeleteNode = props.deleteNode;
  const propsOnContextMenu = props.onContextMenu;

  const addAlert = useAlertStore.getState().addAlert;

  const rootMultiSlider = useRef<HTMLDivElement>(null);
  const newTooltipRef = useClickOutside(() => {
    hanldeClickOutsideNewVal();
  });

  const [newVal, setNewVal] = useState<number | undefined>(undefined);
  const [isNewValOpen, setIsNewValOpen] = useState<boolean>(false);

  useEffect(() => {
    // console.log('timeBufferRangeValues', propsValue);
    if (_.isObject(propsValue)) {
      for (let i = 0; i < propsValue.length; i++) {
        if (propsValue[i] > propsValue[i + 1]) {
          propsValue[i + 1] = propsValue[i] - propsStep;
        }
      }
    }
  }, [propsStep, propsValue]);

  useEffect(() => {
    !!propsAddedValLeftPerc && propsAddedValLeftPerc > -1
      ? setIsNewValOpen(true)
      : setIsNewValOpen(false);
  }, [propsAddedValLeftPerc]);

  useEffect(() => {
    !isNewValOpen ? setNewVal(undefined) : null;
  }, [isNewValOpen]);

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

  const hanldeClickOutsideNewVal = () => {
    // console.log('clicked outside tooltip', newVal);
    setIsNewValOpen(false);
  };

  const handleNewValSaved = (newScore: number, perc: number) => {
    alert(perc);
    const newTimeVal = (perc / 100) * propsMax;
    propsOnSave ? propsOnSave(newScore, newTimeVal) : null;
    // console.log(
    //   'tooltipsValues',
    //   perc,
    //   (perc / 100) * propsMax,
    //   tooltipsValues,
    //   propsValue,
    //   propsMax
    // );
    setIsNewValOpen(false);
  };

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
                ></span>
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

                {isNewValOpen ? (
                  <section
                    className='absolute flex items-center justify-center text-center'
                    style={{ left: `${propsAddedValLeftPerc}%` }}
                    ref={newTooltipRef}
                  >
                    <Tooltip
                      isFloating={true}
                      color={TooltipColors.WHITE}
                      deletable={false}
                      editMode={true}
                      value={newVal}
                      onEdit={(e) => setNewVal(Number(e))}
                      onSave={(newScore) =>
                        propsAddedValLeftPerc
                          ? handleNewValSaved(newScore, propsAddedValLeftPerc)
                          : null
                      }
                    />
                  </section>
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
                      onDelete={() =>
                        tooltipsValues.length > 1
                          ? deleteNode(index)
                          : addAlert(
                              'cant delete on only one val',
                              AlertSizes.small
                            )
                      }
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
                  {formatNumberToMinutes((propsValue as number[])[index])}
                </div>
              </div>
            </section>
          ))}
        </>
      ) : (
        <>
          {_.isNumber(propsValue) ? (
            <section className='group'>
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
                className=' absolute flex items-center justify-center text-center'
                style={{
                  left: `calc(${(100 * propsValue) / propsMax}% + ${
                    16 - ((100 * propsValue) / propsMax) * 0.32
                  }px)`,
                  top: '-1.5rem',
                }}
              >
                <Tooltip
                  className='hidden group-hover:block transition-all duration-300'
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
