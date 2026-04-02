import { NextRequest, NextResponse } from "next/server";
import { createVacancy } from "@/actions/vacancies/create-vacancy.action";
import { logger } from "@/lib/logger";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const result = await createVacancy(data);

    return NextResponse.json(result);
  } catch (error) {
    logger.error(error);
    
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}