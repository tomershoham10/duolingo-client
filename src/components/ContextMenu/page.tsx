'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useStore } from 'zustand';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useContextMenuStore } from '@/app/store/stores/useContextMenuStore';

const ContextMenu: React.FC = () => {
  const isOpen = useStore(useContextMenuStore, (state) => state.isOpen);

  const content = useContextMenuStore.getState().content;
  const coordinates = useContextMenuStore.getState().coordinates;
  const toggleMenuOpen = useContextMenuStore.getState().toggleMenuOpen;
  const setMenuOpen = useContextMenuStore.getState().setMenuOpen;

  const contextMenuRef = useRef<HTMLUListElement | null>(null);

  const handleClickOutside = useCallback(
    () => (event: MouseEvent) => {
      if (
        contextMenuRef.current &&
        !contextMenuRef.current.contains(event.target as Node)
      ) {
        toggleMenuOpen();
      }
    },
    [toggleMenuOpen]
  );

  const handleScroll = useCallback(() => {
    console.log('scrolling');
    if (isOpen) {
      toggleMenuOpen();
    }
  }, [isOpen, toggleMenuOpen]);

  const handleResize = useCallback(() => {
    if (isOpen) {
      toggleMenuOpen();
    }
  }, [isOpen, toggleMenuOpen]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        toggleMenuOpen();
      }
    },
    [toggleMenuOpen]
  );

  const handleContextMenu = useCallback(
    (event: MouseEvent) => {
      event.preventDefault();
      setMenuOpen();
    },
    [setMenuOpen]
  );

  const handleVisibilityChange = useCallback(() => {
    if (isOpen && document.visibilityState === 'hidden') {
      toggleMenuOpen();
    }
  }, [isOpen, toggleMenuOpen]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('wheel', handleScroll);
      window.addEventListener('resize', handleResize);
      document.addEventListener('visibilitychange', handleVisibilityChange);
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('contextmenu', handleContextMenu);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('wheel', handleScroll);
        window.removeEventListener('resize', handleResize);
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('contextmenu', handleContextMenu);
        document.removeEventListener(
          'visibilitychange',
          handleVisibilityChange
        );
      };
    }
  }, [
    handleClickOutside,
    handleContextMenu,
    handleKeyDown,
    handleResize,
    handleScroll,
    handleVisibilityChange,
    isOpen,
  ]);

  return (
    <>
      {isOpen && (
        <ul
          className={`absolute z-50 w-fit border-2 bg-white dark:border-duoGrayDark-light dark:bg-duoBlueDark-darkest ${
            content.length > 1
              ? 'rounded-xl py-3'
              : 'cursor-pointer rounded-b-2xl rounded-r-2xl rounded-tl-[4px] p-3 text-center dark:hover:bg-[#283247]'
          }`}
          style={{
            top: `${coordinates.pageY}px`,
            left: `${coordinates.pageX}px`,
          }}
          ref={contextMenuRef}
          onClick={() => {
            content.length === 1 ? content[0].onClick() : null;
          }}
        >
          {content.length > 1 ? (
            content.map((listItem, index) => (
              <li
                className='duration-50 min-w-[10rem] py-2 pl-4 text-lg font-extrabold text-duoGray-darkest transition dark:text-duoGrayDark-lightest dark:hover:bg-duoBlueDark-default'
                key={index}
              >
                <button className='w-full text-left' onClick={listItem.onClick}>
                  {listItem.icon ? (
                    <FontAwesomeIcon
                      className='text-2xl'
                      icon={listItem.icon}
                    />
                  ) : null}
                  {listItem.placeHolder}
                </button>
              </li>
            ))
          ) : content.length === 1 ? (
            <li className='duration-50 w-fit text-lg font-extrabold text-duoGray-darkest transition dark:text-duoGrayDark-lightest'>
              <button className='flex w-full items-center justify-center'>
                {content[0].icon ? (
                  <FontAwesomeIcon
                    className='text-2xl'
                    icon={content[0].icon}
                  />
                ) : null}
                {content[0].placeHolder}
              </button>
            </li>
          ) : (
            <li className='duration-50 min-w-[10rem] py-2 pl-4 transition dark:hover:bg-duoBlueDark-default'>
              context menu
            </li>
          )}
        </ul>
      )}
    </>
  );
};

export default ContextMenu;
