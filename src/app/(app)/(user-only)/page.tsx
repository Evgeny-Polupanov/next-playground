import { Image, getSession } from '@/shared';
import { redirect } from 'next/navigation';
import { s3Client } from '~/lib/file-management';
import prisma from '~/lib/prisma';

const getData = async () => {
    const session = await getSession();

    const user = await prisma.user.findFirst({
        where: { id: session?.user.id },
    });

    if (!user) {
        redirect('/signin');
    }

    const { firstName, avatarUrl, balance } = user;

    const avatar = avatarUrl
        ? await s3Client.presignedGetObject('avatars', avatarUrl)
        : '';

    return { firstName, avatar, balance };
};

export default async function Home() {
    const { firstName, avatar, balance } = await getData();

    return (
        <div className="flex flex-col items-center justify-between p-24 flex-grow">
            <div className="w-full max-w-5xl items-end justify-between font-mono text-sm flex">
                <div className="w-56">
                    <div className="h-32 mb-4 border-gray-300 p-4 rounded-xl border bg-zinc-800/30">
                        <code className="font-mono font-bold flex flex-col items-center justify-between h-full">
                            <p className="text-center text-4xl">$</p>
                            <p className="text-center text-2xl">{balance}</p>
                        </code>
                    </div>
                    <div className="p-4 border-gray-300 bg-zinc-800/30 rounded-xl border">
                        Hello,&nbsp;
                        <code className="font-mono font-bold">{firstName}</code>
                    </div>
                </div>
                <div className="h-48 flex items-end justify-center">
                    <Image image={avatar || '/avatar.jpg'} alt="avatar" />
                </div>
            </div>
        </div>
    );
}
