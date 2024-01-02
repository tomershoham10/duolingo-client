'use client';
import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

export enum DropdownSizes {
  SMALL = 'small',
  DEFAULT = 'default',
  LARGE = 'large',
}

interface DropdownProps {
  isSearchable: boolean;
  placeholder: string;
  items: string[];
  value?: string | number | undefined;
  onChange: (value: string) => void;
  className?: string;
  isFailed?: boolean;
  isDisabled?: boolean;
  size: DropdownSizes;
}

const Dropdown: React.FC<DropdownProps> = (props: DropdownProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [maxHight, setMaxHight] = useState<string>();
  const [selectedValue, setSelectedValue] = useState<string | undefined>(
    props.value?.toString() || ''
  );
  const [dropdownItems, setDropdownItems] = useState<string[]>(props.items);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const searchRef = useRef<HTMLInputElement | null>(null);

  const [isFailed, setIsFailed] = useState<boolean>(
    props.isFailed ? props.isFailed : false
  );

  useEffect(() => {
    setSelectedValue(props.value?.toString());
  }, [props.value]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutsideDropdown);
      return () => {
        document.removeEventListener('mousedown', handleClickOutsideDropdown);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && searchRef && searchRef.current) {
      searchRef.current.focus();
    }
  }, [isOpen, searchRef]);

  useEffect(() => {
    const setHight = () => {
      switch (props.size) {
        case DropdownSizes.SMALL:
          return 'xl:max-h-32 3xl:max-h-52';
        case DropdownSizes.DEFAULT:
          return '';
        case DropdownSizes.LARGE:
          return 'xl:h-64 3xl:h-96';
      }
    };
    setMaxHight(setHight);
  }, [props.size]);

//   useEffect(() => {
//     console.log('dropdownItems', dropdownItems);
//   }, [dropdownItems]);

  useEffect(() => {
    // console.log('selectedValue1', selectedValue);
    const originalItems = props.items;

    if (selectedValue) {
    //   console.log('selectedValue2', selectedValue);
      const filteredItems = originalItems.filter((item) =>
        item
          .toLocaleLowerCase()
          .includes(selectedValue.toString().toLocaleLowerCase())
      );
      filteredItems.length === 0 ? setIsFailed(true) : setIsFailed(false);
    } else {
      setIsFailed(false);
    }
  }, [props.items, selectedValue]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const originalItems = props.items;
    setSelectedValue(event.target.value);

    const filteredItems: string[] = originalItems.filter((item) =>
      item.toLocaleLowerCase().includes(event.target.value.toLocaleLowerCase())
    );
    setDropdownItems(filteredItems);
  };

  const handleItemClick = (item: string) => {
    setSelectedValue(item);
    props.onChange && props.onChange(item);
    setIsFailed(false);
    setIsOpen(false);
  };

  const handleClickOutsideDropdown = (event: MouseEvent) => {
    handleClickOutside(event, searchRef)
      ? null
      : handleClickOutside(event, dropdownRef)
        ? null
        : closeDropdown();
  };

  const handleClickOutside = (
    event: MouseEvent,
    ref: React.RefObject<HTMLDivElement | HTMLInputElement | null>
  ) => {
    if (ref && ref.current && !ref.current.contains(event.target as Node)) {
      return false;
    } else return true;
  };
  const closeDropdown = () => {
    setIsOpen(false);
    // setDropdownItems(props.items);
  };

  return (
    <div ref={dropdownRef} className={`relative ${props.className} z-10`}>
      <div
        className={`flex h-14 w-full items-center justify-between rounded-xl border-2 font-bold uppercase
   ${
     props.isDisabled
       ? 'dark:border-duoGrayDark-light dark:bg-duoGrayDark-dark cursor-default border-duoGray-default bg-duoGray-lighter p-3 text-duoGray-darkest opacity-50'
       : isFailed
         ? 'cursor-pointer border-duoRed-light bg-duoRed-lighter p-3 text-duoRed-darker dark:border-duoRed-darker'
         : props.isSearchable && isOpen
           ? 'dark:border-duoGrayDark-light dark:bg-duoGrayDark-dark cursor-pointer border-duoGray-default bg-duoGray-lighter px-3 text-duoGray-darkest'
           : 'dark:border-duoGrayDark-light dark:bg-duoGrayDark-dark cursor-pointer border-duoGray-default bg-duoGray-lighter p-3 text-duoGray-darkest'
   }`}
        onClick={() => setIsOpen(true)}
      >
        <div className='mx-2 flex h-full items-center justify-start text-lg'>
          {props.isSearchable && isOpen ? (
            <input
              type='text'
              value={selectedValue}
              onChange={handleSearch}
              ref={searchRef}
              className={`h-full w-[100%] bg-transparent text-lg focus:outline-none ${
                isFailed
                  ? 'dark:text-duoRed-darker'
                  : 'dark:text-duoBlueDark-text'
              }`}
            />
          ) : (
            <span
              className={` ${
                isFailed
                  ? 'normal-case dark:text-duoRed-darker'
                  : 'dark:text-duoBlueDark-text uppercase'
              }`}
            >
              {selectedValue || props.placeholder}
            </span>
          )}
        </div>
        <FontAwesomeIcon
          icon={faChevronDown}
          className={`${
            isFailed ? 'dark:text-duoRed-darker' : 'dark:text-duoBlueDark-text'
          }`}
        />
      </div>
      {isOpen && !props.isDisabled && (
        <ul
          className={`absolute flex flex-col items-start justify-start ${maxHight} dark:border-duoGrayDark-light dark:bg-duoGrayDark-dark mt-2 w-full overflow-auto rounded-xl border-2 border-duoGray-default bg-duoGray-lighter font-bold uppercase text-duoGray-dark`}
        >
          {dropdownItems.length > 0 ? (
            dropdownItems.map((item, index) => (
              <li
                key={index}
                className={`w-full cursor-pointer p-2 hover:bg-duoGray-hover dark:hover:text-duoGray-darkest
                  ${
                    index === 0
                      ? 'rounded-t-md'
                      : index === dropdownItems.length - 1
                        ? 'rounded-b-md'
                        : ''
                  }  `}
                onClick={() => handleItemClick(item)}
              >
                {item}
              </li>
            ))
          ) : (
            <div className='w-full cursor-pointer rounded-t-md p-2 hover:bg-duoGray-hover'>
              Not found.
            </div>
          )}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;