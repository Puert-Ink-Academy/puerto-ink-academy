"use client";

import { ZoomIn } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { PhotoViewer } from "@/components/submissions/photo-viewer";
import type { SubmissionPhoto } from "@/lib/mock/photos";
import { cn } from "cn";

export function PhotoGallery({ photos }: { photos: SubmissionPhoto[] }) {
  const t = useTranslations("Submissions");
  const [index, setIndex] = useState(0);
  const [viewerOpen, setViewerOpen] = useState(false);
  const photo = photos[index];
  const hasMany = photos.length > 1;

  if (!photo) return null;

  return (
    <div className="flex w-full flex-col">
      <button
        type="button"
        onClick={() => setViewerOpen(true)}
        aria-label={t("openFullscreen", { index: index + 1, total: photos.length })}
        className="group relative flex cursor-zoom-in items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-amber-400/60"
      >
        <Image
          src={photo.src}
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          sizes="(min-width: 768px) 60vw, 100vw"
          className={cn(
            "h-auto w-full object-contain",
            hasMany ? "md:max-h-[calc(90svh-5.5rem)]" : "md:max-h-[90svh]",
          )}
          priority
        />
        <span className="absolute right-3 bottom-3 flex items-center gap-1.5 rounded-full bg-zinc-950/75 px-2.5 py-1 text-xs font-medium text-zinc-200 backdrop-blur transition-colors group-hover:text-amber-300">
          <ZoomIn className="size-3.5" aria-hidden />
          {t("tapToZoom")}
        </span>
      </button>
      {hasMany && (
        <div className="flex gap-2 overflow-x-auto p-3" role="group" aria-label={t("photosGroup")}>
          {photos.map((item, itemIndex) => (
            <button
              key={item.src + itemIndex}
              type="button"
              onClick={() => setIndex(itemIndex)}
              aria-label={t("showPhoto", { index: itemIndex + 1 })}
              aria-pressed={itemIndex === index}
              className={cn(
                "relative h-14 w-[4.5rem] shrink-0 overflow-hidden rounded-md border-2 transition-colors outline-none focus-visible:border-amber-300",
                itemIndex === index
                  ? "border-amber-400"
                  : "border-transparent opacity-60 hover:opacity-100",
              )}
            >
              <Image src={item.src} alt="" fill sizes="72px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
      <PhotoViewer
        photos={photos}
        index={index}
        open={viewerOpen}
        onOpenChange={setViewerOpen}
        onIndexChange={setIndex}
      />
    </div>
  );
}
