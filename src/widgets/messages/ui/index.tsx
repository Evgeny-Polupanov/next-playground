'use client';

import {
    UserWithMessages,
    inputClassName,
    primaryButtonClassName,
} from '@/shared';
import classNames from 'classnames';
import { FC, useState } from 'react';

export const Messages: FC<{ users: UserWithMessages[] }> = ({ users }) => {
    const [chat, setChat] = useState<string | null>(null);

    return (
        <div className="flex flex-col gap-4 p-4">
            <h1 className="text-5xl mb-4">Messages</h1>
            <section className="flex gap-4">
                <ul
                    className="overflow-y-auto"
                    style={{ width: 320, height: 'calc(70vh + 62px)' }}
                    onClick={() => setChat(null)}
                >
                    {users.map((user) => (
                        <li
                            key={user.id}
                            className={classNames(
                                'odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 whitespace-nowrap overflow-hidden text-ellipsis h-10 flex items-center p-2 rounded cursor-pointer',
                                {
                                    invert: user.id === chat,
                                },
                            )}
                            onClick={(e) => {
                                e.stopPropagation();
                                setChat(user.id);
                            }}
                        >
                            {user.email}
                        </li>
                    ))}
                </ul>
                <div className="flex-grow">
                    {chat ? (
                        <div className="flex flex-col justify-between">
                            <ul style={{ height: '70vh' }}>
                                {users
                                    .find((u) => u.id === chat)
                                    ?.messages.map((m) => (
                                        <li key={m.id}>{m.content}</li>
                                    ))}
                            </ul>
                            <form className="flex">
                                <textarea
                                    className={inputClassName}
                                    placeholder="Your message..."
                                />
                                <button
                                    className={primaryButtonClassName}
                                    style={{ width: 100 }}
                                    type="button"
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
