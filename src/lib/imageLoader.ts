import { ImageLoaderProps } from 'next/image';

export default function imageLoader({ src, width, quality }: ImageLoaderProps) {
  // For absolute URLs (starting with http:// or https://)
  if (src.startsWith('http')) {
    return `${src}?w=${width}&q=${quality || 75}`;
  }
  
  // For relative URLs, prefix with your domain
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:8080';
  return `${baseUrl}${src}?w=${width}&q=${quality || 75}`;
}
