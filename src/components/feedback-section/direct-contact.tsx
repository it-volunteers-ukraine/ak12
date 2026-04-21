import { autoPrefixHref } from "@/utils/autoPrefixHref";
import { AtIcon, PhoneIcon } from "../../../public/icons";

interface DirectContactProps {
  title: string;
  contacts: {
    label: string;
    href: string;
  }[];
}

export const DirectContact = ({ title, contacts }: DirectContactProps) => {
  return (
    <div className="border-dark-gray w-auto rounded-xs border px-10 py-10">
      <h3 className="text-soft-blush font-ermilov mb-10 text-[20px]/7 uppercase">{title}</h3>
      <div className="flex flex-col gap-6">
        {contacts.map((contact, index) => {
          const href = autoPrefixHref(contact.href);
          const uniqueKey = `${contact.href}-${index}`;

          if (href.startsWith("tel:")) {
            return (
              <ContactCard key={uniqueKey} contact={contact} href={href}>
                <PhoneIcon className="border-accent text-accent bg-surface-main h-12 w-12 rounded-xs border p-3" />
              </ContactCard>
            );
          }

          if (href.startsWith("mailto:")) {
            return (
              <ContactCard key={uniqueKey} contact={contact} href={href}>
                <AtIcon className="border-accent text-accent bg-surface-main h-12 w-12 rounded-xs border p-3" />
              </ContactCard>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
};

interface ContactCardProps {
  contact: {
    label: string;
    href: string;
  };
  href: string;
  children: React.ReactNode;
}

const ContactCard = ({ contact, href, children }: ContactCardProps) => {
  return (
    <div key={contact.href} className="flex gap-4">
      {children}
      <div>
        <p className="text-warm-gray text-[14px]">{contact.label}</p>
        <a
          className="font-ermilov text-accent hover:text-accent/50 text-[20px] uppercase transition-colors"
          href={href}
        >
          {contact.href}
        </a>
      </div>
    </div>
  );
};
