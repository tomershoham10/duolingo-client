'use client';
import { useEffect, useState } from 'react';

import useStore from '@/app/store/useStore';
import { AlertSizes, useAlertStore } from '@/app/store/stores/useAlertStore';

import Button, { ButtonColors } from '@/components/Button/page';

const Alert: React.FC = () => {
  const alerts = useStore(useAlertStore, (state) => state.alerts);
  const removeAlert = useAlertStore.getState().removeAlert;

  const [isAlertOpened, setIsAlertOpened] = useState<boolean>(false);
  const [alertId, setAlertId] = useState<number>();
  const [alertMessage, setAlertMessage] = useState<string>();
  const [alertSize, setAlertSize] = useState<AlertSizes>();

  const [boxHight, setBoxHight] = useState<string>();

  useEffect(() => {
    // console.log('alert added');
    if (alerts && alerts?.length > 0) {
      setIsAlertOpened(true);
      setAlertId(alerts[0].id);
      setAlertMessage(alerts[0].message);
      setAlertSize(alerts[0].size);
    } else {
      setIsAlertOpened(false);
    }
  }, [alerts]);

  useEffect(() => {
    switch (alertSize) {
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
  }, [alertSize]);

  return (
    <div
      className={
        isAlertOpened
          ? 'fixed z-30 flex h-full w-full cursor-pointer items-start justify-center overflow-auto transition duration-200 ease-out '
          : 'z-0 flex-none opacity-0 transition duration-200 ease-in'
      }
    >
      {isAlertOpened && alertId ? (
        <div
          className={`mt-5 rounded-xl bg-white ${boxHight} grid min-w-[15rem] max-w-[25rem] flex-none cursor-default grid-cols-3 grid-rows-2 border-2 border-duoGray-light px-4 pb-2 pt-3 shadow-sm`}
        >
          <span className='col-span-3 h-fit flex-none font-semibold text-duoGray-darkest'>
            {alertMessage}
          </span>
          <Button
            color={ButtonColors.BLUE}
            label={'Close'}
            style={' col-span-1 col-start-3 h-fit self-end flex-none'}
            onClick={() => removeAlert(alertId)}
          />
        </div>
      ) : null}
    </div>
  );
};

export default Alert;
