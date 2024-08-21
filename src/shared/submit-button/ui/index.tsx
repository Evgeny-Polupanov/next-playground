'use client';

import { FC, ReactNode } from 'react';
import { useFormStatus } from 'react-dom';

export const SubmitButton: FC<{ children: ReactNode }> = ({ children }) => {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
            {children}
        </button>
    );
};
