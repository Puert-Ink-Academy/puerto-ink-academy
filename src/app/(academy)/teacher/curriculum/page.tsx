import { CurriculumPage } from "@/components/teacher/curriculum-page";
import { screenMetadata } from "@/lib/page-metadata";

export async function generateMetadata() {
  return screenMetadata("curriculum");
}

export default function TeacherCurriculumPage() {
  return <CurriculumPage nav="teacher" />;
}
