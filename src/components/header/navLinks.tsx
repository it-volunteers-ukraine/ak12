import { Links } from ".";
import { cn } from "@/utils";

type NavLinkProps = {
  links: Links;
  className?: string;
  activeSection?: string;
  onClickAction?: () => void;
  type?: "desktop" | "mobile";
};

export const NavLinks = ({ activeSection, links, onClickAction, type = "desktop", className }: NavLinkProps) => {
  return (
    <nav className={cn(type === "desktop" && "desktop:flex hidden items-center")}>
      <ul
        className={cn(
          "flex items-center",
          type === "desktop" && "desktop-xl:gap-6 gap-4",
          type === "mobile" && "flex-col",
        )}
      >
        {links.map((item) => (
          <li key={item.idSection}>
            <a
              href={`#${item.idSection}`}
              onClick={onClickAction}
              aria-current={activeSection === item.idSection ? "page" : undefined}
              className={cn(
                "text-soft-blush focus:text-accent/50 active:text-accent hover:text-accent/50 text-[16px] font-semibold transition-colors active:underline active:underline-offset-1",
                type === "mobile" && "font-ermilov inline-block p-2.5 text-[18px]",
                activeSection === item.idSection && "text-accent",
                className,
              )}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};
