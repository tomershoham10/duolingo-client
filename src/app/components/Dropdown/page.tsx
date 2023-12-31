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
  const [selectedValue, setSelectedValue] = useState<
    string | number | undefined
  >(props.value);
  const [dropdownItems, setDropdownItems] = useState<string[]>(props.items);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const searchRef = useRef<HTMLInputElement | null>(null);

  const [isFailed, setIsFailed] = useState<boolean>(
    props.isFailed ? props.isFailed : false
  );

  useEffect(() => {
    setSelectedValue(props.value);
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

  useEffect(() => {
    const originalItems = props.items;
    console.log('check', selectedValue);

    if (selectedValue) {
      const filteredItems = originalItems.filter((item) =>
        item
          .toLocaleLowerCase()
          .includes(selectedValue.toString().toLocaleLowerCase())
      );
      filteredItems.length === 0 ? setIsFailed(true) : setIsFailed(false);
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
    setDropdownItems(props.items);
  };

  return (
    <div ref={dropdownRef} className={`relative ${props.className} z-10`}>
      <div
        className={
          props.isDisabled
            ? 'flex h-14 w-full cursor-default items-center justify-between rounded-xl border-2 border-duoGray-default bg-duoGray-light p-3 font-bold uppercase text-duoGray-dark'
            : isFailed
              ? 'flex h-14 w-full cursor-pointer items-center justify-between rounded-xl border-2 border-duoRed-light bg-duoRed-lighter p-3 font-bold uppercase text-duoRed-darker'
              : props.isSearchable && isOpen
                ? 'flex h-14 w-full cursor-pointer items-center justify-between rounded-xl border-2 border-duoGray-default bg-duoGray-lighter px-3 font-bold uppercase text-duoGray-darkest'
                : 'flex h-14 w-full cursor-pointer items-center justify-between rounded-xl border-2 border-duoGray-default bg-duoGray-lighter p-3 font-bold uppercase text-duoGray-darkest'
        }
        onClick={() => setIsOpen(true)}
      >
        <div className='mx-2 flex h-full items-center justify-start text-lg'>
          {props.isSearchable && isOpen ? (
            <input
              type='text'
              value={selectedValue}
              onChange={handleSearch}
              ref={searchRef}
              className='h-full w-[100%] bg-transparent text-lg focus:outline-none'
            />
          ) : (
            <span className='uppercase'>
              {selectedValue || props.placeholder}
            </span>
          )}
        </div>
        <FontAwesomeIcon icon={faChevronDown} />
      </div>
      {isOpen && !props.isDisabled && (
        <ul
          className={`absolute flex flex-col items-start justify-start ${maxHight} mt-2 w-full overflow-auto rounded-xl border-2 border-duoGray-default bg-duoGray-lighter font-bold uppercase text-duoGray-dark`}
        >
          {dropdownItems.length > 0 ? (
            dropdownItems.map((item, index) => (
              <li
                key={index}
                className={
                  index === 0
                    ? 'w-full cursor-pointer rounded-t-md p-2 hover:bg-duoGray-hover'
                    : index === dropdownItems.length - 1
                      ? 'w-full cursor-pointer rounded-b-md p-2 hover:bg-duoGray-hover'
                      : 'w-full cursor-pointer p-2 hover:bg-duoGray-hover'
                }
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
