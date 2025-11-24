import { createHmac, timingSafeEqual } from "crypto";

// Returns true if the cookie token is valid and not expired; otherwise false
export default function verifyToken(token: string | undefined, COOKIE_SECRET: string | undefined): boolean {

    if (!token || !COOKIE_SECRET) return false;
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    const [expiryStr, nonce, sig] = parts;
    const expiry = Number(expiryStr);
    if (!expiry || expiry < Date.now()) return false;
    
    const expected = createHmac('sha256', COOKIE_SECRET).update(`${expiry}.${nonce}`).digest();
    const sigBuf = Buffer.from(sig, 'hex');
    if (expected.length !== sigBuf.length) return false;
    return timingSafeEqual(expected, sigBuf);
}