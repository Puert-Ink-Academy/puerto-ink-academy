"use client";

import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from "lucide-react";
import Image from "next/image";
import { useLayoutEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog";
import type { SubmissionPhoto } from "@/lib/mock/photos";
import { cn } from "cn";

const SWIPE_DISTANCE = 50;
const TAP_SLOP = 10;
const DOUBLE_TAP_MS = 300;

type ZoomOrigin = { x: number; y: number };

const controlClass =
  "size-10 rounded-full bg-zinc-900/80 text-zinc-100 backdrop-blur hover:bg-zinc-800 hover:text-zinc-50";

function ViewerStage({
  photo,
  onSwipe,
}: {
  photo: SubmissionPhoto;
  onSwipe: (direction: 1 | -1) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  const lastTap = useRef(0);
  const [zoomOrigin, setZoomOrigin] = useState<ZoomOrigin | null>(null);
  const zoomed = zoomOrigin !== null;

  useLayoutEffect(() => {
    const scroller = scrollRef.current;
    if (!scroller || !zoomOrigin) return;
    scroller.scrollLeft = zoomOrigin.x * scroller.scrollWidth - scroller.clientWidth / 2;
    scroller.scrollTop = zoomOrigin.y * scroller.scrollHeight - scroller.clientHeight / 2;
  }, [zoomOrigin]);

  function toggleZoom(origin: ZoomOrigin) {
    setZoomOrigin((current) => (current ? null : origin));
  }

  return (
    <div className="relative min-h-0 flex-1">
      <div
        ref={scrollRef}
        className={cn(
          "absolute inset-0 flex overflow-auto overscroll-contain",
          zoomed ? "cursor-zoom-out" : "cursor-zoom-in touch-none",
        )}
        onPointerDown={(event) => {
          pointerStart.current = { x: event.clientX, y: event.clientY };
        }}
        onPointerUp={(event) => {
          const start = pointerStart.current;
          pointerStart.current = null;
          if (!start) return;

          const dx = event.clientX - start.x;
          const dy = event.clientY - start.y;

          if (!zoomed && Math.abs(dx) > SWIPE_DISTANCE && Math.abs(dx) > Math.abs(dy)) {
            onSwipe(dx < 0 ? 1 : -1);
            return;
          }

          if (Math.abs(dx) > TAP_SLOP || Math.abs(dy) > TAP_SLOP) return;

          const now = event.timeStamp;
          if (now - lastTap.current < DOUBLE_TAP_MS) {
            lastTap.current = 0;
            const image = event.currentTarget.querySelector("img");
            const rect = image?.getBoundingClientRect();
            toggleZoom(
              rect
                ? {
                    x: Math.min(Math.max((event.clientX - rect.left) / rect.width, 0), 1),
                    y: Math.min(Math.max((event.clientY - rect.top) / rect.height, 0), 1),
                  }
                : { x: 0.5, y: 0.5 },
            );
          } else {
            lastTap.current = now;
          }
        }}
      >
        <Image
          src={photo.src}
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          sizes="200vw"
          draggable={false}
          className={cn(
            "m-auto select-none",
            zoomed
              ? "h-auto w-[200%] max-w-none shrink-0"
              : "h-auto max-h-full w-auto max-w-full object-contain",
          )}
        />
      </div>
      <Button
        type="button"
        size="icon"
        variant="ghost"
        aria-label={zoomed ? "Zoom out" : "Zoom in"}
        onClick={() => toggleZoom({ x: 0.5, y: 0.5 })}
        className={cn(
          controlClass,
          "absolute right-3 bottom-[calc(0.75rem+env(safe-area-inset-bottom))]",
        )}
      >
        {zoomed ? <ZoomOut /> : <ZoomIn />}
      </Button>
    </div>
  );
}

export function PhotoViewer({
  photos,
  index,
  open,
  onOpenChange,
  onIndexChange,
}: {
  photos: SubmissionPhoto[];
  index: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onIndexChange: (index: number) => void;
}) {
  const photo = photos[index];
  const hasMany = photos.length > 1;

  function step(direction: 1 | -1) {
    if (!hasMany) return;
    onIndexChange((index + direction + photos.length) % photos.length);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {photo && (
        <DialogContent
          showCloseButton={false}
          onKeyDown={(event) => {
            if (event.key === "ArrowRight") step(1);
            if (event.key === "ArrowLeft") step(-1);
          }}
          className="inset-0 top-0 left-0 flex h-svh w-full max-w-none translate-x-0 translate-y-0 flex-col gap-0 rounded-none bg-black p-0 ring-0 sm:max-w-none"
        >
          <DialogTitle className="sr-only">
            Photo {index + 1} of {photos.length}
          </DialogTitle>
          <div className="flex items-center justify-between px-3 pt-[calc(0.75rem+env(safe-area-inset-top))] pb-3">
            <p className="rounded-full bg-zinc-900/80 px-3 py-1 text-xs font-medium text-zinc-300 tabular-nums">
              {index + 1} / {photos.length}
            </p>
            <DialogClose
              render={
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  aria-label="Close photo"
                  className={controlClass}
                />
              }
            >
              <X />
            </DialogClose>
          </div>
          <ViewerStage key={photo.src + index} photo={photo} onSwipe={step} />
          {hasMany && (
            <>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                aria-label="Previous photo"
                onClick={() => step(-1)}
                className={cn(controlClass, "absolute top-1/2 left-3 -translate-y-1/2")}
              >
                <ChevronLeft />
              </Button>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                aria-label="Next photo"
                onClick={() => step(1)}
                className={cn(controlClass, "absolute top-1/2 right-3 -translate-y-1/2")}
              >
                <ChevronRight />
              </Button>
            </>
          )}
        </DialogContent>
      )}
    </Dialog>
  );
}
