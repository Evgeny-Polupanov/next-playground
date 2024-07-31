'use client';

import { FC, ReactNode } from 'react';
import { useFormStatus } from 'react-dom';

export const SubmitButton: FC<{ children: ReactNode }> = ({ children }) => {
    const { pending } = useFormStatus();

    return (
        <button type="submit" disabled={pending} className="border-2 p-2">
            {children}
        </button>
    );
};
