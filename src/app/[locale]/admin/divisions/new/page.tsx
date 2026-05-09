"use client";

import { useRouter } from "next/navigation";
import { SubdivisionSection } from "@/components/admin/subdivisions-section";

export default function NewSubdivisionPage() {
  const router = useRouter();

  return (
    <div className="px-4 py-6">
      <SubdivisionSection
        onSuccess={() => router.push("list")}
        onBack={() => router.push("list")}
      />
    </div>
  );
}