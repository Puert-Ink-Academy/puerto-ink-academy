import { GradingView } from "@/components/teacher/grading-view";
import { screenMetadata } from "@/lib/page-metadata";

export async function generateMetadata() {
  return screenMetadata("grading");
}

export default function AdminGradingPage() {
  return <GradingView nav="admin" />;
}
