'use client';

import { onLogin } from '../api';
import { ErrorLabel } from '@/features';
import { FormState, SubmitButton } from '@/shared';
import Link from 'next/link';
import { RedirectType, redirect } from 'next/navigation';
import { FC, useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';

const SigninFields: FC<{ state: FormState }> = ({ state }) => {
    const { pending } = useFormStatus();

    return (
        <>
            <input
                name="email"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 resize-none"
                type="email"
                placeholder="Enter your email"
                required
                disabled={pending}
            />
            <input
                name="password"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 resize-none"
                type="password"
                placeholder="Enter your password"
                required
                disabled={pending}
            />
            <ErrorLabel error={state.login} />
        </>
    );
};

export const SigninForm = () => {
    const [state, action] = useFormState<FormState, FormData>(onLogin, {
        login: '',
    });

    useEffect(() => {
        if (state.status === 200) {
            alert('Success!');
            redirect('/', RedirectType.push);
        }
    }, [state]);

    return (
        <form className="flex flex-col gap-4 w-96" action={action}>
            <SigninFields state={state} />
            <div className="flex justify-between items-center">
                <SubmitButton>Sign in</SubmitButton>
                <Link href="/signup">
                    <button type="button">Sign up</button>
                </Link>
            </div>
        </form>
    );
};
