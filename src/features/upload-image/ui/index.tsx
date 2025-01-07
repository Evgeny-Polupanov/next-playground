'use client';

import { Image, dangerButtonClassName, primaryButtonClassName } from '@/shared';
import { ChangeEventHandler, FC, useEffect, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';

export const UploadImage: FC<{
    defaultValue?: string | null;
    name?: string;
    value?: string | null;
}> = ({ defaultValue, name = 'image', value }) => {
    const imageRef = useRef<HTMLInputElement | null>(null);
    const isDirtyRef = useRef<HTMLInputElement | null>(null);

    const [image, setImage] = useState<string | ArrayBuffer>(
        defaultValue ?? '',
    );

    useEffect(() => {
        setImage(value ?? defaultValue ?? '');
    }, [value, defaultValue]);

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
                className={
                    image ? dangerButtonClassName : primaryButtonClassName
                }
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
