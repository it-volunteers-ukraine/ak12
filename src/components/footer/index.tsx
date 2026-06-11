"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

import { scrollToSection } from "@/utils";
import { ContactsType } from "@/constants";
import { HeaderLink, FooterContent, ContactsSchema } from "@/schemas";

import { getStyles } from "./styles";
import { Logo } from "../../../public/images";
import { SocialLinkList } from "../socialLinkList";

type FooterProps = {
  menu: HeaderLink[] | null;
  content: FooterContent | null;
  contacts: ContactsSchema | null;
};

export const Footer = ({ contacts, content, menu }: FooterProps) => {
  const t = useTranslations("footer");
  const styles = getStyles();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.containerTitle}>
          <div className="mb-4 flex items-center gap-2">
            <Image
              width={35}
              height={40}
              alt="Company logo"
              src={content?.logoImg?.secureUrl || Logo}
              className="h-7 w-6"
            />
            <h2 className={"text-soft-blush font-ermilov text-[20px]"}>{content?.title}</h2>
          </div>
          <p className={styles.text}>{content?.description}</p>
        </div>

        <div className={styles.containerNavAndContact}>
          {menu && menu.length > 0 && (
            <nav>
              <p className={styles.subTitle}>{t("navigation")}</p>

              <ul className={styles.menuList}>
                {menu.map((item, index) => {
                  return (
                    <li key={item.idSection || index} className="flex h-5 items-center">
                      <a
                        href={`#${item.idSection}`}
                        onClick={(event) => {
                          if (!item.idSection) {
                            return;
                          }

                          event.preventDefault();
                          window.requestAnimationFrame(() => scrollToSection(item.idSection));
                        }}
                        className={styles.link}
                      >
                        {item.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>
          )}

          {contacts?.info && contacts.info.length > 0 && (
            <div className="justify-self-end">
              <p className={styles.subTitle}>{t("contact")}</p>
              <ul className="tablet:gap-4 flex flex-col gap-2">
                {contacts.info.map((item, index) => {
                  let href = item.href;
                  let textLink = item.textHref;

                  if (item.type === ContactsType.PHONE) {
                    href = `tel:${href}`;
                    textLink = item.href;
                  } else if (item.type === ContactsType.EMAIL) {
                    href = `mailto:${href}`;
                    textLink = item.href;
                  }

                  return (
                    <li key={item.href + index} className="flex flex-col gap-1">
                      <p className={styles.labelContacts}>{item.label}</p>
                      <a href={href} className={styles.textContacts} target="_blank" rel="noopener noreferrer">
                        {textLink}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {contacts?.socialLinks && contacts.socialLinks.length > 0 && (
            <div>
              <p className={styles.socialTitle}>{t("social")}</p>
              <SocialLinkList isFooter socialLinks={contacts.socialLinks} />
            </div>
          )}
        </div>
      </div>
      <div className={styles.containerCopyright}>
        <p className={styles.copyrightText}>
          © {new Date().getFullYear()}. {content?.copyright}
        </p>
        <p className={styles.copyrightText}>{content?.copyrightOwner}</p>
      </div>
    </footer>
  );
};
