import { getStyles } from "./styles";
import { socialPlatformsIconsMap } from "@/constants";
import { ContactsContent, HeaderLink } from "@/schemas";

type FooterProps = {
  menu: HeaderLink[] | null;
  translations: (key: string) => string;
  contactsContent: ContactsContent | null;
};

export const Footer = ({ contactsContent, menu, translations }: FooterProps) => {
  const styles = getStyles();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div>
          <h2 className={styles.title}>{contactsContent?.title}</h2>
          <p className={styles.text}>{contactsContent?.description}</p>
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
          © {new Date().getFullYear()}. {contactsContent?.copyright}
        </p>
        <p className={styles.text}>{contactsContent?.copyrightOwner}</p>
      </div>
    </footer>
  );
};
