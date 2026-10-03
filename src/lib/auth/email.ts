export function normalizeEmail(email: string): string | null {
  const trimmed = email.normalize("NFKC").toLowerCase().trim();
  if (!trimmed || trimmed.includes('"')) return null;

  const parts = trimmed.split("@");
  if (parts.length !== 2) return null;

  const [local, domainPart] = parts;
  const domain = domainPart?.split(",")[0];
  if (!local || !domain || domain.includes(" ")) return null;

  return `${local}@${domain}`;
}
