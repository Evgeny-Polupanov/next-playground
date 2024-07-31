import { FC } from 'react';

export const ErrorLabel: FC<{ error?: string }> = ({ error }) => {
    if (!error) {
        return null;
    }

    return <p className="text-red-500">{error}</p>;
};
