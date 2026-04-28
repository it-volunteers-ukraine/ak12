import { cn } from "@/utils";

type NavLinkProps = {
  id?: string;
  label: string;
  isActive: boolean;
  className?: string;
  onClick?: () => void;
  type?: "desktop" | "mobile";
};

export const NavLink = ({ id, label, isActive, onClick, type = "desktop", className }: NavLinkProps) => {
  if (!id) {
    return null;
  }

  return (
    <a
      href={`#${id}`}
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "text-soft-blush focus:text-accent/50 active:text-accent hover:text-accent/50 text-[16px] font-semibold transition-colors active:underline active:underline-offset-1",
        type === "mobile" && "font-ermilov text-[18px]",

        isActive && "text-accent",
        className,
      )}
    >
      {label}
    </a>
  );
};
