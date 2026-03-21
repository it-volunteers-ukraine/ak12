export type SubmenuItem = {
    id: string;
    section_key: string;
};

export const sidebarToSubmenuMap: Record<string, SubmenuItem[]> = {
    contacts: [
        { id: "header", section_key: "Header" },
        { id: "footer", section_key: "Footer" },
    ],
    content: [
        { id: "openings", section_key: "Openings" },
        { id: "openings2", section_key: "Openings2" },
    ],
    divisions: [
        { id: "division1", section_key: "Division1" },
        { id: "division2", section_key: "Division2" },
    ],
    ceo: [
        { id: "ceo1", section_key: "ceo1" },
        { id: "ceo2", section_key: "ceo2" },
    ],
    job: [
        { id: "job1", section_key: "Job1" },
        { id: "job2", section_key: "Job2" },
    ],
};
