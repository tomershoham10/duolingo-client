'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useStore } from 'zustand';
import { usePopupStore } from '@/app/store/stores/usePopupStore';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

interface MenuProps {
  items: SidebarItem[];
  isHovered: boolean;
}

// interface Item {
//   name: string;
//   popup?: PopupsTypes;
//   icon?: IconDefinition;
//   href?: string;
//   onClick?: () => void;
//   subItems?: SidebarItem[];
// }

const Menu: React.FC<MenuProps> = (props) => {
  const { items, isHovered } = props;

  const usePopupStoreObj = {
    selectedPopup: useStore(usePopupStore, (state) => state.selectedPopup),
    updateSelectedPopup: usePopupStore.getState().updateSelectedPopup,
  };

  const [hoveredSubMenu, setHoveredSubMenu] = useState<string | null>(null);

  useEffect(() => {
    !isHovered ? setHoveredSubMenu(null) : null;
  }, [isHovered]);

  return (
    <>
      {!!items && items.length > 0 && isHovered ? (
        <ul className='absolute -right-[15%] top-3 z-30 w-fit translate-x-1/2 rounded-xl border-2 bg-duoGray-lighter py-3 dark:border-duoGrayDark-light dark:bg-duoBlueDark-darkest'>
          {items.map((subItem) => (
            <li
              className='relevant duration-50 min-w-[10rem] py-2 pl-4 transition hover:bg-duoGray-light dark:hover:bg-duoBlueDark-default 2xl:py-3 2xl:pl-5 2xl:text-xl'
              key={subItem.name}
            >
              <section
                onClick={() => {
                  subItem.popup
                    ? usePopupStoreObj.updateSelectedPopup(subItem.popup)
                    : subItem.onClick
                      ? subItem.onClick()
                      : null;
                }}
                className='flex'
                onMouseEnter={() =>
                  !!subItem.subItems && subItem.subItems.length > 0
                    ? setHoveredSubMenu(subItem.name)
                    : setHoveredSubMenu(null)
                }
              >
                {!!subItem.subItems &&
                subItem.subItems.length > 0 &&
                hoveredSubMenu === subItem.name ? (
                  <section
                    className='absolute -right-[40%] -translate-y-4 translate-x-1/2'
                    onMouseEnter={() => setHoveredSubMenu(subItem.name)}
                    // onMouseLeave={() => setHoveredSubMenu(null)}
                  >
                    <Menu items={subItem.subItems} isHovered={true} />
                  </section>
                ) : null}
                {subItem.href ? (
                  <Link className='text-left' href={subItem.href}>
                    {subItem.name}
                  </Link>
                ) : (
                  <span className='text-left'>{subItem.name}</span>
                )}
              </section>
            </li>
          ))}
        </ul>
      ) : null}
    </>
  );
};

export default Menu;
