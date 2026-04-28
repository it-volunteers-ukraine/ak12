import { CloseIcon } from "../../../public/icons";
import { Links } from "./desktopNav";

import { NavLink } from "./navLink";

export const MobileNav = ({
  links,
  onClose,
  activeSection,
}: {
  links: Links;
  onClose: () => void;
  activeSection: string | null;
}) => {
  if (!links) {
    return null;
  }

  return (
    <nav>
      <button
        onClick={onClose}
        aria-label="Close menu"
        className="hover:text-accent/50 focus:text-accent/50 p-4 text-white transition-colors"
      >
        <CloseIcon className="h-6 w-6" />
      </button>

      <ul className="flex flex-col items-center">
        {links.map((item) => (
          <li key={item.idSection} className="p-2.5">
            <NavLink
              type="mobile"
              onClick={onClose}
              label={item.label}
              id={item.idSection}
              className="font-ermilov text-[18px]"
              isActive={activeSection === item.idSection}
            />
          </li>
        ))}
      </ul>
    </nav>
  );
};
