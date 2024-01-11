'use client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

type TableProps<T> = {
  headers: string[];
  data: T[];
  isSelectable: boolean;
  onSelect?: (row: any) => void;
};

type TableRowProps<T> = {
  isSelected?: boolean;
  rowIndex: number;
  item: T;
  keysValues: (keyof T)[];
  isSelectable: boolean;
  onSelect?: (row: any) => void;
  selectRow?: (rowIndex: number) => void;
};

const TableRow = <T,>({
  isSelected,
  rowIndex,
  item,
  keysValues,
  isSelectable,
  onSelect,
  selectRow,
}: TableRowProps<T>) => {
  return (
    <tr
      className={` font-bold
      ${
        isSelectable
          ? isSelected
            ? 'cursor-pointer bg-duoGray-lighter dark:bg-duoBlueDark-darkest'
            : 'cursor-pointer hover:bg-duoGray-lighter dark:hover:bg-duoBlueDark-darkest'
          : 'cursor-default hover:bg-duoGray-lighter dark:hover:bg-duoBlueDark-darkest'
      }`}
      onClick={() => {
        onSelect ? onSelect(item) : null;
        selectRow ? selectRow(rowIndex) : null;
      }}
    >
      {keysValues.map((keysValue, index) => (
        <td key={index} className={'h-16 py-2 pr-16'}>
          {String(item[keysValue])}
        </td>
      ))}
    </tr>
  );
};

const Table = <T,>({
  headers,
  data,
  isSelectable,
  onSelect,
}: TableProps<T>) => {
  console.log('table - data', data);
  const keys = headers as (keyof T)[];
  const [selectedRow, setSelectedRow] = useState<number>();
  return (
    <div className='mt-5 flex max-w-fit flex-col rounded-md border-2 border-duoGray-default pb-1 dark:border-duoGrayDark-light'>
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
            <tbody className='divide-y-2 divide-duoGray-lighter text-duoGray-darker dark:divide-duoGrayDark-dark dark:text-duoGrayDark-lightest'>
              {data.map((item, index) => (
                <TableRow<T>
                  key={index}
                  rowIndex={index}
                  isSelected={selectedRow === index}
                  item={item}
                  keysValues={keys}
                  isSelectable={isSelectable}
                  onSelect={onSelect}
                  selectRow={setSelectedRow}
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
