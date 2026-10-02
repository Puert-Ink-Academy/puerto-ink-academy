import { countryCode, type CountryCode } from "@/lib/countries";
import type { Role } from "@/lib/roles";

export type PlatformUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  /** ISO 8601 date, e.g. "2026-03-02". */
  joinedAt: string;
  artistName?: string;
  studio?: string;
  nationality?: CountryCode;
};

export const platformUsers: PlatformUser[] = [
  {
    id: "john-doe",
    name: "John Doe",
    email: "john.doe@puertoink.academy",
    role: "APPRENTICE",
    joinedAt: "2026-03-02",
    artistName: "JD Linework",
    studio: "Puerto Ink Studio",
    nationality: countryCode("US"),
  },
  {
    id: "jane-smith",
    name: "Jane Smith",
    email: "jane.smith@puertoink.academy",
    role: "TEACHER",
    joinedAt: "2026-01-12",
    artistName: "Inkwell Jane",
    studio: "Puerto Ink Studio",
    nationality: countryCode("GB"),
  },
  {
    id: "luis-ortega",
    name: "Luis Ortega",
    email: "luis.ortega@puertoink.academy",
    role: "TEACHER",
    joinedAt: "2026-02-02",
    artistName: "Luis Ortega",
    studio: "Puerto Ink Studio",
    nationality: countryCode("ES"),
  },
  {
    id: "admin-user",
    name: "Admin User",
    email: "admin@puertoink.academy",
    role: "ADMIN",
    joinedAt: "2025-12-01",
    nationality: countryCode("GR"),
  },
  {
    id: "marco",
    name: "Marco",
    email: "marco@puertoink.academy",
    role: "APPRENTICE",
    joinedAt: "2025-11-18",
    artistName: "Marco Spina",
    studio: "Officina Nera",
    nationality: countryCode("IT"),
  },
  {
    id: "alex",
    name: "Alex",
    email: "alex@puertoink.academy",
    role: "APPRENTICE",
    joinedAt: "2025-12-09",
    artistName: "Alex Meraki",
    studio: "Aegean Ink",
    nationality: countryCode("GR"),
  },
  {
    id: "mike",
    name: "Mike",
    email: "mike@puertoink.academy",
    role: "APPRENTICE",
    joinedAt: "2025-12-15",
    artistName: "Iron Mike",
    nationality: countryCode("US"),
  },
  {
    id: "sofia",
    name: "Sofia",
    email: "sofia@puertoink.academy",
    role: "APPRENTICE",
    joinedAt: "2026-01-05",
    artistName: "Sofi Tinta",
    studio: "La Rosa Negra",
    nationality: countryCode("ES"),
  },
  {
    id: "diego",
    name: "Diego",
    email: "diego@puertoink.academy",
    role: "APPRENTICE",
    joinedAt: "2026-01-20",
    artistName: "El Diego",
    nationality: countryCode("MX"),
  },
  {
    id: "lena",
    name: "Lena",
    email: "lena@puertoink.academy",
    role: "APPRENTICE",
    joinedAt: "2026-01-27",
    artistName: "Lena Linien",
    studio: "Nadelwerk Berlin",
    nationality: countryCode("DE"),
  },
  {
    id: "kai",
    name: "Kai",
    email: "kai@puertoink.academy",
    role: "APPRENTICE",
    joinedAt: "2026-02-03",
    studio: "Horimono House",
    nationality: countryCode("JP"),
  },
  {
    id: "nora",
    name: "Nora",
    email: "nora@puertoink.academy",
    role: "APPRENTICE",
    joinedAt: "2026-02-17",
    artistName: "Nordic Nora",
    nationality: countryCode("NO"),
  },
  {
    id: "theo",
    name: "Theo",
    email: "theo@puertoink.academy",
    role: "APPRENTICE",
    joinedAt: "2026-03-09",
    nationality: countryCode("FR"),
  },
];

export function getPlatformUser(id: string): PlatformUser | undefined {
  return platformUsers.find((user) => user.id === id);
}
