import path from "path";
import fs from "fs/promises";
import { NextRequest, NextResponse } from "next/server";

type TVacancy = {
    id: number;
    title: string;
    salary: string;
    location: string;
    description: string;
};
type TDB = {
    vacancies: TVacancy[];
};

const filePath = path.join(process.cwd(), "data/db.json");

async function readDB(): Promise<TDB> {
    const file = await fs.readFile(filePath, "utf-8");

    return JSON.parse(file);
}

async function writeDB(data: TDB) {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

export async function GET() {
    const db = await readDB();

    return NextResponse.json(db.vacancies);
}

export async function POST(req: NextRequest) {
    const newVacancy = await req.json();
    const db = await readDB();

    newVacancy.id = db.vacancies.length
        ? db.vacancies[db.vacancies.length - 1].id + 1
        : 1;
    db.vacancies.push(newVacancy);
    await writeDB(db);

    return NextResponse.json(newVacancy);
}

export async function PUT(req: NextRequest) {
    const updatedVacancy = await req.json();
    const db = await readDB();
    const index = db.vacancies.findIndex(
        (vac: TVacancy) => vac.id === updatedVacancy.id,
    );

    if (index === -1) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    db.vacancies[index] = updatedVacancy;
    await writeDB(db);

    return NextResponse.json(updatedVacancy);
}

export async function DELETE(req: NextRequest) {
    /* urlObj */
    const { searchParams } = new URL(req.url);

    const id = Number(searchParams.get("id"));
    const db = await readDB();

    db.vacancies = db.vacancies.filter((vac: TVacancy) => vac.id !== id);
    await writeDB(db);

    return NextResponse.json({ success: true });
}
