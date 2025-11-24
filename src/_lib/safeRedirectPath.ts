// Purpose - Prevent open-redirects vulnerabilities by ensuring a redirect target is a local path
// Stops attackers from supplying external URLs to redirect users to malicious sites
export default function safeRedirectPath(p: unknown) {
    if (typeof p !== 'string') return '/protected';
    if (!p.startsWith('/') || p.includes('//')) return '/protected';
    return p;
}