export interface TableHead {
  key: string;
  label: string;
}

export interface TableRow {
  [key: string]: any;
}

interface DefaultTableProps {
  headers: TableHead[];
  rows: TableRow[];
  onSelect?: (row: any, index: number) => void;
  selectedRowIndex?: number;
  maxHight?: string;
}

const Table = (props: DefaultTableProps) => {
  const { headers, rows, onSelect, selectedRowIndex, maxHight } = props;

  const maximumHight = maxHight || 'max-h-[70%]';

  return (
    <div
      className={`flex ${maximumHight} justify-center overflow-auto rounded-lg border-2 dark:border-duoGrayDark-lighter`}
    >
      <table className='divide-y-2 divide-duoGray-default text-left dark:divide-duoBlueDark-text dark:divide-opacity-70 dark:bg-duoGrayDark-darkest 2xl:text-xl'>
        <thead className='uppercase text-duoGray-darkText dark:text-duoBlueDark-text'>
          <tr>
            {headers.map((header) => (
              <th
                key={header.key}
                className='h-12 cursor-default px-4 2xl:h-20 2xl:px-8'
              >
                <span className='flex items-center justify-start font-extrabold'>
                  {header.label}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className='divide-y-2 divide-duoGray-lighter text-duoGray-darker dark:divide-duoGrayDark-dark dark:text-duoGrayDark-lightest'>
          {rows.map((row, index) => {
            const isLast = index === rows.length - 1;
            const headersKeys = Object.values(headers.map((head) => head.key));
            return (
              <tr
                key={index}
                className={`hover:light:text-duoGray-darkest cursor-pointer font-bold hover:bg-duoGray-lighter dark:hover:bg-duoBlueDark-darkest ${
                  selectedRowIndex === index
                    ? 'light:text-duoGray-darkest bg-duoGray-lighter dark:bg-duoBlueDark-darkest'
                    : ''
                } `}
                onClick={() => {
                  onSelect ? onSelect(rows[index], index) : null;
                }}
              >
                {headers.map(({ key }) => (
                  <td
                    key={key}
                    className={`h-16 px-4 text-center ${
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
