export const getImageUrl = (url?: string): string => {
    if (!url) return 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800'; // Default fallback
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    
    // Fallback base URL should match the backend (removing /api)
    const baseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5247/api').replace('/api', '');
    
    // Ensure the url starts with a slash
    const formattedUrl = url.startsWith('/') ? url : `/${url}`;
    
    return `${baseUrl}${formattedUrl}`;
};
