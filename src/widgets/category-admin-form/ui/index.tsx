'use client';

import { onAdminSaveCategory } from '../api';
import { ErrorLabel, UploadImage } from '@/features';
import {
    FormState,
    SubmitButton,
    dangerButtonClassName,
    inputClassName,
    useModalContext,
} from '@/shared';
import { Category } from '@prisma/client';
import { useRouter } from 'next/navigation';
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
                    setDefaultImage(image.url);
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
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
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

    const close = useModalContext();

    const router = useRouter();

    const openDeleteConfirm = () => {
        const isSure = confirm(
            'Are you sure you want to delete this category?',
        );
        if (isSure && category?.id && close) {
            fetch(`/api/category/${category.id}`, {
                method: 'DELETE',
            })
                .then((res) => {
                    if (res.status === 200) {
                        close();
                        router.refresh();
                    }
                })
                .catch((e) => console.error(e));
        }
    };

    return (
        <form action={action} className="px-4 pb-4 md:px-5 md:pb-5">
            {category && <input type="hidden" name="id" value={category.id} />}
            <CategoryAdminFields category={category} state={state} />
            <div className="flex justify-between">
                <SubmitButton>Save Category</SubmitButton>
                {category?.id && (
                    <button
                        type="button"
                        className={dangerButtonClassName}
                        onClick={openDeleteConfirm}
                    >
                        Delete Category
                    </button>
                )}
            </div>
        </form>
    );
};
