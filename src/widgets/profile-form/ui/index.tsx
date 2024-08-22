'use client';

import { onSaveUser } from '../api';
import { ErrorLabel, UploadImage } from '@/features';
import { FormState, SubmitButton } from '@/shared';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FC, useEffect, useRef } from 'react';
import { useFormState, useFormStatus } from 'react-dom';

interface UserFields {
    firstName: string;
    lastName: string;
    email: string;
    avatar: string;
    bio: string;
}

const ProfileFields: FC<{ state: FormState; user: UserFields }> = ({
    state,
    user,
}) => {
    const { pending } = useFormStatus();

    const passwordRef = useRef<HTMLInputElement | null>(null);
    const newPasswordRef = useRef<HTMLInputElement | null>(null);
    const newPasswordConfirmRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (
            state.status === 200 &&
            passwordRef.current &&
            newPasswordRef.current &&
            newPasswordConfirmRef.current
        ) {
            passwordRef.current.value = '';
            newPasswordRef.current.value = '';
            newPasswordConfirmRef.current.value = '';
        }
    }, [state]);

    return (
        <div className="w-96 flex flex-col gap-4">
            <label>Personal data</label>
            <input
                name="firstName"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 resize-none"
                type="text"
                maxLength={40}
                placeholder="Enter your first name"
                required
                disabled={pending}
                defaultValue={user.firstName}
            />
            <ErrorLabel error={state.firstName} />
            <input
                name="lastName"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 resize-none"
                type="text"
                maxLength={40}
                placeholder="Enter your last name"
                defaultValue={user.lastName}
                required
                disabled={pending}
            />
            <ErrorLabel error={state.lastName} />
            <input
                name="email"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 resize-none"
                type="email"
                placeholder="Enter your email"
                defaultValue={user.email}
                required
                disabled={pending}
            />
            <ErrorLabel error={state.email} />
            <label>Password</label>
            <input
                name="password"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 resize-none"
                type="password"
                placeholder="Enter your current password"
                disabled={pending}
                ref={passwordRef}
            />
            <ErrorLabel error={state.password} />
            <input
                name="newPassword"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 resize-none"
                type="password"
                placeholder="Come up with a new password"
                disabled={pending}
                ref={newPasswordRef}
            />
            <ErrorLabel error={state.newPassword} />
            <input
                name="newPasswordConfirm"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 resize-none"
                type="password"
                placeholder="Confirm your new password"
                disabled={pending}
                ref={newPasswordConfirmRef}
            />
            <ErrorLabel error={state.newPasswordConfirm} />
            <label>Bio</label>
            <textarea
                name="bio"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 resize-none"
                placeholder="Enter your bio (optional)"
                maxLength={255}
                disabled={pending}
                defaultValue={user.bio}
            />
            <ErrorLabel error={state.bio} />
        </div>
    );
};

export const ProfileForm: FC<{
    user: UserFields;
}> = ({ user }) => {
    const [state, action] = useFormState<FormState, FormData>(onSaveUser, {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        newPassword: '',
        newPasswordConfirm: '',
        bio: '',
    });

    useEffect(() => {
        if (state.status === 200) {
            alert('Success!');
        }
    }, [state]);

    const router = useRouter();

    const logout = () => {
        if (confirm('Do you really want to logout?')) {
            fetch('/api/logout', {
                method: 'POST',
            })
                .then((res) => {
                    if (res.status === 200) {
                        return router.replace('/signin');
                    }
                })
                .catch((e) => console.error(e));
        }
    };

    const deleteProfile = () => {
        if (confirm('Do you really want to delete your profile?')) {
            fetch('/api/user', {
                method: 'DELETE',
            })
                .then((res) => {
                    if (res.status === 200) {
                        return router.replace('/signin');
                    }
                })
                .catch((e) => console.error(e));
        }
    };

    return (
        <form
            action={action}
            className="flex flex-col items-center justify-between p-24 flex-grow"
        >
            <div className="flex justify-end items-center gap-4 mb-4 max-w-5xl w-full">
                <button
                    type="button"
                    className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    onClick={logout}
                >
                    Logout
                </button>
                <button
                    type="button"
                    className="text-white inline-flex items-center bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                    onClick={deleteProfile}
                >
                    Delete profile
                </button>
            </div>
            <div className="z-10 w-full max-w-5xl items-start justify-between font-mono text-sm lg:flex">
                <ProfileFields state={state} user={user} />
                <div>
                    <label className="mb-4 block">Avatar</label>
                    <UploadImage defaultValue={user.avatar} name="avatar" />
                </div>
            </div>
            <div className="flex justify-between items-center mt-4 max-w-5xl w-full">
                <SubmitButton>Save profile</SubmitButton>
                <Link href="/">Back to main page</Link>
            </div>
        </form>
    );
};
