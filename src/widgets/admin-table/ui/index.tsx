import { FC, ReactNode } from 'react';

export const AdminTable: FC<{
    children: ReactNode;
    headers: string[];
    length: number;
    placeholder: string;
}> = ({ children, headers, length, placeholder }) => {
    return (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left rtl:text-right text-gray-400">
                <thead className="text-xs uppercase bg-gray-700 text-gray-400">
                    <tr>
                        {headers.map((h) => (
                            <th key={h} scope="col" className="px-6 py-3">
                                {h}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {length === 0 ? (
                        <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                            <th
                                scope="row"
                                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                colSpan={headers.length}
                            >
                                {placeholder}
                            </th>
                        </tr>
                    ) : (
                        children
                    )}
                </tbody>
            </table>
        </div>
    );
};
