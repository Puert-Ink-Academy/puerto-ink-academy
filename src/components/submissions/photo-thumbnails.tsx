"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { PhotoViewer } from "@/components/submissions/photo-viewer";
import type { SubmissionPhoto } from "@/lib/mock/photos";

export function PhotoThumbnails({ photos }: { photos: SubmissionPhoto[] }) {
  const t = useTranslations("Submissions");
  const [index, setIndex] = useState(0);
  const [viewerOpen, setViewerOpen] = useState(false);

  if (photos.length === 0) return null;

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {photos.map((photo, photoIndex) => (
          <button
            key={photo.src + photoIndex}
            type="button"
            onClick={() => {
              setIndex(photoIndex);
              setViewerOpen(true);
            }}
            aria-label={t("viewPhoto", { index: photoIndex + 1, total: photos.length })}
            className="relative h-14 w-[4.5rem] cursor-zoom-in overflow-hidden rounded-md border border-zinc-800 transition-colors outline-none hover:border-zinc-600 focus-visible:border-amber-400"
          >
            <Image src={photo.src} alt="" fill sizes="72px" className="object-cover" />
          </button>
        ))}
      </div>
      <PhotoViewer
        photos={photos}
        index={index}
        open={viewerOpen}
        onOpenChange={setViewerOpen}
        onIndexChange={setIndex}
      />
    </>
  );
}
