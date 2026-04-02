import { Locale } from "@/types";
import { getStyles } from "./styles";
import { socialPlatformsIconsMap } from "@/constants";
import { ContactsContent, HeaderLink } from "@/schemas";

type FooterProps = {
  locale: Locale;
  menu: HeaderLink[] | null;
  translations: (key: string) => string;
  contactsContent: ContactsContent | null;
};

export const defaultMenu = {
  uk: [
    {
      idSection: "aboutthebuilding",
      label: "Про корпус",
    },
    { idSection: "subdivisions", label: "Підрозділи" },
    { idSection: "services", label: "Як долучитись" },
    { idSection: "careers", label: "Вакансії" },
    { idSection: "contact", label: "Контакти" },
  ],
  en: [
    {
      idSection: "aboutthebuilding",
      label: "About the casern",
    },
    { idSection: "subdivisions", label: "Subdivisions" },
    { idSection: "services", label: "How to join" },
    { idSection: "careers", label: "Vacancies" },
    { idSection: "contact", label: "Contacts" },
  ],
};

export const Footer = ({ contactsContent, menu, translations, locale }: FooterProps) => {
  const styles = getStyles();
  const listMenu = menu ? menu : defaultMenu[locale];

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div>
          <h2 className={styles.title}>{translations("title")}</h2>
          <p className={styles.text}>{translations("description")}</p>
        </div>
        <nav>
          <p className={styles.subTitle}>{translations("navigation")}</p>

          <ul className={styles.menuList}>
            {listMenu.map((item) => {
              return (
                <li key={item.label}>
                  <a href={`#${item.idSection}`} className={styles.link}>
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        {contactsContent?.contacts && contactsContent?.contacts.length > 0 && (
          <div>
            <p className={styles.subTitle}>{translations("contact")}</p>
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

        {contactsContent?.socialLinks && contactsContent?.socialLinks.length > 0 && (
          <div>
            <p className={styles.subTitle}>{translations("social")}</p>
            <ul className="flex gap-3">
              {contactsContent.socialLinks.map((item) => {
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
          © {new Date().getFullYear()}. {translations("copyright")}
        </p>
        <p className={styles.text}>{translations("copyrightOwner")}</p>
      </div>
    </footer>
  );
};
