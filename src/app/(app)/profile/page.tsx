import { getSession } from '@/shared';
import { ProfileForm } from '@/widgets';
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

    const { firstName, lastName, email, avatarUrl, bio, balance } = user;

    const avatar = avatarUrl
        ? await s3Client.presignedGetObject('avatars', avatarUrl)
        : '';

    return { firstName, lastName, email, avatar, bio, balance };
};

export default async function Profile() {
    const currentUser = await getData();

    return <ProfileForm user={currentUser} />;
}
