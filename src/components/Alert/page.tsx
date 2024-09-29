'use client';
import { useCallback, useEffect, useState } from 'react';

import useStore from '@/app/store/useStore';
import { AlertSizes, useAlertStore } from '@/app/store/stores/useAlertStore';

import Button, { ButtonColors } from '@/components/(buttons)/Button/page';
import { Themes, useThemeStore } from '@/app/store/stores/useThemeStore';

const Alert: React.FC = () => {
  const alerts = useStore(useAlertStore, (state) => state.alerts);
  const removeAlert = useAlertStore.getState().removeAlert;

  const theme = useStore(useThemeStore, (state) => state.theme);

  //   const [isAlertOpened, setIsAlertOpened] = useState<boolean>(false);
  //   const [alertId, setAlertId] = useState<number>();
  //   const [alertMessage, setAlertMessage] = useState<string | null>(null);
  //   const [alertSize, setAlertSize] = useState<AlertSizes | null>(null);

  const [boxHight, setBoxHight] = useState<string | null>(null);

  //   useEffect(() => {
  //     // console.log('alert added');
  //     if (alerts && alerts?.length > 0) {
  //       setIsAlertOpened(true);
  //       setAlertId(alerts[0].id);
  //       setAlertMessage(alerts[0].message);
  //       setAlertSize(alerts[0].size);
  //     } else {
  //       setIsAlertOpened(false);
  //     }
  //   }, [alerts]);

  useEffect(() => {
    if (alerts && alerts?.length > 0) {
      switch (alerts[0].size) {
        case AlertSizes.small:
          setBoxHight('h-[7.5rem]');
          break;
        case AlertSizes.medium:
          setBoxHight('h-[10rem]');

          break;
        case AlertSizes.large:
          setBoxHight('h-[12rem]');

          break;
      }
    }
  }, [alerts]);

  const triggerActionButton = useCallback(async () => {
    try {
      if (alerts && alerts?.length > 0 && alerts[0].action) {
        await alerts[0].action();
        removeAlert(alerts[0].id);
      }
    } catch (err) {
      console.error('fetchData error:', err);
    }
  }, [alerts, removeAlert]);

  return (
    <>
      {alerts && alerts?.length > 0 ? (
        <div
          className={
            alerts && alerts?.length > 0
              ? 'fixed z-30 flex h-full w-full cursor-pointer items-start justify-center overflow-auto transition duration-200 ease-out'
              : 'z-0 flex-none opacity-0 transition duration-200 ease-in'
          }
        >
          <div
            className={`mt-5 rounded-xl bg-white dark:bg-duoGrayDark-darkest ${boxHight} grid min-w-[15rem] max-w-[25rem] flex-none cursor-default grid-cols-3 grid-rows-2 border-2 border-duoGray-light px-4 pb-2 pt-3 shadow-sm dark:border-duoGrayDark-light`}
          >
            <span className='col-span-3 h-fit flex-none font-semibold text-duoGray-darkest dark:text-duoGrayDark-lightest'>
              {alerts[0].message}
            </span>
            <div className='col-span-3 flex flex-row justify-around'>
              <Button
                color={
                  theme === Themes.LIGHT
                    ? ButtonColors.BLUE
                    : ButtonColors.WHITE
                }
                label={'Close'}
                className={'col-span-1 h-fit self-end flex-none'}
                onClick={() => removeAlert(alerts[0].id)}
              />
              {alerts[0].action && alerts[0].actionLabel ? (
                <Button
                  color={
                    theme === Themes.LIGHT
                      ? ButtonColors.BLUE
                      : ButtonColors.WHITE
                  }
                  label={alerts[0].actionLabel}
                  className={'col-span-1 h-fit self-start flex-none'}
                  onClick={triggerActionButton}
                />
              ) : null}
            </div>
          </div>
          {/* ) : null} */}
        </div>
      ) : null}
    </>
  );
};

export default Alert;
