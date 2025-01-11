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
        where: { OR: [{ senderId: user?.id }, { receiverId: user?.id }] },
        orderBy: { datetime: 'asc' },
    });

    return {
        users: users.map((u) => ({
            id: u.id,
            email: u.email,
            messages: (user?.id === u.id
                ? messages.filter((m) => m.senderId === m.receiverId)
                : messages.filter((m) =>
                      [m.senderId, m.receiverId].includes(u.id),
                  )
            ).map((m) => ({
                id: m.id,
                content: m.content,
                datetime: m.datetime,
                isOwn: m.senderId === user?.id,
            })),
        })),
    };
};

export default async function MessagesPage() {
    const { users } = await getData();

    return <Messages users={users} />;
}
