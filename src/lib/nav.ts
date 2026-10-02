export type NavKey = "apprentice" | "teacher" | "admin";

export type StaffNav = Exclude<NavKey, "apprentice">;
