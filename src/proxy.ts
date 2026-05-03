import { getSession } from './shared';
import { NextRequest } from 'next/server';

export default async function proxy(request: NextRequest) {
    const session = await getSession(true);

    if (
        !session &&
        !['/signin', '/signup'].includes(request.nextUrl.pathname)
    ) {
        return Response.redirect(new URL('/signin', request.url));
    }
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
