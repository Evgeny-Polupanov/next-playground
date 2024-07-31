'use client';

import { Image } from '@/shared';
import { ChangeEventHandler, FC, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';

export const UploadImage: FC<{ defaultValue?: string }> = ({
    defaultValue,
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
        if (image && imageRef.current?.value) {
            imageRef.current.value = '';
            setImage('');
        } else {
            imageRef.current?.click();
        }
        isDirtyRef.current?.value && (isDirtyRef.current.value = 'true');
    };

    return (
        <div className="flex gap-4 items-start">
            <button
                type="button"
                onClick={toggleImage}
                disabled={pending}
                className="mt-4 border-2 p-2"
            >
                {image ? 'Remove image' : 'Upload image'}
            </button>
            <input
                type="file"
                hidden
                name="image"
                accept="image/png, image/jpg"
                ref={imageRef}
                onChange={onChange}
            />
            <input type="hidden" name="isImageDirty" ref={isDirtyRef} />
            <Image image={image} />
        </div>
    );
};
