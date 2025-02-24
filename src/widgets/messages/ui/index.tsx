'use client';

import {
    UserWithMessages,
    inputClassName,
    primaryButtonClassName,
} from '@/shared';
import classNames from 'classnames';
import { useRouter } from 'next/navigation';
import { FC, FormEventHandler, useRef, useState } from 'react';

export const Messages: FC<{ users: UserWithMessages[] }> = ({ users }) => {
    const [chatee, setChatee] = useState<UserWithMessages | null>(null);
    const [message, setMessage] = useState('');
    const messageRef = useRef<HTMLTextAreaElement | null>(null);

    const router = useRouter();

    const sendMessage: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();

        if (!message || !chatee) {
            return;
        }

        fetch(`/api/message/${chatee.id}`, {
            method: 'POST',
            body: JSON.stringify({ message }),
        }).then(() => {
            setMessage('');
            messageRef.current?.focus();
            router.refresh();
        });
    };

    return (
        <div className="flex flex-col gap-4 p-4">
            <h1 className="text-5xl mb-4">Messages</h1>
            <section
                className="flex gap-4 w-full mx-auto"
                style={{ maxWidth: 1024 }}
            >
                <ul
                    className="overflow-y-auto"
                    style={{ width: 320, height: 'calc(70vh + 62px)' }}
                    onClick={() => setChatee(null)}
                >
                    {users.map((user) => (
                        <li
                            key={user.id}
                            className={classNames(
                                'odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 whitespace-nowrap overflow-hidden text-ellipsis h-10 flex items-center p-2 rounded cursor-pointer',
                                {
                                    invert: user.id === chatee?.id,
                                },
                            )}
                            onClick={(e) => {
                                e.stopPropagation();
                                setChatee(user);
                            }}
                        >
                            {user.email}
                        </li>
                    ))}
                </ul>
                <div className="flex-grow">
                    {chatee ? (
                        <div className="flex flex-col justify-between">
                            <ul style={{ height: '70vh' }}>
                                {chatee.messages.map((m) => (
                                    <li
                                        className={classNames({
                                            'text-right': m.isOwn,
                                        })}
                                        key={m.id}
                                    >
                                        {m.content}
                                    </li>
                                ))}
                            </ul>
                            <form className="flex" onSubmit={sendMessage}>
                                <textarea
                                    className={inputClassName}
                                    placeholder="Your message..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    ref={messageRef}
                                />
                                <button
                                    className={primaryButtonClassName}
                                    style={{ width: 100 }}
                                    type="submit"
                                >
                                    Send
                                </button>
                            </form>
                        </div>
                    ) : (
                        <p>No chat selected...</p>
                    )}
                </div>
            </section>
        </div>
    );
};
