"use client";

import { ArrowLeft, Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useId, useState, useTransition } from "react";
import { toast } from "sonner";

import { requestLoginCode, verifyLoginCode } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { sectionLabelVariants } from "@/components/ui/section-label";
import { normalizeEmail } from "@/lib/auth/email";

const labelClass = sectionLabelVariants();
const inputClass =
  "h-11 border-zinc-700 bg-zinc-950/60 text-base text-zinc-100 focus-visible:border-amber-400 focus-visible:ring-amber-400/30 md:text-sm";
const submitClass =
  "h-11 w-full bg-amber-400 text-zinc-950 shadow-[0_0_24px_-6px_var(--color-amber-400)] hover:bg-amber-300";

export function LoginForm({ initialError = null }: { initialError?: string | null }) {
  const t = useTranslations("Auth");
  const tErrors = useTranslations("Errors");
  const emailId = useId();
  const codeId = useId();
  const errorId = useId();
  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(initialError);
  const [pending, startTransition] = useTransition();
  const [cooldown, setCooldown] = useState<{ email: string; until: number } | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [showingCooldownError, setShowingCooldownError] = useState(false);

  useEffect(() => {
    if (!cooldown || cooldown.until <= Date.now()) return;
    const id = window.setInterval(() => {
      const next = Date.now();
      setNow(next);
      if (next >= cooldown.until) window.clearInterval(id);
    }, 1000);
    return () => window.clearInterval(id);
  }, [cooldown]);

  const normalized = normalizeEmail(email);
  const secondsLeft =
    cooldown && normalized && cooldown.email === normalized
      ? Math.max(0, Math.ceil((cooldown.until - now) / 1000))
      : 0;
  const visibleError =
    showingCooldownError && secondsLeft > 0
      ? tErrors("codeCooldown", { seconds: secondsLeft })
      : error;

  useEffect(() => {
    if (secondsLeft > 0 || !showingCooldownError) return;
    setShowingCooldownError(false);
    setError(null);
  }, [secondsLeft, showingCooldownError]);

  function beginCooldown(address: string, seconds: number) {
    const key = normalizeEmail(address);
    if (!key) return;
    setNow(Date.now());
    setCooldown({ email: key, until: Date.now() + seconds * 1000 });
  }

  function sendCode(onSent: () => void) {
    startTransition(async () => {
      const result = await requestLoginCode(email);
      if ("error" in result) {
        setError(result.error);
        if (result.retryAfterSeconds) {
          setShowingCooldownError(true);
          beginCooldown(email, result.retryAfterSeconds);
        }
        return;
      }
      setShowingCooldownError(false);
      setError(null);
      beginCooldown(email, 60);
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
          {visibleError && (
            <p id={errorId} className="text-sm text-rose-400">
              {visibleError}
            </p>
          )}
        </div>
        <Button type="submit" size="lg" disabled={pending || secondsLeft > 0} className={submitClass}>
          <Mail aria-hidden />
          {pending
            ? t("sending")
            : secondsLeft > 0
              ? t("sendCodeIn", { seconds: secondsLeft })
              : t("sendCode")}
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
          if ("redirectTo" in result) {
            window.location.assign(result.redirectTo);
            return;
          }
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
        {visibleError && (
          <p id={errorId} className="text-sm text-rose-400">
            {visibleError}
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
          disabled={pending || secondsLeft > 0}
          onClick={() => sendCode(() => toast.success(t("resent", { email })))}
          className="h-10 px-2 text-amber-400 hover:bg-zinc-800 hover:text-amber-300"
        >
          {secondsLeft > 0 ? t("resendIn", { seconds: secondsLeft }) : t("resend")}
        </Button>
      </div>
    </form>
  );
}
