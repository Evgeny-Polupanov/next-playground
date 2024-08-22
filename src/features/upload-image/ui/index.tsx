'use client';

import { Image } from '@/shared';
import { ChangeEventHandler, FC, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';

export const UploadImage: FC<{ defaultValue?: string; name?: string }> = ({
    defaultValue,
    name = 'image',
}) => {
    const imageRef = useRef<HTMLInputElement | null>(null);
    const isDirtyRef = useRef<HTMLInputElement | null>(null);

    const [image, setImage] = useState<string | ArrayBuffer>(
        defaultValue ?? '',
    );

    const { pending } = useFormStatus();

    const onChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        const image = e.target.files?.[0];

        if (!image) {
            setImage('');
            return;
        }

        const fileReader = new FileReader();
        fileReader.onload = () => {
            setImage(fileReader.result ?? '');
        };
        fileReader.readAsDataURL(image);
    };

    const toggleImage = () => {
        if (image && imageRef.current) {
            imageRef.current.value = '';
            setImage('');
        } else {
            imageRef.current?.click();
        }
        isDirtyRef.current && (isDirtyRef.current.value = 'true');
    };

    return (
        <div className="flex gap-4 items-start">
            <button
                type="button"
                onClick={toggleImage}
                disabled={pending}
                className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
                {image ? 'Remove image' : 'Upload image'}
            </button>
            <input
                type="file"
                hidden
                name={name}
                accept="image/png, image/jpg"
                ref={imageRef}
                onChange={onChange}
            />
            <input type="hidden" name="isImageDirty" ref={isDirtyRef} />
            <Image image={image} alt="image" />
        </div>
    );
};
