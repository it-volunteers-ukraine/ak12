import { createVacancy } from "@/actions/vacancies/create-vacancy.action";

export async function POST(req: Request) {
  const body = await req.json();

  const result = await createVacancy(body);

  return Response.json(result);
}