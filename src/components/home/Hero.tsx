"use client";

import Image from "next/image";
import { useEffect, useState, type ReactNode } from "react";

// Fullscreen hero with a slow crossfade slideshow of room photos. Falls back to
// a warm gradient when no photos are loaded yet (build must pass before data).
export function Hero({
  images,
  children,
}: {
  images: string[];
  children: ReactNode;
}) {
  const [index, setIndex] = useState(0);
  const hasImages = images.length > 0;

  useEffect(() => {
    if (images.length < 2) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % images.length),
      6000
    );
    return () => clearInterval(id);
  }, [images.length]);

  return (
    <section className="relative isolate flex min-h-[88vh] items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#123f39] via-[#14655b] to-[#1b1a18]">
        {hasImages &&
          images.map((src, i) => (
            <div
              key={src}
              className="absolute inset-0 transition-opacity duration-[1500ms] ease-in-out"
              style={{ opacity: i === index ? 1 : 0 }}
            >
              <Image
                src={src}
                alt=""
                fill
                priority={i === 0}
                sizes="100vw"
                className="object-cover"
              />
            </div>
          ))}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/35 to-black/45" />
      </div>

      <div className="container-page w-full py-24 text-white">{children}</div>
    </section>
  );
}
