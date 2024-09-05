'use client';

import { onAdminSaveCategory } from '../api';
import { ErrorLabel } from '@/features';
import {
    FormState,
    SubmitButton,
    inputClassName,
    useModalContext,
} from '@/shared';
import { Category } from '@prisma/client';
import { FC, useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';

const CategoryAdminFields: FC<{
    category: Category;
    state: FormState;
}> = ({ category, state }) => {
    const { pending } = useFormStatus();
    const close = useModalContext();

    useEffect(() => {
        if (state.status === 200) {
            alert('Success!');
            close?.();
        }
    }, [state, close]);

    return (
        <div className="grid gap-4 my-4 py-4 grid-cols-2 border-y rounded-t dark:border-gray-600">
            {/* <div className="col-span-1">
                <label
                    htmlFor="firstName"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                    First name
                </label>
                <input
                    type="text"
                    name="firstName"
                    id="firstName"
                    className={inputClassName}
                    placeholder="Type the first name"
                    required
                    defaultValue={category.firstName}
                    disabled={pending}
                />
                <ErrorLabel error={state.firstName} />
            </div>
            <div className="col-span-1">
                <label
                    htmlFor="lastName"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                    Last name
                </label>
                <input
                    type="text"
                    name="lastName"
                    id="lastName"
                    className={inputClassName}
                    placeholder="Type the last name"
                    required
                    defaultValue={user.lastName}
                    disabled={pending}
                />
                <ErrorLabel error={state.lastName} />
            </div>
            <div className="col-span-2">
                <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                    Email
                </label>
                <input
                    type="email"
                    name="email"
                    id="email"
                    className={inputClassName}
                    placeholder="Type the email"
                    required
                    defaultValue={user.email}
                    disabled={pending}
                />
                <ErrorLabel error={state.email} />
            </div>
            <div className="col-span-2">
                <label
                    htmlFor="bio"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                    Bio
                </label>
                <textarea
                    name="bio"
                    id="bio"
                    className={inputClassName}
                    placeholder="Type the bio"
                    defaultValue={user.bio}
                    disabled={pending}
                />
                <ErrorLabel error={state.bio} />
            </div>
            <div className="col-span-1">
                <label
                    htmlFor="balance"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                    Balance
                </label>
                <input
                    type="number"
                    name="balance"
                    id="balance"
                    className={inputClassName}
                    placeholder="Type the balance"
                    required
                    defaultValue={user.balance}
                    disabled={pending}
                    min={0}
                />
                <ErrorLabel error={state.balance} />
            </div>
            <div className="col-span-1">
                <div className="flex items-center ps-4 border border-gray-300 rounded dark:border-gray-500 h-full">
                    <input
                        type="checkbox"
                        id="isAdmin"
                        name="isAdmin"
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        defaultChecked={user.isAdmin}
                        disabled={pending}
                    />
                    <label
                        htmlFor="isAdmin"
                        className="w-full py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                        Is Admin
                    </label>
                </div>
            </div> */}
        </div>
    );
};

export const CategoryAdminForm: FC<{ category: Category }> = ({ category }) => {
    const [state, action] = useFormState<FormState, FormData>(
        onAdminSaveCategory,
        {
            firstName: '',
            lastName: '',
            email: '',
            bio: '',
            balance: '',
        },
    );

    return (
        <form action={action} className="px-4 pb-4 md:px-5 md:pb-5">
            <input type="hidden" name="id" value={category.id} />
            <CategoryAdminFields category={category} state={state} />
            <SubmitButton>Save Category</SubmitButton>
        </form>
    );
};
