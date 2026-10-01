"use client";

import { Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import {
  PhotoUploadZone,
  type SelectedPhoto,
} from "@/components/apprentice/photo-upload-zone";
import { Button } from "@/components/ui/button";

export function LevelSubmission() {
  const [photos, setPhotos] = useState<SelectedPhoto[]>([]);

  return (
    <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 sm:p-5">
      <h2 className="text-[0.7rem] font-medium tracking-[0.12em] text-zinc-400 uppercase">
        Your Submission
      </h2>
      <div className="mt-4">
        <PhotoUploadZone photos={photos} onPhotosChange={setPhotos} />
      </div>
      <Button
        type="button"
        size="lg"
        disabled={photos.length === 0}
        onClick={() => toast("Your submission has been sent to the teacher")}
        className="mt-5 h-11 w-full bg-amber-400 text-zinc-950 hover:bg-amber-300 sm:w-auto sm:px-6"
      >
        <Send aria-hidden />
        Submit Exercise
      </Button>
    </section>
  );
}
