"use client";

import { VacancySection } from "@/components/admin/vacancies-section";
import { useRouter } from "next/navigation";

export default function NewVacancyPage() {
  const router = useRouter();

  return (
    <div className="px-4 py-6">
      <VacancySection onSuccess={() => router.push("list")} onBack={() => router.push("list")} />
    </div>
  );
}
