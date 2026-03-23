import Link from "next/link";

import { MenuContent } from "@/types";
import LanguageSwitcher from "../language-switcher";

type HeaderProps = {
  content: MenuContent;
};

export const Header = ({ content }: HeaderProps) => {
  return (
    <header className="px-40 flex justify-between">
      <p>logo</p>
      <nav>
        <ul className="flex gap-10">
          {content.navigation.map((item) => {
            return (
              <li key={item.id}>
                <Link href={`#${item.id}`}>{item.label}</Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <LanguageSwitcher />
      <ul className="flex gap-10">
        {content.social.map((item) => {
          return (
            <li key={item.id}>
              <a href={item.url} target="_blank" rel="noopener noreferrer">
                {item.label}
              </a>
            </li>
          );
        })}
      </ul>
    </header>
  );
};
