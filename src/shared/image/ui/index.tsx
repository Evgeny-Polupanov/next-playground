import NextImage from 'next/image';
import { FC } from 'react';

export const Image: FC<{ image: string | ArrayBuffer }> = ({ image }) => {
    return (
        <div className="relative w-48 h-48 my-4">
            {image && (
                <NextImage
                    src={image as string}
                    alt="image"
                    fill
                    className="object-cover"
                />
            )}
        </div>
    );
};
