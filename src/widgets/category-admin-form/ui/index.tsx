'use client';

import { onAdminSaveCategory } from '../api';
import { ErrorLabel, UploadImage } from '@/features';
import {
    FormState,
    SubmitButton,
    inputClassName,
    useModalContext,
} from '@/shared';
import { Category } from '@prisma/client';
import { FC, useEffect, useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';

const CategoryAdminFields: FC<{
    category?: Category;
    state: FormState;
}> = ({ category, state }) => {
    const { pending } = useFormStatus();
    const close = useModalContext();
    const [defaultImage, setDefaultImage] = useState('');

    useEffect(() => {
        if (state.status === 200) {
            alert('Success!');
            close?.();
        }
    }, [state, close]);

    useEffect(() => {
        if (category) {
            fetch(`/api/category/${category.id}/image`)
                .then((res) => res.json())
                .then((image) => {
                    setDefaultImage(image.url)
                })
                .catch((err) => console.error(err));
        }
    }, [category]);

    return (
        <div className="grid gap-4 my-4 py-4 border-y rounded-t dark:border-gray-600">
            <div>
                <label
                    htmlFor="title"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                    Title
                </label>
                <input
                    type="text"
                    name="title"
                    id="title"
                    className={inputClassName}
                    placeholder="Type the title"
                    required
                    defaultValue={category?.title}
                    disabled={pending}
                />
                <ErrorLabel error={state.title} />
            </div>
            <div>
                <label
                    htmlFor="title"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                    Image
                </label>
                <UploadImage name="image" value={defaultImage} />
            </div>
        </div>
    );
};

export const CategoryAdminForm: FC<{ category?: Category }> = ({
    category,
}) => {
    const [state, action] = useFormState<FormState, FormData>(
        onAdminSaveCategory,
        {
            title: '',
        },
    );

    return (
        <form action={action} className="px-4 pb-4 md:px-5 md:pb-5">
            {category && <input type="hidden" name="id" value={category.id} />}
            <CategoryAdminFields category={category} state={state} />
            <SubmitButton>Save Category</SubmitButton>
        </form>
    );
};
