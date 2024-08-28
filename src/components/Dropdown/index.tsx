'use client';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import useClickOutside from '@/app/_utils/hooks/useClickOutside';

export enum DropdownSizes {
  SMALL = 'small',
  DEFAULT = 'default',
  LARGE = 'large',
}

const Dropdown: React.FC<DropdownProps> = (props: DropdownProps) => {
  const {
    isSearchable,
    placeholder,
    items,
    value,
    onChange,
    className,
    isFailed,
    isDisabled,
    size,
  } = props;
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [maxHight, setMaxHight] = useState<string>(size);
  const [selectedValue, setSelectedValue] = useState<string | undefined>(
    value?.toString() || ''
  );
  const [dropdownItems, setDropdownItems] = useState<string[]>(items);

  //   const dropdownRef = useRef<HTMLDivElement | null>(null);
  const dropdownRef = useClickOutside(() => setIsOpen(false));
  const searchRef = useRef<HTMLInputElement | null>(null);

  const [isSearchFailed, setIsSearchFailed] = useState<boolean>(
    isFailed ? isFailed : false
  );

  useEffect(() => {
    setDropdownItems(items);
  }, [items]);

  const handleSearch = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const originalItems = items;
      setSelectedValue(event.target.value);

      const filteredItems: string[] = originalItems.filter((item) =>
        item
          .toLocaleLowerCase()
          .includes(event.target.value.toLocaleLowerCase())
      );
      setDropdownItems(filteredItems);
    },
    [items]
  );

  const handleItemClick = useCallback(
    (item: string) => {
      setSelectedValue(item);
      onChange && onChange(item);
      setIsSearchFailed(false);
      setIsOpen(false);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onChange]
  );

  const toggleDropdown = useCallback(() => {
    if (!isDisabled) {
      setIsOpen((prevOpen) => !prevOpen);
    }
  }, [isDisabled]);

  const dropdownStyle = useMemo(() => {
    let styleClass =
      'flex h-10 w-full items-center justify-between rounded-xl border-2 font-bold uppercase md:h-12 lg:h-14';

    switch (true) {
      case props.isDisabled:
        styleClass +=
          ' cursor-default border-duoGray-default bg-duoGray-lighter p-3 text-duoGray-darkest opacity-50 dark:border-duoGrayDark-light dark:bg-duoGrayDark-dark';
        break;
      case isFailed:
        styleClass +=
          ' cursor-pointer border-duoRed-light bg-duoRed-lighter p-3 text-duoRed-darker dark:border-duoRed-darker';
        break;
      case props.isSearchable && isOpen:
        styleClass +=
          ' cursor-pointer border-duoGray-default bg-duoGray-lighter px-3 text-duoGray-darkest dark:border-duoGrayDark-light dark:bg-duoGrayDark-dark';
        break;
      default:
        styleClass +=
          ' cursor-pointer border-duoGray-default bg-duoGray-lighter p-3 text-duoGray-darkest dark:border-duoGrayDark-light dark:bg-duoGrayDark-dark';
        break;
    }

    return styleClass;
  }, [props.isDisabled, isFailed, props.isSearchable, isOpen]);

  useEffect(() => {
    setSelectedValue(value?.toString());
  }, [value]);

  useEffect(() => {
    if (isOpen && searchRef && searchRef.current) {
      searchRef.current.focus();
    }
  }, [isOpen, searchRef]);

  useEffect(() => {
    // console.log('selectedValue1', selectedValue);
    const originalItems = items;

    if (selectedValue) {
      //   console.log('selectedValue2', selectedValue);
      const filteredItems = originalItems.filter((item) =>
        item
          .toLocaleLowerCase()
          .includes(selectedValue.toString().toLocaleLowerCase())
      );
      filteredItems.length === 0
        ? setIsSearchFailed(true)
        : setIsSearchFailed(false);
    } else {
      setIsSearchFailed(false);
    }
  }, [items, selectedValue]);

  return (
    <div ref={dropdownRef} className={`relative ${className} w-full`}>
      <div
        className={
          dropdownStyle
          // `flex h-10 w-full items-center justify-between rounded-xl border-2 font-bold uppercase md:h-12 lg:h-14
          //     ${
          //         isDisabled
          //         ? 'cursor-default border-duoGray-default bg-duoGray-lighter p-3 text-duoGray-darkest opacity-50 dark:border-duoGrayDark-light dark:bg-duoGrayDark-dark'
          //         : isSearchFailed
          //             ? 'cursor-pointer border-duoRed-light bg-duoRed-lighter p-3 text-duoRed-darker dark:border-duoRed-darker'
          //             : isSearchable && isOpen
          //             ? 'cursor-pointer border-duoGray-default bg-duoGray-lighter px-3 text-duoGray-darkest dark:border-duoGrayDark-light dark:bg-duoGrayDark-dark'
          //             : 'cursor-pointer border-duoGray-default bg-duoGray-lighter p-3 text-duoGray-darkest dark:border-duoGrayDark-light dark:bg-duoGrayDark-dark'
          // }`
        }
        onClick={toggleDropdown}
      >
        <div className='mx-2 flex h-full items-center justify-start text-sm md:text-base lg:text-lg'>
          {isSearchable && isOpen ? (
            <input
              type='text'
              value={selectedValue}
              onChange={handleSearch}
              ref={searchRef}
              className={`h-full w-[100%] bg-transparent text-sm focus:outline-none md:text-base lg:text-lg ${
                isSearchFailed
                  ? 'dark:text-duoRed-darker'
                  : 'dark:text-duoBlueDark-text'
              }`}
            />
          ) : (
            <span
              className={` ${
                isSearchFailed
                  ? 'normal-case dark:text-duoRed-darker'
                  : 'uppercase dark:text-duoBlueDark-text'
              }`}
            >
              {selectedValue || placeholder}
            </span>
          )}
        </div>
        <section
          className={`flex-none ${
            isSearchFailed
              ? 'dark:text-duoRed-darker'
              : 'dark:text-duoBlueDark-text'
          }`}
        >
          <FaChevronDown />
        </section>
      </div>
      {isOpen && !isDisabled && (
        <ul
          className={`absolute z-50 flex flex-col items-start justify-start ${maxHight} mt-2 w-full overflow-auto rounded-xl border-2 border-duoGray-default bg-duoGray-lighter font-bold uppercase text-duoGray-dark dark:border-duoGrayDark-light dark:bg-duoGrayDark-dark`}
        >
          {dropdownItems.length > 0 ? (
            dropdownItems.map((item, index) => (
              <li
                key={index}
                className={`w-full cursor-pointer p-2 hover:bg-duoGray-hover dark:hover:text-duoGray-darkest ${
                  index === 0
                    ? 'rounded-t-md'
                    : index === dropdownItems.length - 1
                      ? 'rounded-b-md'
                      : ''
                } `}
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
