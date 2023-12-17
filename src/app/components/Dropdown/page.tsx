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
  placeholder: string;
  items: string[];
  value: string | null;
  onChange: (value: string) => void;
  className?: string;
  isFailed?: boolean;
  isDisabled?: boolean;
  size: DropdownSizes;
}

const Dropdown: React.FC<DropdownProps> = ({
  placeholder,
  items,
  value,
  onChange,
  className,
  isFailed,
  isDisabled,
  size,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [maxHight, setMaxHight] = useState<string>();
  const [selectedValue, setSelectedValue] = useState<string | null>(value);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  const handleItemClick = (item: string) => {
    setSelectedValue(item);
    onChange && onChange(item);
    setIsOpen(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const setHigh = () => {
      switch (size) {
        case DropdownSizes.SMALL:
          return 'xl:max-h-32 3xl:max-h-52';
        case DropdownSizes.DEFAULT:
          return '';
        case DropdownSizes.LARGE:
          return 'xl:h-64 3xl:h-96';
      }
    };
    setMaxHight(setHigh);
  }, [size]);

  return (
    <div ref={dropdownRef} className={`relative ${className} z-10`}>
      <button
        className={
          isDisabled
            ? 'flex w-full cursor-default items-center justify-between rounded-xl border-2 border-duoGray-default bg-duoGray-light p-3 font-bold uppercase text-duoGray-dark'
            : isFailed
              ? 'flex w-full cursor-pointer items-center justify-between rounded-xl border-2 border-duoRed-light bg-duoGray-lighter p-3 font-bold uppercase text-duoGray-darkest'
              : 'flex w-full cursor-pointer items-center justify-between rounded-xl border-2 border-duoGray-default bg-duoGray-lighter p-3 font-bold uppercase text-duoGray-darkest'
        }
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{selectedValue || placeholder}</span>
        <FontAwesomeIcon icon={faChevronDown} />
      </button>
      {isOpen && !isDisabled && (
        <div
          className={`absolute flex flex-col items-start justify-start ${maxHight} mt-2 w-full overflow-auto rounded-xl border-2 border-duoGray-default bg-duoGray-lighter font-bold uppercase text-duoGray-dark`}
        >
          {items.map((item, index) => (
            <div
              key={index}
              className={
                index === 0
                  ? 'w-full cursor-pointer rounded-t-md p-2 hover:bg-duoGray-hover'
                  : index === items.length - 1
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
