'use client';

import { onCreateUser } from '../api';
import { ErrorLabel, UploadImage } from '@/features';
import { FormState, SubmitButton } from '@/shared';
import Link from 'next/link';
import { RedirectType, redirect } from 'next/navigation';
import { FC, useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';

const SignupFields: FC<{ state: FormState }> = ({ state }) => {
    const { pending } = useFormStatus();

    return (
        <>
            <input
                name="firstName"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                type="text"
                maxLength={40}
                placeholder="Enter your first name"
                required
                disabled={pending}
            />
            <ErrorLabel error={state.firstName} />
            <input
                name="lastName"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                type="text"
                maxLength={40}
                placeholder="Enter your last name"
                required
                disabled={pending}
            />
            <ErrorLabel error={state.lastName} />
            <input
                name="email"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                type="email"
                placeholder="Enter your email"
                required
                disabled={pending}
            />
            <ErrorLabel error={state.email} />
            <input
                name="password"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                type="password"
                placeholder="Come up with the password"
                required
                disabled={pending}
            />
            <ErrorLabel error={state.password} />
            <input
                name="passwordConfirm"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                type="password"
                placeholder="Confirm your password"
                required
                disabled={pending}
            />
            <ErrorLabel error={state.passwordConfirm} />
            <UploadImage />
            <textarea
                name="bio"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 resize-none"
                placeholder="Enter your bio (optional)"
                maxLength={255}
                disabled={pending}
            />
            <ErrorLabel error={state.bio} />
        </>
    );
};

export const SignupForm = () => {
    const [state, action] = useFormState<FormState, FormData>(onCreateUser, {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        passwordConfirm: '',
        avatar: '',
        bio: '',
    });

    useEffect(() => {
        if (state.status === 201) {
            alert('Success!');
            redirect('/signin', RedirectType.push);
        }
    }, [state]);

    return (
        <form className="flex flex-col gap-4 w-96" action={action}>
            <SignupFields state={state} />
            <div className="flex justify-between items-center">
                <SubmitButton>Sign up</SubmitButton>
                <Link href="/signin">
                    <button type="button">Sign in instead...</button>
                </Link>
            </div>
        </form>
    );
};
