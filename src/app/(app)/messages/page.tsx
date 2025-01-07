import { getSession } from '@/shared';
import { Messages } from '@/widgets';
import prisma from '~/lib/prisma';

const getData = async () => {
    const session = await getSession();

    const user = await prisma.user.findFirst({
        where: { id: session?.user.id },
    });

    const users = await prisma.user.findMany();

    const messages = await prisma.message.findMany({
        where: { senderId: user?.id, receiverId: user?.id },
        orderBy: { datetime: 'desc' },
    });

    return {
        users: users.map((u) => ({
            id: u.id,
            email: u.email,
            messages: messages
                .filter((m) => [m.senderId, m.receiverId].includes(u.id))
                .map((m) => ({
                    id: m.id,
                    content: m.content,
                    datetime: m.datetime,
                })),
        })),
    };
};

export default async function MessagesPage() {
    const { users } = await getData();

    return <Messages users={users} />;
}
