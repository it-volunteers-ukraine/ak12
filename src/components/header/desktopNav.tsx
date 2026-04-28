import { HeaderProps } from ".";
import { NavLink } from "./navLink";
import { useWindowWidth } from "@/hooks";

export type Links = NonNullable<HeaderProps["content"]>["links"];

export const DesktopNav = ({ links, activeSection }: { links: Links; activeSection: string | null }) => {
  const { isNotDesktop } = useWindowWidth();

  if (!links || isNotDesktop) {
    return null;
  }

  return (
    <nav className="desktop-xl:mr-12 mr-10 flex items-center">
      <ul className="flex items-center gap-4">
        {links.map((item) => (
          <li key={item.idSection}>
            <NavLink
              label={item.label}
              id={item.idSection}
              className="text-[16px] font-semibold"
              isActive={activeSection === item.idSection}
            />
          </li>
        ))}
      </ul>
    </nav>
  );
};
