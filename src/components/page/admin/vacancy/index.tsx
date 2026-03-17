"use client";

import { useState, useEffect } from "react";

import { useParams } from "next/navigation";

interface Vacancy {
    id: number;
    title: string;
    salary: string;
    location: string;
    description: string;
}

export const VacancyPage = () => {
    const params = useParams();
    const [vacancy, setVacancy] = useState<Vacancy | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchVacancy = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(`/api/vacancies?id=${params.id}`);

                if (!res.ok) {
                    throw new Error(
                        `Failed to fetch: ${res.status} ${res.statusText}`,
                    );
                }

                const data: Vacancy[] = await res.json();
                const found = data.find(
                    (vac: Vacancy) => vac.id === Number(params.id),
                );

                if (!found) {
                    throw new Error("Vacancy not found");
                }
                setVacancy(found);
            } catch (error) {
                console.error("Error fetching vacancy:", error);
                setError(
                    error instanceof Error ? error.message : "Unknown error",
                );
            } finally {
                setLoading(false);
            }
        };

        fetchVacancy();
    }, [params.id]);

    if (error) {
        return <div className="p-4">Vacancy not found</div>;
    }

    if (loading || !vacancy) {
        return <div>Loading...</div>;
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-2">
                {vacancy.title} {vacancy.id}
            </h1>
            <p className="mb-1">
                <strong>Salary:</strong> {vacancy.salary}
            </p>
            <p className="mb-1">
                <strong>Location:</strong> {vacancy.location}
            </p>
            <p className="mt-4">{vacancy.description}</p>
        </div>
    );
};
