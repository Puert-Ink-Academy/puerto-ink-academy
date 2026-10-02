// TODO(auth): replace these placeholders with the signed-in session.
export const currentUsers = {
  apprentice: {
    id: "00000000-0000-0000-0000-000000000001",
    role: "APPRENTICE",
  },
  teacher: {
    id: "00000000-0000-0000-0000-000000000002",
    role: "TEACHER",
  },
  admin: {
    id: "00000000-0000-0000-0000-000000000003",
    role: "ADMIN",
  },
} as const;
