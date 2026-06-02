import { cn } from "@/utils";

export const CornerFrame = ({ className }: { className?: string }) => (
  <>
    {/* Верхній лівий кут */}
    <span className={cn("border-accent absolute top-0 left-0 h-5 w-5 border-t-2 border-l-2", className)} />
    {/* Верхній правий кут */}
    <span className={cn("border-accent absolute top-0 right-0 h-5 w-5 border-t-2 border-r-2", className)} />
    {/* Нижній лівий кут */}
    <span className={cn("border-accent absolute bottom-0 left-0 h-5 w-5 border-b-2 border-l-2", className)} />
    {/* Нижній правий кут */}
    <span className={cn("border-accent absolute right-0 bottom-0 h-5 w-5 border-r-2 border-b-2", className)} />
  </>
);
