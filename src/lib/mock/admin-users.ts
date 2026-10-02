import { countryCode, type CountryCode } from "@/lib/countries";
import type { Role } from "@/lib/roles";

export type PlatformUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
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
    joinedAt: "Mar 2026",
    artistName: "JD Linework",
    studio: "Puerto Ink Studio",
    nationality: countryCode("US"),
  },
  {
    id: "jane-smith",
    name: "Jane Smith",
    email: "jane.smith@puertoink.academy",
    role: "TEACHER",
    joinedAt: "Jan 2026",
    artistName: "Inkwell Jane",
    studio: "Puerto Ink Studio",
    nationality: countryCode("GB"),
  },
  {
    id: "admin-user",
    name: "Admin User",
    email: "admin@puertoink.academy",
    role: "ADMIN",
    joinedAt: "Dec 2025",
    nationality: countryCode("GR"),
  },
  {
    id: "marco",
    name: "Marco",
    email: "marco@puertoink.academy",
    role: "APPRENTICE",
    joinedAt: "Nov 2025",
    artistName: "Marco Spina",
    studio: "Officina Nera",
    nationality: countryCode("IT"),
  },
  {
    id: "alex",
    name: "Alex",
    email: "alex@puertoink.academy",
    role: "APPRENTICE",
    joinedAt: "Dec 2025",
    artistName: "Alex Meraki",
    studio: "Aegean Ink",
    nationality: countryCode("GR"),
  },
  {
    id: "mike",
    name: "Mike",
    email: "mike@puertoink.academy",
    role: "APPRENTICE",
    joinedAt: "Dec 2025",
    artistName: "Iron Mike",
    nationality: countryCode("US"),
  },
  {
    id: "sofia",
    name: "Sofia",
    email: "sofia@puertoink.academy",
    role: "APPRENTICE",
    joinedAt: "Jan 2026",
    artistName: "Sofi Tinta",
    studio: "La Rosa Negra",
    nationality: countryCode("ES"),
  },
  {
    id: "diego",
    name: "Diego",
    email: "diego@puertoink.academy",
    role: "APPRENTICE",
    joinedAt: "Jan 2026",
    artistName: "El Diego",
    nationality: countryCode("MX"),
  },
  {
    id: "lena",
    name: "Lena",
    email: "lena@puertoink.academy",
    role: "APPRENTICE",
    joinedAt: "Jan 2026",
    artistName: "Lena Linien",
    studio: "Nadelwerk Berlin",
    nationality: countryCode("DE"),
  },
  {
    id: "kai",
    name: "Kai",
    email: "kai@puertoink.academy",
    role: "APPRENTICE",
    joinedAt: "Feb 2026",
    studio: "Horimono House",
    nationality: countryCode("JP"),
  },
  {
    id: "nora",
    name: "Nora",
    email: "nora@puertoink.academy",
    role: "APPRENTICE",
    joinedAt: "Feb 2026",
    artistName: "Nordic Nora",
    nationality: countryCode("NO"),
  },
  {
    id: "theo",
    name: "Theo",
    email: "theo@puertoink.academy",
    role: "APPRENTICE",
    joinedAt: "Mar 2026",
    nationality: countryCode("FR"),
  },
];

export function getPlatformUser(id: string): PlatformUser | undefined {
  return platformUsers.find((user) => user.id === id);
}
