'use client';

import NextImage, { ImageProps as NextImageProps } from 'next/image';

export type ImageProps = NextImageProps & {
  unoptimized?: boolean;
};

export default function Image({
  unoptimized = false,
  ...props
}: ImageProps) {
  return (
    <NextImage
      unoptimized={unoptimized}
      {...props}
    />
  );
}
