import Image from 'next/image';
import Link from 'next/link';
import { FC } from 'react';

export const Header: FC<{ avatar: string }> = ({ avatar }) => {
    return (
        <header className="h-24 bg-zinc-800 flex items-center justify-between gap-4 px-8">
            <Link href="/">
                <Image
                    src="/logo.png"
                    width={75}
                    height={75}
                    alt="Logo"
                    priority
                />
            </Link>
            <div />
            <Link href="/profile">
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
