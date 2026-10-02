"use client";

import { ImagePlus, Lock, X } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect, useId, useRef, useState } from "react";

import { cn } from "cn";

export type SelectedPhoto = {
  id: string;
  file: File;
  previewUrl: string;
};

export function PhotoUploadZone({
  photos,
  onPhotosChange,
  disabled = false,
}: {
  photos: SelectedPhoto[];
  onPhotosChange: (photos: SelectedPhoto[]) => void;
  disabled?: boolean;
}) {
  const t = useTranslations("Apprentice.Upload");
  const inputId = useId();
  const [isDragging, setIsDragging] = useState(false);
  const photosRef = useRef(photos);
  photosRef.current = photos;

  useEffect(() => {
    return () => {
      photosRef.current.forEach((photo) => URL.revokeObjectURL(photo.previewUrl));
    };
  }, []);

  function addFiles(fileList: FileList | null) {
    if (disabled || !fileList) return;

    const added = Array.from(fileList)
      .filter((file) => file.type.startsWith("image/"))
      .map((file) => ({
        id: crypto.randomUUID(),
        file,
        previewUrl: URL.createObjectURL(file),
      }));

    if (added.length > 0) {
      onPhotosChange([...photos, ...added]);
    }
  }

  function removePhoto(id: string) {
    const photo = photos.find((item) => item.id === id);
    if (photo) URL.revokeObjectURL(photo.previewUrl);
    onPhotosChange(photos.filter((item) => item.id !== id));
  }

  return (
    <div className="flex flex-col gap-4">
      <label
        htmlFor={disabled ? undefined : inputId}
        aria-disabled={disabled || undefined}
        onDragOver={(event) => {
          event.preventDefault();
          if (!disabled) setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          addFiles(event.dataTransfer.files);
        }}
        className={cn(
          "flex min-h-40 flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-zinc-700 bg-zinc-950/60 px-6 py-8 text-center transition-colors",
          disabled
            ? "cursor-not-allowed opacity-50 grayscale"
            : "cursor-pointer hover:border-amber-400/60 focus-within:border-amber-400 focus-within:ring-3 focus-within:ring-amber-400/30",
          isDragging && "border-amber-400 bg-amber-400/5",
        )}
      >
        <span
          className={cn(
            "flex size-12 items-center justify-center rounded-full",
            disabled ? "bg-zinc-800 text-zinc-400" : "bg-amber-400/10 text-amber-400",
          )}
        >
          {disabled ? (
            <Lock className="size-6" aria-hidden />
          ) : (
            <ImagePlus className="size-6" aria-hidden />
          )}
        </span>
        <span className="text-sm font-medium text-zinc-50">
          {disabled ? t("locked") : t("prompt")}
        </span>
        {!disabled && <span className="text-xs text-zinc-500">{t("hint")}</span>}
        <input
          id={inputId}
          type="file"
          accept="image/*"
          multiple
          disabled={disabled}
          aria-disabled={disabled || undefined}
          className="sr-only"
          onChange={(event) => {
            addFiles(event.target.files);
            event.target.value = "";
          }}
        />
      </label>

      {photos.length > 0 && (
        <div>
          <p className="text-xs text-zinc-400">
            {t("selected", { count: photos.length })}
          </p>
          <ul className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4">
            {photos.map((photo) => (
              <li
                key={photo.id}
                className="relative aspect-square overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900"
              >
                <Image
                  src={photo.previewUrl}
                  alt={photo.file.name}
                  fill
                  unoptimized
                  sizes="(min-width: 640px) 25vw, 33vw"
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => removePhoto(photo.id)}
                  aria-label={t("remove", { name: photo.file.name })}
                  className="absolute top-1.5 right-1.5 flex size-7 items-center justify-center rounded-full bg-zinc-950/80 text-zinc-200 backdrop-blur hover:text-rose-300"
                >
                  <X className="size-4" aria-hidden />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
