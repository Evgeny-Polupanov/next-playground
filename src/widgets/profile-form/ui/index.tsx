'use client';

import { onSaveUser } from '../api';
import { ErrorLabel, UploadImage } from '@/features';
import {
    FormState,
    SubmitButton,
    dangerButtonClassName,
    inputClassName,
    primaryButtonClassName,
} from '@/shared';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FC, useEffect, useRef, useActionState } from 'react';
import { useFormStatus } from 'react-dom';

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
                className={inputClassName}
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
                className={inputClassName}
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
                className={inputClassName}
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
                className={inputClassName}
                type="password"
                placeholder="Enter your current password"
                disabled={pending}
                ref={passwordRef}
            />
            <ErrorLabel error={state.password} />
            <input
                name="newPassword"
                className={inputClassName}
                type="password"
                placeholder="Come up with a new password"
                disabled={pending}
                ref={newPasswordRef}
            />
            <ErrorLabel error={state.newPassword} />
            <input
                name="newPasswordConfirm"
                className={inputClassName}
                type="password"
                placeholder="Confirm your new password"
                disabled={pending}
                ref={newPasswordConfirmRef}
            />
            <ErrorLabel error={state.newPasswordConfirm} />
            <label>Bio</label>
            <textarea
                name="bio"
                className={inputClassName}
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
    const [state, action] = useActionState<FormState, FormData>(onSaveUser, {
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
                    className={primaryButtonClassName}
                    onClick={logout}
                >
                    Logout
                </button>
                <button
                    type="button"
                    className={dangerButtonClassName}
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
