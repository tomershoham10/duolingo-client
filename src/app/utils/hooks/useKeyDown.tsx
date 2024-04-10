import { useEffect } from 'react';

export const useKeyDown = (
  callback: (event: KeyboardEvent) => void,
  keys: string[]
) => {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const keyPressEvent = event as KeyboardEvent;
      const wasAnyKeyPressed = keys.some((key) => keyPressEvent.key === key);
      if (wasAnyKeyPressed) {
        event.preventDefault();
        callback(keyPressEvent);
      }
    };

    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [callback, keys]);
};
