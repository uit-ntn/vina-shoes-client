'use client';

import NextImage, { ImageProps as NextImageProps } from 'next/image';
import imageLoader from '@/lib/imageLoader';

export type ImageProps = NextImageProps & {
  unoptimized?: boolean;
};

export default function Image({
  unoptimized = false,
  ...props
}: ImageProps) {
  return (
    <NextImage
      loader={imageLoader}
      unoptimized={unoptimized}
      {...props}
    />
  );
}
