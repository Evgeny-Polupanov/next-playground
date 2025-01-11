import { UserWithMessages, getSession } from '@/shared';
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
        orderBy: { datetime: 'desc' },
    });

    return {
        users: users.map((u) => ({
            id: u.id,
            email: u.email,
            messages: messages.reduce<UserWithMessages['messages']>(
                (messages, m) => {
                    if ([m.senderId, m.receiverId].includes(u.id)) {
                        messages.push({
                            id: m.id,
                            content: m.content,
                            datetime: m.datetime,
                        });
                    }
                    return messages;
                },
                [],
            ),
        })),
    };
};

export default async function MessagesPage() {
    const { users } = await getData();

    return <Messages users={users} />;
}
