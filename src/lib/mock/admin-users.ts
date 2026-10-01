import type { Role } from "@/lib/roles";

export type PlatformUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  joinedAt: string;
};

export const platformUsers: PlatformUser[] = [
  {
    id: "john-doe",
    name: "John Doe",
    email: "john.doe@puertoink.academy",
    role: "APPRENTICE",
    joinedAt: "Mar 2026",
  },
  {
    id: "jane-smith",
    name: "Jane Smith",
    email: "jane.smith@puertoink.academy",
    role: "TEACHER",
    joinedAt: "Jan 2026",
  },
  {
    id: "admin-user",
    name: "Admin User",
    email: "admin@puertoink.academy",
    role: "ADMIN",
    joinedAt: "Dec 2025",
  },
];
