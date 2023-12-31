'use client';
import { useEffect, useRef, useState } from 'react';
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
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const searchRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setSelectedValue(props.value);
  }, [props.value]);

  const setSeachInputResult = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('dropdown search', event.target.value, dropdownRef);
  };

  const handleItemClick = (item: string) => {
    setSelectedValue(item);
    props.onChange && props.onChange(item);
    setIsOpen(false);
  };

  const handleClickOutsideDropdown = (event: MouseEvent) => {
    handleClickOutside(event, searchRef)
      ? handleClickOutside(event, dropdownRef)
        ? null
        : setIsOpen(false)
      : setIsOpen(false);
  };

  const handleClickOutside = (
    event: MouseEvent,
    ref: React.RefObject<HTMLDivElement | HTMLInputElement | null>
  ) => {
    if (ref && ref.current && !ref.current.contains(event.target as Node)) {
      return false;
    } else return true;
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutsideDropdown);
      return () => {
        document.removeEventListener('mousedown', handleClickOutsideDropdown);
      };
    }
  }, [isOpen]);

  useEffect(() => {
    const setHigh = () => {
      switch (props.size) {
        case DropdownSizes.SMALL:
          return 'xl:max-h-32 3xl:max-h-52';
        case DropdownSizes.DEFAULT:
          return '';
        case DropdownSizes.LARGE:
          return 'xl:h-64 3xl:h-96';
      }
    };
    setMaxHight(setHigh);
  }, [props.size]);

  return (
    <div ref={dropdownRef} className={`relative ${props.className} z-10`}>
      <button
        className={
          props.isDisabled
            ? 'flex w-full cursor-default items-center justify-between rounded-xl border-2 border-duoGray-default bg-duoGray-light p-3 font-bold uppercase text-duoGray-dark'
            : props.isFailed
              ? 'flex w-full cursor-pointer items-center justify-between rounded-xl border-2 border-duoRed-light bg-duoGray-lighter p-3 font-bold uppercase text-duoGray-darkest'
              : 'flex w-full cursor-pointer items-center justify-between rounded-xl border-2 border-duoGray-default bg-duoGray-lighter p-3 font-bold uppercase text-duoGray-darkest'
        }
        onClick={() => setIsOpen(true)}
      >
        <div>
          {props.isSearchable && isOpen ? (
            <div>
              <input
                type='text'
                value={selectedValue}
                onChange={setSeachInputResult}
                ref={searchRef}
              />
            </div>
          ) : (
            selectedValue || props.placeholder
          )}
        </div>
        <FontAwesomeIcon icon={faChevronDown} />
      </button>
      {isOpen && !props.isDisabled && (
        <div
          className={`absolute flex flex-col items-start justify-start ${maxHight} mt-2 w-full overflow-auto rounded-xl border-2 border-duoGray-default bg-duoGray-lighter font-bold uppercase text-duoGray-dark`}
        >
          {props.items.map((item, index) => (
            <div
              key={index}
              className={
                index === 0
                  ? 'w-full cursor-pointer rounded-t-md p-2 hover:bg-duoGray-hover'
                  : index === props.items.length - 1
                    ? 'w-full cursor-pointer rounded-b-md p-2 hover:bg-duoGray-hover'
                    : 'w-full cursor-pointer p-2 hover:bg-duoGray-hover'
              }
              onClick={() => handleItemClick(item)}
            >
              {item}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
