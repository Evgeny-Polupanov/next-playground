import Image from 'next/image';
import Link from 'next/link';
import { FC } from 'react';

export const Header: FC<{ avatar: string }> = ({ avatar }) => {
    return (
        <header className="h-24 bg-zinc-800 flex items-center justify-between px-8">
            <Image src="/logo.png" width={75} height={75} alt="Logo" priority />
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
