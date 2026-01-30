export function generateReferralCode(firstName: string): string {
    let prefix = firstName.slice(0, 4).toUpperCase();
    while (prefix.length < 4) {
        prefix += 'X';
    }
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let suffix = '';
    for (let i = 0; i < 4; i++) {
        suffix += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return prefix + suffix;
}