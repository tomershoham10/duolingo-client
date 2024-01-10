'use client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

type TableProps<T> = {
  headers: string[];
  data: T[];
  isSelectable: boolean;
};

type TableRowProps<T> = {
  item: T;
  keys: (keyof T)[];
  isSelectable: boolean;
};

const TableRow = <T,>({ item, keys, isSelectable }: TableRowProps<T>) => {
  const [selected, setSelected] = useState<boolean>(false);
  return (
    <tr
      className={` font-bold
      ${
        isSelectable
          ? selected
            ? 'cursor-pointer bg-duoGray-lighter dark:bg-duoBlueDark-darkest'
            : 'cursor-pointer hover:bg-duoGray-lighter dark:hover:bg-duoBlueDark-darkest'
          : 'cursor-default hover:bg-duoGray-lighter dark:hover:bg-duoBlueDark-darkest'
      }`}
    >
      {keys.map((key, index) => (
        <td
          key={index}
          className={'h-16 py-2 pr-16'}
          onClick={() => {
            isSelectable ? setSelected(true) : null;
          }}
        >
          {String(item[key])}
        </td>
      ))}
    </tr>
  );
};

const Table = <T,>({ headers, data, isSelectable }: TableProps<T>) => {
  console.log('table - data', data);
  const keys = headers as (keyof T)[];

  return (
    <div className='mt-5 flex flex-col max-w-fit rounded-md border-2 border-duoGray-default pb-1 dark:border-duoGrayDark-light'>
      <div className='overflow-x-auto'>
        <div className='inline-block max-h-[70vh] overflow-y-auto p-1.5 align-middle'>
          <table className='divide-y-2 divide-duoGray-default rounded-lg dark:divide-duoGrayDark-light'>
            <thead className='text-duoGray-darker dark:text-duoGrayDark-lightest'>
              <tr>
                {headers.map((header, index) => (
                  <th
                    key={index}
                    className={
                      index === 0
                        ? 'h-12 cursor-pointer py-2 pl-6 pr-36 uppercase'
                        : 'h-12 cursor-pointer py-2 pr-16 uppercase'
                    }
                  >
                    <span className='flex items-center justify-start font-extrabold'>
                      {header}
                      <FontAwesomeIcon
                        className='fa-xs fa-duotone ml-1'
                        icon={faChevronDown}
                      />
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className='divide-y-2 divide-duoGray-lighter text-duoGray-darker dark:text-duoGrayDark-lightest'>
              {data.map((item, index) => (
                <TableRow<T>
                  key={index}
                  item={item}
                  keys={keys}
                  isSelectable={isSelectable}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Table;
