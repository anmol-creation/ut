export function calculateStrength(password) {
    let score = 0;
    if (!password) return 'weak';

    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    if (score >= 5) return 'strong';
    if (score >= 3) return 'medium';
    return 'weak';
}
