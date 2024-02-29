'use client';

import { useEffect, useRef } from 'react';
import { useStore } from 'zustand';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useContextMenuStore } from '@/app/store/stores/useContextMenuStore';

const ContextMenu: React.FC = () => {
  const isOpen = useStore(useContextMenuStore, (state) => state.isOpen);

  const contextStore = {
    content: useContextMenuStore.getState().content,
    coordinates: useContextMenuStore.getState().coordinates,
    toggleMenuOpen: useContextMenuStore.getState().toggleMenuOpen,
    setMenuOpen: useContextMenuStore.getState().setMenuOpen,
  };

  const contextMenuRef = useRef<HTMLUListElement | null>(null);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      contextMenuRef.current &&
      !contextMenuRef.current.contains(event.target as Node)
    ) {
      contextStore.toggleMenuOpen();
    }
  };
  const handleScroll = () => {
    console.log('scrolling');
    if (isOpen) {
      contextStore.toggleMenuOpen();
    }
  };

  const handleResize = () => {
    if (isOpen) {
      contextStore.toggleMenuOpen();
    }
  };
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      contextStore.toggleMenuOpen();
    }
  };

  const handleContextMenu = (event: MouseEvent) => {
    event.preventDefault();
    contextStore.setMenuOpen();
  };
  const handleVisibilityChange = () => {
    if (isOpen && document.visibilityState === 'hidden') {
      contextStore.toggleMenuOpen();
    }
  };

  return (
    <>
      {isOpen && (
        <ul
          className={`absolute z-50 w-fit border-2 bg-white dark:border-duoGrayDark-light dark:bg-duoBlueDark-darkest ${
            contextStore.content.length > 1
              ? 'rounded-xl py-3'
              : 'cursor-pointer rounded-b-2xl rounded-r-2xl rounded-tl-[4px] p-3 text-center dark:hover:bg-[#283247]'
          }`}
          style={{
            top: `${contextStore.coordinates.pageY}px`,
            left: `${contextStore.coordinates.pageX}px`,
          }}
          ref={contextMenuRef}
          onClick={() => {
            contextStore.content.length === 1
              ? contextStore.content[0].onClick()
              : null;
          }}
        >
          {contextStore.content.length > 1 ? (
            contextStore.content.map((listItem, index) => (
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
          ) : contextStore.content.length === 1 ? (
            <li className='duration-50 w-fit text-lg font-extrabold text-duoGray-darkest transition dark:text-duoGrayDark-lightest '>
              <button className='flex w-full items-center justify-center'>
                {contextStore.content[0].icon ? (
                  <FontAwesomeIcon
                    className='text-2xl'
                    icon={contextStore.content[0].icon}
                  />
                ) : null}
                {contextStore.content[0].placeHolder}
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
