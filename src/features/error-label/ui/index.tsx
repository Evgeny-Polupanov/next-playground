import { FC } from 'react';

export const ErrorLabel: FC<{ error?: string | number }> = ({ error }) => {
    if (!error) {
        return null;
    }

    return <p className="text-red-500">{error}</p>;
};
