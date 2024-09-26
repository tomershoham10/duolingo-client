import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useStore } from 'zustand';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { PopupsTypes, usePopupStore } from '@/app/store/stores/usePopupStore';
import Menu from '@/components/Menu/page';

interface ItemsListProps {
  itemsList: SidebarItem[];
}

const ItemsList: React.FC<ItemsListProps> = (props) => {
  const { itemsList } = props;

  const sidebarItemRef = useRef<HTMLLIElement | null>(null);

  const [hoveredElement, setHoveredElement] = useState<string | null>(null);

  const selectedPopup = useStore(usePopupStore, (state) => state.selectedPopup);
  const updateSelectedPopup = usePopupStore.getState().updateSelectedPopup;

  useEffect(() => {
    selectedPopup === PopupsTypes.CLOSED ? null : setHoveredElement(null);
  }, [selectedPopup]);

  return (
    <>
      <ul className='flex-grow'>
        {itemsList.map((sideBaritem) => (
          <li
            key={sideBaritem.name}
            onMouseEnter={() =>
              sideBaritem.subItems ? setHoveredElement(sideBaritem.name) : null
            }
            onMouseLeave={() => setHoveredElement(null)}
            ref={sidebarItemRef}
            className={`duration-50 relative flex items-center justify-center transition md:justify-start ${
              //   selected === index
              //     ? 'cursor-pointer bg-duoBlue-lightest pb-3 pl-3 pr-3 pt-3 text-duoBlue-light'
              // :
              'cursor-pointer hover:bg-duoGray-hover dark:hover:bg-duoBlueDark-dark'
            }`}
          >
            <button
              className='flex w-full cursor-pointer flex-row items-center justify-start overflow-hidden px-6 py-[1rem]'
              onClick={() => {
                console.log('click');

                sideBaritem.subItems
                  ? null
                  : !!sideBaritem.popup
                    ? updateSelectedPopup(sideBaritem.popup)
                    : sideBaritem.onClick
                      ? sideBaritem.onClick
                      : null;
              }}
            >
              {sideBaritem.href ? (
                <Link
                  className='flex h-full w-full cursor-pointer items-center justify-start overflow-hidden'
                  href={sideBaritem.href}
                >
                  {sideBaritem.icon ? (
                    <FontAwesomeIcon
                      className='fa-xs fa-solid h-7 w-7 2xl:h-8 2xl:w-8'
                      icon={sideBaritem.icon}
                    />
                  ) : null}
                  <p className='ml-4 hidden truncate text-lg md:block 2xl:text-xl'>
                    {sideBaritem.name}
                  </p>
                </Link>
              ) : (
                <span className='overflow-hidden'>
                  {sideBaritem.icon ? (
                    <span className='flex w-full flex-row items-center justify-center'>
                      <FontAwesomeIcon
                        className='fa-xs fa-solid h-7 w-7 2xl:h-8 2xl:w-8'
                        icon={sideBaritem.icon}
                      />
                      <p className='ml-4 hidden truncate text-lg md:block 2xl:text-xl'>
                        {sideBaritem.name}
                      </p>
                    </span>
                  ) : (
                    <p className='truncate'>{sideBaritem.name}</p>
                  )}
                </span>
              )}
            </button>

            {!!sideBaritem.subItems ? (
              <Menu
                isHovered={
                  hoveredElement === sideBaritem.name && !!sideBaritem.subItems
                }
                items={sideBaritem.subItems}
              />
            ) : null}
          </li>
        ))}
      </ul>
    </>
  );
};

export default ItemsList;
