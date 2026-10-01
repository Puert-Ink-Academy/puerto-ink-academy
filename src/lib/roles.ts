export const roles = ["APPRENTICE", "TEACHER", "ADMIN"] as const;

export type Role = (typeof roles)[number];

export const roleLabels: Record<Role, string> = {
  APPRENTICE: "Apprentice",
  TEACHER: "Teacher",
  ADMIN: "Admin",
};

export function isRole(value: unknown): value is Role {
  return typeof value === "string" && (roles as readonly string[]).includes(value);
}
