'use client';

import { UserWithMessages } from '@/shared';
import { FC, useState } from 'react';

export const Messages: FC<{ users: UserWithMessages[] }> = ({ users }) => {
    const [chat, setChat] = useState<string | null>(null);

    return (
        <div className="flex flex-col gap-4 p-4">
            <h1 className="text-5xl mb-4">Messages</h1>
            <section className="flex gap-4">
                <ul>
                    {users.map((user) => (
                        <li
                            key={user.id}
                            className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
                            onClick={() => setChat(user.id)}
                        >
                            {user.email}
                        </li>
                    ))}
                </ul>
                <div>
                    {chat && (
                        <ul>
                            {users
                                .find((u) => u.id === chat)
                                ?.messages.map((m) => (
                                    <li key={m.id}>{m.content}</li>
                                ))}
                        </ul>
                    )}
                </div>
            </section>
        </div>
    );
};
