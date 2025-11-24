// Next
import { NextResponse } from 'next/server';
// Crypto
import { createHmac, randomBytes } from 'crypto';
// Lib
import safeRedirectPath from '@/src/_lib/safeRedirectPath';
// Constants
import { COOKIE_NAME, COOKIE_SECRET } from '@/src/_constants/app';

const PASSWORD = process.env.PROTECTED_ROUTE_PASSWORD;
// Default duration: 1 hour (in seconds)
const DEFAULT_MAX_AGE = 60 * 60;

function signToken(expiry: number, nonce: string) {
	return createHmac('sha256', COOKIE_SECRET || '').update(`${expiry}.${nonce}`).digest('hex');
}

export async function POST(req: Request) {
	if (!COOKIE_SECRET) return new NextResponse('Server not configured', { status: 500 });
	if (!PASSWORD) return new NextResponse('Server password not configured', { status: 500 });
	const body = await req.json().catch(() => ({}));
	const password = body?.password;
	const from = safeRedirectPath(body?.from);

	if (typeof password !== 'string') {
		return NextResponse.json({ ok: false, message: 'Missing password' }, { status: 400 });
	}

	if (password !== PASSWORD) {
		return NextResponse.json({ ok: false, message: 'Invalid password' }, { status: 401 });
	}

    // If we reach here, the password is valid — create a signed token cookie
    // Token format: "{expiry}.{nonce}.{signature}"
	const expiry = Date.now() + DEFAULT_MAX_AGE * 1000;
	const nonce = randomBytes(16).toString('hex');
	const sig = signToken(expiry, nonce);
	const token = `${expiry}.${nonce}.${sig}`;

	const res = NextResponse.json({ ok: true, from });
	res.cookies.set(COOKIE_NAME, token, {
		httpOnly: true, // Not accessible via client-side JS
		path: '/',
		sameSite: 'lax',
		maxAge: DEFAULT_MAX_AGE,
		secure: process.env.NODE_ENV === 'production',
	});

	return res;
}