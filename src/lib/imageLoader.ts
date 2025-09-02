import { ImageLoaderProps } from 'next/image';

export default function imageLoader({ src, width, quality }: ImageLoaderProps) {
  // For absolute URLs (starting with http:// or https://)
  if (src.startsWith('http')) {
    return `${src}?w=${width}&q=${quality || 75}`;
  }
  
  // For static assets in public folder (starting with /)
  if (src.startsWith('/')) {
    return `${src}`;
  }
  
  // For relative URLs from external sources, use CloudFront
  const cloudFrontUrl = 'https://d12znbzrksh6ne.cloudfront.net';
  return `${cloudFrontUrl}/${src}?w=${width}&q=${quality || 75}`;
}
