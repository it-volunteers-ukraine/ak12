import { getStyles } from "./styles";
import { socialPlatformsIconsMap } from "@/constants";
import { FooterContent, HeaderLink, SocialLink } from "@/schemas";
import Image from "next/image";
import { Logo } from "../../../public/images";

type FooterProps = {
  menu: HeaderLink[] | null;
  translations: (key: string) => string;
  content: FooterContent | null;
  socialLinks: SocialLink[] | null;
  contacts: { label: string; href: string }[] | null;
};

export const Footer = ({ socialLinks, contacts, content, menu, translations }: FooterProps) => {
  const styles = getStyles();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div>
          <div className="mb-4 flex items-center gap-2">
            <Image
              width={35}
              height={40}
              alt="Company logo"
              src={content?.logoImg?.secureUrl || Logo}
              className="tablet:h-10 tablet:w-8.75 h-6 w-5.25"
            />
            <h2 className={"text-soft-blush font-ermilov text-[20px]"}>{content?.title}</h2>
          </div>
          <p className={styles.text}>{content?.description}</p>
        </div>

        {menu && menu.length > 0 && (
          <nav>
            <p className={styles.subTitle}>{translations("navigation")}</p>

            <ul className={styles.menuList}>
              {menu.map((item, index) => {
                return (
                  <li key={item.idSection || index}>
                    <a href={`#${item.idSection}`} className={styles.link}>
                      {item.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        )}

        {contacts && contacts.length > 0 && (
          <div>
            <p className={styles.subTitle}>{translations("contact")}</p>
            <ul className="flex flex-col gap-2">
              {contacts.map((item) => {
                let href = item.href;

                if (href[0] === "+" || /^\d+$/.test(href.replace(/\D/g, ""))) {
                  href = `tel:${href}`;
                } else if (href.includes("@")) {
                  href = `mailto:${href}`;
                }

                return (
                  <li key={item.href}>
                    <p className={styles.labelContacts}>{item.label}</p>
                    <a href={href} className={styles.textContacts} target="_blank" rel="noopener noreferrer">
                      {item.href}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {socialLinks && socialLinks.length > 0 && (
          <div>
            <p className={styles.subTitle}>{translations("social")}</p>
            <ul className="flex gap-3">
              {socialLinks.map((item) => {
                const Icon = socialPlatformsIconsMap[item.platform];

                return (
                  <li className="h-6 w-6" key={item.href}>
                    <a className={styles.socialLink} href={item.href} target="_blank" rel="noopener noreferrer">
                      <Icon className="h-full w-full" />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
      <div className={styles.containerCopyright}>
        <p className={styles.text}>
          © {new Date().getFullYear()}. {content?.copyright}
        </p>
        <p className={styles.text}>{content?.copyrightOwner}</p>
      </div>
    </footer>
  );
};
