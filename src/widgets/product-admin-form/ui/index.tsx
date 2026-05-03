'use client';

import { onAdminSaveProduct } from '../api';
import { ErrorLabel, UploadImage } from '@/features';
import {
    FormState,
    SubmitButton,
    dangerButtonClassName,
    inputClassName,
    useModalContext,
} from '@/shared';
import { Category, Product } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { FC, useEffect, useState, useActionState } from 'react';
import { useFormStatus } from 'react-dom';

const ProductAdminFields: FC<{
    product?: Product;
    state: FormState;
}> = ({ product, state }) => {
    const { pending } = useFormStatus();
    const close = useModalContext();
    const [defaultImage, setDefaultImage] = useState('');
    const [categories, setCategories] = useState<Omit<Category, 'imageUrl'>[]>(
        [],
    );
    const [category, setCategory] = useState<Omit<Category, 'imageUrl'> | null>(
        null,
    );

    useEffect(() => {
        if (state.status === 200) {
            alert('Success!');
            close?.();
        }
    }, [state, close]);

    useEffect(() => {
        if (product) {
            fetch(`/api/product/${product.id}/image`)
                .then((res) => res.json())
                .then((image) => {
                    setDefaultImage(image.url);
                })
                .catch((err) => console.error(err));
        }
    }, [product]);

    useEffect(() => {
        fetch('/api/category')
            .then((res) => res.json())
            .then((categories: Omit<Category, 'imageUrl'>[]) => {
                setCategories(categories);
                setCategory(
                    categories.find((c) => c.id === product?.categoryId) ??
                        null,
                );
            })
            .catch((err) => console.error(err));
    }, []);

    return (
        <div className="grid gap-4 my-4 py-4 grid-cols-2 border-y rounded-t dark:border-gray-600">
            <div className="col-span-2">
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
                    defaultValue={product?.title}
                    disabled={pending}
                />
                <ErrorLabel error={state.title} />
            </div>
            <div className="col-span-2">
                <label
                    htmlFor="category"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                    Category
                </label>
                <select
                    name="category"
                    id="category"
                    className={inputClassName}
                    value={category?.id}
                    onChange={(e) =>
                        setCategory(
                            categories.find((c) => c.id === e.target.value) ||
                                null,
                        )
                    }
                    disabled={pending}
                >
                    <option value={undefined}>No category</option>
                    {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                            {c.title}
                        </option>
                    ))}
                </select>
                <ErrorLabel error={state.categoryId} />
            </div>
            <div className="col-span-2">
                <label
                    htmlFor="description"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                    Description
                </label>
                <textarea
                    name="description"
                    id="description"
                    className={inputClassName}
                    placeholder="Type the description"
                    required
                    defaultValue={product?.description}
                    disabled={pending}
                />
                <ErrorLabel error={state.description} />
            </div>
            <div className="col-span-2">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Image
                </label>
                <UploadImage name="image" value={defaultImage} />
            </div>
            <div className="col-span-1">
                <label
                    htmlFor="price"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                    Price
                </label>
                <input
                    type="number"
                    name="price"
                    id="price"
                    className={inputClassName}
                    placeholder="Type the price"
                    required
                    defaultValue={product?.price}
                    disabled={pending}
                    min={1}
                />
                <ErrorLabel error={state.price} />
            </div>
            <div className="col-span-1">
                <label
                    htmlFor="count"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                    Count
                </label>
                <input
                    type="number"
                    name="count"
                    id="count"
                    className={inputClassName}
                    placeholder="Type the count"
                    required
                    defaultValue={product?.count}
                    disabled={pending}
                    min={0}
                />
                <ErrorLabel error={state.count} />
            </div>
        </div>
    );
};

export const ProductAdminForm: FC<{ product?: Product }> = ({ product }) => {
    const [state, action] = useActionState<FormState, FormData>(
        onAdminSaveProduct,
        {
            title: '',
            category: '',
            description: '',
            price: '',
            count: '',
        },
    );

    const close = useModalContext();

    const router = useRouter();

    const openDeleteConfirm = () => {
        const isSure = confirm('Are you sure you want to delete this product?');
        if (isSure && product?.id && close) {
            fetch(`/api/product/${product.id}`, {
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
            {product && <input type="hidden" name="id" value={product.id} />}
            <ProductAdminFields product={product} state={state} />
            <div className="flex justify-between">
                <SubmitButton>Save Product</SubmitButton>
                {product?.id && (
                    <button
                        type="button"
                        className={dangerButtonClassName}
                        onClick={openDeleteConfirm}
                    >
                        Delete Product
                    </button>
                )}
            </div>
        </form>
    );
};
