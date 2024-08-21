import { FC, ReactNode } from 'react';

export const AdminTable: FC<{ children: ReactNode; headers: string[] }> = ({
    children,
    headers,
}) => {
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
                <tbody>{children}</tbody>
            </table>
        </div>
    );
};
