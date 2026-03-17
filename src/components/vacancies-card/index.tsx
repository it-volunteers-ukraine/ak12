import { Button } from "@/components/ui/button";
import {
    Card,
    CardTitle,
    CardHeader,
    CardContent,
    CardDescription,
} from "@/components/ui/card";

interface VacancyCardProps {
    id: number;
    title: string;
    salary?: string;
    location?: string;
    description: string;
    onClick?: () => void;
    onEdit?: (id: number) => void;
    onDelete?: (id: number) => void;
}

export function VacancyCard({
    id,
    title,
    salary,
    onEdit,
    onClick,
    location,
    onDelete,
    description,
}: VacancyCardProps) {
    return (
        <Card
            className="w-80"
            onClick={onClick}
        >
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <CardDescription>{description}</CardDescription>
                {location && <p className="mt-2 text-sm">📍 {location}</p>}
                {salary && <p className="mt-1 text-sm font-medium">{salary}</p>}
                <div className="mt-4 flex gap-2">
                    {onEdit && (
                        <Button
                            size="sm"
                            onClick={() => onEdit(id)}
                        >
                            Edit
                        </Button>
                    )}
                    {onDelete && (
                        <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => onDelete(id)}
                        >
                            Delete
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
