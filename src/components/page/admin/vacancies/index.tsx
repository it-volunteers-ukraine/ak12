"use client";

import { useState, useEffect } from "react";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { VacancyCard } from "@/components/vacancies-card";

interface Vacancy {
    id: number;
    title: string;
    salary: string;
    location: string;
    description: string;
}

export const VacanciesPage = () => {
    const [vacancies, setVacancies] = useState<Vacancy[]>([]);

    const router = useRouter();

    const fetchVacancies = async () => {
        const res = await fetch("/api/vacancies");
        const data = await res.json();

        setVacancies(data);
    };

    const deleteVacancy = async (id: number) => {
        await fetch(`/api/vacancies?id=${id}`, { method: "DELETE" });
        fetchVacancies();
    };

    const addVacancy = async () => {
        await fetch("/api/vacancies", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                title: "Frontend Developer",
                description: "React / Next.js developer for admin panel",
                location: "Kyiv, Ukraine",
                salary: "1500$ - 2000$",
            }),
        });

        fetchVacancies();
    };

    const editVacancy = async (id: number) => {
        await fetch("/api/vacancies", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id,
                title: "Frontend Developer (Updated)",
                description:
                    "React / Next.js developer for admin panel (Updated)",
                location: "Kyiv, Ukraine",
                salary: "1500$ - 2000$",
            }),
        });

        fetchVacancies();
    };

    const handleClick = (id: number) => {
        router.push(`/admin/vacancies/${id}`);
    };

    useEffect(() => {
        fetchVacancies();
    }, []);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Vacancies</h1>
                <Button onClick={addVacancy}>Add Vacancy</Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {vacancies.map((vac) => (
                    <VacancyCard
                        id={vac.id}
                        key={vac.id}
                        title={vac.title}
                        salary={vac.salary}
                        onEdit={editVacancy}
                        location={vac.location}
                        onDelete={deleteVacancy}
                        description={vac.description}
                        onClick={() => handleClick(vac.id)}
                    />
                ))}
            </div>
        </div>
    );
};
