
export interface TableHead {
  key: string;
  label: string;
}

interface TableRow {
  [key: string]: any;
}

interface DefaultTableProps {
  head: TableHead[];
  rows: TableRow[];
  onSelect?: (row: any) => void;
  selectedRowIndex?: number;
  isSelectable?: boolean;
}

const Table = (props: DefaultTableProps) => {
  const headers = props.head;
  const tableData = props.rows;
  const onSelect = props.onSelect;
  return (
    <div className=' flex max-h-[70%] justify-center overflow-auto'>
      <table className=' divide-y-2 divide-duoGray-default rounded-lg bg-black text-left dark:divide-duoBlueDark-text dark:divide-opacity-70 2xl:text-xl'>
        <thead className=' uppercase text-duoGray-darker  dark:text-duoBlueDark-text'>
          <tr>
            {headers.map((header, headerIndex) => (
              <th
                key={headerIndex}
                className='h-12 cursor-default px-4 2xl:px-8 2xl:h-20'
              >
                <span className='flex items-center justify-start font-extrabold '>
                  {header.label}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className='divide-y-2 divide-duoGray-lighter text-duoGray-darker dark:divide-duoGrayDark-dark dark:text-duoGrayDark-lightest'>
          {tableData.map((row, index) => {
            const isLast = index === tableData.length - 1;
            const headersKeys = Object.values(headers.map((head) => head.key));
            return (
              <tr
                key={index}
                className={`cursor-pointer font-bold hover:bg-duoGray-lighter dark:hover:bg-duoBlueDark-darkest
                ${
                  props.selectedRowIndex === index
                    ? 'bg-duoGray-lighter dark:bg-duoBlueDark-darkest'
                    : ''
                }
                `}
                onClick={() => {
                  onSelect ? onSelect(tableData[index]) : null;
                }}
              >
                {headers.map(({ key }) => (
                  <td
                    key={key}
                    className={`h-16 px-4
                  ${
                    isLast
                      ? headersKeys.indexOf(key) === 0
                        ? 'rounded-bl-lg'
                        : headersKeys.indexOf(key) === headersKeys.length - 1
                          ? 'rounded-br-lg'
                          : ''
                      : ''
                  }`}
                  >
                    {row[key]}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
