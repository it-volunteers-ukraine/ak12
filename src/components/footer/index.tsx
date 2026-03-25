import Link from "next/link";

import { ContactsContent, HeaderLink } from "@/schemas";

type FooterProps = {
  menu: HeaderLink[] | null;
  contactsContent: ContactsContent | null;
  translations: (key: string) => string;
};

export const Footer = ({ contactsContent, menu, translations }: FooterProps) => {
  return (
    <footer className="px-40 ">
      <div className="flex justify-between">
        <nav>
          <p className="uppercase text-xl mb-3 font-bold">{translations("navigation")}</p>
          {menu && (
            <ul className="flex flex-col gap-2">
              {menu.map((item) => {
                return (
                  <li key={item.href}>
                    <Link href={item.href}>{item.label}</Link>
                  </li>
                );
              })}
            </ul>
          )}
        </nav>
        <div>
          {contactsContent?.contacts && (
            <>
              <p className="uppercase text-xl mb-3 font-bold">{translations("contact")}</p>
              <ul className="flex flex-col gap-2">
                {contactsContent.contacts.map((item) => {
                  let href = item.href;

                  if (href[0] === "+" || /^\d+$/.test(href.replace(/\D/g, ""))) {
                    href = `tel:${href}`;
                  } else if (href.includes("@")) {
                    href = `mailto:${href}`;
                  }

                  return (
                    <li key={item.href}>
                      <p className="uppercase text-base font-bold">{item.label}</p>
                      <a href={href} target="_blank" rel="noopener noreferrer">
                        {item.href}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </div>
        <div>
          {contactsContent?.socialLinks && (
            <>
              <p className="uppercase text-xl mb-3 font-bold">{translations("social")}</p>
              <ul className="flex flex-col gap-2">
                {contactsContent.socialLinks.map((item) => {
                  return (
                    <li key={item.href}>
                      <a href={item.href} target="_blank" rel="noopener noreferrer">
                        {item.platform}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </div>
      </div>
      <p className="text-center">© 2026. {translations("copyright")}</p>
    </footer>
  );
};
