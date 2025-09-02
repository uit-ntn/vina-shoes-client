/**
 * Normalizes image URLs to ensure they work with Next.js Image component
 * @param src The image source URL
 * @returns A normalized image URL
 */
export function normalizeImageUrl(src: string): string {
  // If the URL is null or undefined, return a placeholder
  if (!src) {
    return '/images/placeholder-shoe.jpg';
  }
  
  // If the URL is already absolute (starts with http or https), return it as is
  if (src.startsWith('http://') || src.startsWith('https://')) {
    return src;
  }
  
  // If the URL starts with a slash, it's relative to the root
  if (src.startsWith('/')) {
    return src;
  }
  
  // For CloudFront/S3 images, ensure proper format
  if (src.includes('cloudfront') || src.includes('amazonaws')) {
    return src.startsWith('https://') ? src : `https://${src}`;
  }
  
  // Otherwise, add a leading slash to make it relative to the root
  return `/${src}`;
}

/**
 * Gets a fallback image URL for products
 */
export function getProductImageFallback(): string {
  return '/images/placeholder-shoe.jpg';
}
