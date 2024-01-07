'use client';

import { useContextMenuStore } from '@/app/store/stores/useContextMenuStore';
import { useEffect, useRef } from 'react';
import { useStore } from 'zustand';

const ContextMenu: React.FC = () => {
  const isOpen = useStore(useContextMenuStore, (state) => state.isOpen);
  const coordinates = useStore(
    useContextMenuStore,
    (state) => state.coordinates
  );
  const toggleMenuOpen = useContextMenuStore.getState().toggleMenuOpen;
  const contextMenuRef = useRef<HTMLUListElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('wheel', handleScroll);
      window.addEventListener('resize', handleResize);
      document.addEventListener('visibilitychange', handleVisibilityChange);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('wheel', handleScroll);
        window.removeEventListener('resize', handleResize);
        document.removeEventListener(
          'visibilitychange',
          handleVisibilityChange
        );
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      contextMenuRef.current &&
      !contextMenuRef.current.contains(event.target as Node)
    ) {
      toggleMenuOpen();
    }
  };
  const handleScroll = () => {
    console.log('scrolling');
    if (isOpen) {
      toggleMenuOpen();
    }
  };

  const handleResize = () => {
    if (isOpen) {
      toggleMenuOpen();
    }
  };

  const handleVisibilityChange = () => {
    if (isOpen && document.visibilityState === 'hidden') {
      toggleMenuOpen();
    }
  };

  return (
    <>
      {isOpen && (
        <ul
          className='absolute z-50 bg-white text-black'
          style={{
            top: `${coordinates.pageY}px`,
            left: `${coordinates.pageX}px`,
          }}
          ref={contextMenuRef}
        >
          <li>context menu</li>
        </ul>
      )}
    </>
  );
};

export default ContextMenu;
