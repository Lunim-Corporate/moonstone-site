// Next
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
// Lib
import safeRedirectPath from './_lib/safeRedirectPath';
import verifyToken from './_lib/verifyToken';
// Constants
import { COOKIE_NAME, COOKIE_SECRET } from './_constants/app';

export default function proxy(request: NextRequest) {
	if (!COOKIE_SECRET) return new NextResponse('Server not configured', { status: 500 });

	const cookieVal = request.cookies.get(COOKIE_NAME)?.value;
	if (verifyToken(cookieVal, COOKIE_SECRET)) return NextResponse.next();

	const loginUrl = new URL('/enter-password', request.url);
	loginUrl.searchParams.set('from', safeRedirectPath(request.nextUrl.pathname));
	return NextResponse.redirect(loginUrl);
}

export const config = {
	matcher: ['/protected', '/protected/:path*'],
};