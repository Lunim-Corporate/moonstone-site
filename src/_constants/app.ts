export const COOKIE_NAME = 'protected_auth';
export const COOKIE_SECRET = process.env.PROTECTED_COOKIE_SECRET || process.env.PROTECTED_ROUTE_PASSWORD;