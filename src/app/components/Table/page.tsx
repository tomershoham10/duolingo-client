import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

type TableProps<T> = {
    headers: string[];
    data: T[];
};

type TableRowProps<T> = {
    item: T;
    keys: (keyof T)[];
};

const TableRow = <T,>({ item, keys }: TableRowProps<T>) => (
    <tr className="hover:bg-[#F7F7F7]">
        {keys.map((key, index) => (
            <td
                key={index}
                className={
                    index === 0 ? "pl-6 pr-36 py-2 h-16" : "pr-16 py-2 h-16"
                }
            >
                {String(item[key])}
            </td>
        ))}
    </tr>
);

const Table = <T,>({ headers, data }: TableProps<T>) => {
    const keys = headers as (keyof T)[];

    return (
        <div className="flex flex-col  border-2 border-[#E5E5E5] w-fit rounded-md mt-5 pb-1">
            <div className="overflow-x-auto mr-1">
                <div className="max-h-[70vh] max-w-[60vw] overflow-y-auto p-1.5 inline-block align-middle">
                    <table className="rounded-lg divide-y-2 divide-[#E5E5E5]">
                        <thead className="text-[#9F9F9F]">
                            <tr>
                                {headers.map((header, index) => (
                                    <th
                                        key={index}
                                        className={
                                            index === 0
                                                ? "uppercase pl-6 pr-36 py-2 h-12 cursor-pointer"
                                                : "uppercase pr-16 py-2 h-12 cursor-pointer"
                                        }
                                    >
                                        <span className="flex justify-start items-center">
                                            {header}
                                            <FontAwesomeIcon
                                                className="fa-xs fa-duotone ml-1"
                                                icon={faChevronDown}
                                            />
                                        </span>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y-2 divide-[#F4F4F4] text-[#8B8B8B]">
                            {data.map((item, index) => (
                                <TableRow<T>
                                    key={index}
                                    item={item}
                                    keys={keys}
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
