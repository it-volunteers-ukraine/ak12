import { z } from "zod";
import Link from "next/link";

import LanguageSwitcher from "../language-switcher";
import { headerContentSchema, SocialLink } from "@/schemas";

type HeaderProps = {
  socialLinks: SocialLink[] | null;
  content: z.infer<typeof headerContentSchema> | null;
};

export const Header = async ({ content, socialLinks }: HeaderProps) => {
  return (
    <header className="px-40 flex justify-between">
      <p>{content?.logoText || "Logo"}</p>
      <nav>
        {content?.links && (
          <ul className="flex gap-10">
            {content.links.map((item) => {
              return (
                <li key={item.href}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              );
            })}
          </ul>
        )}
      </nav>
      <LanguageSwitcher />
      {socialLinks && (
        <ul className="flex gap-10">
          {socialLinks.map((item) => {
            return (
              <a key={item.platform} href={item.href} target="_blank" rel="noopener noreferrer">
                {item.platform}
              </a>
            );
          })}
        </ul>
      )}
    </header>
  );
};
