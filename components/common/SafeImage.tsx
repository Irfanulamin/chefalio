"use client";

import Image, { type ImageProps } from "next/image";
import { useState, type ReactNode } from "react";

type SafeImageProps = Omit<ImageProps, "src" | "onError"> & {
  src?: string | null;
  /** Drawn when there's no `src`, or when the one we have fails to load. */
  fallback: ReactNode;
};

/**
 * An image that has a plan for not loading.
 *
 * Plain `next/image` renders a broken-image glyph when the URL 404s, and
 * this app hits that for real: a number of Cloudinary asset URLs in the
 * database no longer resolve, so avatars and covers were rendering as
 * the browser's torn-page icon. That's worse than no image — it reads as
 * the app being broken rather than the picture being missing.
 *
 * Both cases route to the same fallback, so a missing `src` and a dead
 * `src` look identical rather than failing two different ways.
 */
export function SafeImage({ src, fallback, alt, ...props }: SafeImageProps) {
  /* Remembering *which* url failed, rather than a boolean plus an effect
     to reset it, means a new `src` is un-failed by construction — one
     bad url can't poison the slot for every item recycled through it in
     a list, and there's no render-then-correct flash. */
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  if (!src || failedSrc === src) return <>{fallback}</>;

  return (
    <Image {...props} src={src} alt={alt} onError={() => setFailedSrc(src)} />
  );
}

export default SafeImage;
