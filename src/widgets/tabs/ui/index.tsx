'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FC } from 'react';

export const Tabs: FC<{ tabs: { url: string; label: string }[] }> = ({
    tabs,
}) => {
    const pathname = usePathname();

    return (
        <div className="text-sm font-medium text-center border-b text-gray-400 border-gray-700 mb-4">
            <ul className="flex flex-wrap -mb-px">
                {tabs.map((t) => (
                    <li className="me-2" key={t.url}>
                        <Link
                            href={t.url}
                            className={`inline-block p-4 border-b-2 rounded-t-lg ${
                                pathname === t.url
                                    ? 'text-blue-600 border-blue-600 active dark:text-blue-500 dark:border-blue-500'
                                    : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
                            }`}
                        >
                            {t.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};
