/**
 * Detects if a URL is a video (YouTube/Vimeo) or an article.
 */
export const detectResourceType = (url: string): 'Video' | 'Article' | null => {
    if (!url) return null;

    const lower = url.toLowerCase();

    if (
        lower.includes('youtube.com') ||
        lower.includes('youtu.be') ||
        lower.includes('vimeo.com')
    ) {
        return 'Video';
    }

    // If it's a valid-ish URL (starts with http), default to Article
    if (lower.startsWith('http://') || lower.startsWith('https://')) {
        return 'Article';
    }

    return null;
};
