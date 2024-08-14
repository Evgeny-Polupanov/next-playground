import NextImage from 'next/image';
import { FC } from 'react';

export const Image: FC<{ image: string | ArrayBuffer; alt?: string }> = ({
    image,
    alt = 'image',
}) => {
    return (
        <div className="relative w-48 h-48 my-4">
            {image && (
                <NextImage
                    src={image as string}
                    alt={alt}
                    fill
                    sizes="auto, auto"
                    className="object-contain w-auto h-auto"
                />
            )}
        </div>
    );
};
