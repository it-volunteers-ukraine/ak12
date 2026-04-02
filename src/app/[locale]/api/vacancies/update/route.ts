import { NextRequest, NextResponse } from "next/server";
import { updateVacancy } from "@/actions/vacancies/update-vacancy.action";
import { logger } from "@/lib/logger";

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();

    const { ukId, enId, data } = body;

    const result = await updateVacancy({
      ukId,
      enId,
      data,
    });

    return NextResponse.json(result);
  } catch (error) {
    logger.error(error);
    
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}