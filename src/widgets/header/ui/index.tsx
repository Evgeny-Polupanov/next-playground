import Image from 'next/image';
import Link from 'next/link';
import { FC } from 'react';

export const Header: FC<{ avatar: string; isAdmin: boolean }> = ({
    avatar,
    isAdmin,
}) => {
    return (
        <header className="h-24 bg-zinc-800 flex items-center justify-between gap-4 px-8">
            <Link href={isAdmin ? '/admin' : '/'}>
                <Image
                    src="/logo.png"
                    width={75}
                    height={75}
                    alt="Logo"
                    priority
                />
            </Link>
            <Link href="/messages">Messages</Link>
            <Link href="/profile" className="ml-auto">
                <Image
                    src={avatar || '/avatar.jpg'}
                    width={75}
                    height={75}
                    alt="Avatar"
                    className="object-contain"
                    sizes="auto, auto"
                    priority
                />
            </Link>
        </header>
    );
};
