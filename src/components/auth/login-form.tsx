"use client";

import { ArrowLeft, Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import { useId, useState, useTransition } from "react";
import { toast } from "sonner";

import { requestLoginCode, verifyLoginCode } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { sectionLabelVariants } from "@/components/ui/section-label";

const labelClass = sectionLabelVariants();
const inputClass =
  "h-11 border-zinc-700 bg-zinc-950/60 text-base text-zinc-100 focus-visible:border-amber-400 focus-visible:ring-amber-400/30 md:text-sm";
const submitClass =
  "h-11 w-full bg-amber-400 text-zinc-950 shadow-[0_0_24px_-6px_var(--color-amber-400)] hover:bg-amber-300";

export function LoginForm({ initialError = null }: { initialError?: string | null }) {
  const t = useTranslations("Auth");
  const emailId = useId();
  const codeId = useId();
  const errorId = useId();
  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(initialError);
  const [pending, startTransition] = useTransition();

  function sendCode(onSent: () => void) {
    startTransition(async () => {
      const result = await requestLoginCode(email);
      if ("error" in result) {
        setError(result.error);
        return;
      }
      setError(null);
      onSent();
    });
  }

  if (step === "email") {
    return (
      <form
        className="flex flex-col gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          sendCode(() => setStep("code"));
        }}
      >
        <div className="flex flex-col gap-2">
          <Label htmlFor={emailId} className={labelClass}>
            {t("email")}
          </Label>
          <Input
            id={emailId}
            type="email"
            autoComplete="email"
            required
            autoFocus
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setError(null);
            }}
            placeholder={t("emailPlaceholder")}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            className={inputClass}
          />
          {error && (
            <p id={errorId} className="text-sm text-rose-400">
              {error}
            </p>
          )}
        </div>
        <Button type="submit" size="lg" disabled={pending} className={submitClass}>
          <Mail aria-hidden />
          {pending ? t("sending") : t("sendCode")}
        </Button>
      </form>
    );
  }

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        startTransition(async () => {
          const result = await verifyLoginCode(email, code);
          if ("error" in result) setError(result.error);
        });
      }}
    >
      <p className="text-sm text-zinc-400">
        {t.rich("codeSent", {
          email,
          strong: (chunks) => <span className="font-medium text-zinc-100">{chunks}</span>,
        })}
      </p>
      <div className="flex flex-col gap-2">
        <Label htmlFor={codeId} className={labelClass}>
          {t("codeLabel")}
        </Label>
        <Input
          id={codeId}
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="[0-9]{6}"
          maxLength={6}
          required
          autoFocus
          value={code}
          onChange={(event) => {
            setCode(event.target.value.replace(/\D/g, ""));
            setError(null);
          }}
          placeholder="000000"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={`${inputClass} text-center font-mono text-lg tracking-[0.5em] md:text-lg`}
        />
        {error && (
          <p id={errorId} className="text-sm text-rose-400">
            {error}
          </p>
        )}
      </div>
      <Button
        type="submit"
        size="lg"
        disabled={pending || code.length !== 6}
        className={submitClass}
      >
        {pending ? t("verifying") : t("verify")}
      </Button>
      <div className="flex items-center justify-between gap-2 text-sm">
        <Button
          type="button"
          variant="ghost"
          onClick={() => {
            setStep("email");
            setCode("");
            setError(null);
          }}
          className="h-10 px-2 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-50"
        >
          <ArrowLeft aria-hidden />
          {t("differentEmail")}
        </Button>
        <Button
          type="button"
          variant="ghost"
          disabled={pending}
          onClick={() => sendCode(() => toast.success(t("resent", { email })))}
          className="h-10 px-2 text-amber-400 hover:bg-zinc-800 hover:text-amber-300"
        >
          {t("resend")}
        </Button>
      </div>
    </form>
  );
}
