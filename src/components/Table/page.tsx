import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

type TableProps<T> = {
  headers: string[];
  data: T[];
};

type TableRowProps<T> = {
  item: T;
  keys: (keyof T)[];
};

const TableRow = <T,>({ item, keys }: TableRowProps<T>) => (
  <tr className='hover:bg-duoGray-lighter dark:hover:bg-duoBlueDark-darkest'>
    {keys.map((key, index) => (
      <td
        key={index}
        className={index === 0 ? 'h-16 py-2 pl-6 pr-36' : 'h-16 py-2 pr-16'}
      >
        {String(item[key])}
      </td>
    ))}
  </tr>
);

const Table = <T,>({ headers, data }: TableProps<T>) => {
  const keys = headers as (keyof T)[];

  return (
    <div className='dark:border-duoGrayDark-light mt-5  flex w-fit flex-col rounded-md border-2 border-duoGray-default pb-1'>
      <div className='mr-1 overflow-x-auto'>
        <div className='inline-block max-h-[70vh] max-w-[60vw] overflow-y-auto p-1.5 align-middle'>
          <table className='dark:divide-duoGrayDark-light divide-y-2 divide-duoGray-default rounded-lg'>
            <thead className='dark:text-duoGrayDark-lightest text-duoGray-darker'>
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
            <tbody className='dark:text-duoGrayDark-lightest divide-y-2 divide-duoGray-lighter text-duoGray-darker'>
              {data.map((item, index) => (
                <TableRow<T> key={index} item={item} keys={keys} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Table;
