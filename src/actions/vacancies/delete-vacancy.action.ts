"use server";

import { vacancyService } from "@/lib/vacancies/vacancy.service";

export async function deleteVacancy({ ukId, enId }: { ukId: string; enId: string }): Promise<void> {
  await vacancyService.delete({ ukId, enId });
}
