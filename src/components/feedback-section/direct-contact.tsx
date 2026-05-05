import { ContactsInfo } from "@/schemas";
import { AtIcon, LinkIcon, LocationIcon, PhoneIcon } from "../../../public/icons";
import { ContactsType } from "@/constants";

interface DirectContactProps {
  title: string;
  contacts: ContactsInfo[];
}

export const DirectContact = ({ title, contacts }: DirectContactProps) => {
  return (
    <div className="border-dark-gray w-auto rounded-xs border px-10 py-10">
      <h3 className="text-soft-blush font-ermilov mb-10 text-[20px]/7 uppercase">{title}</h3>
      <div className="flex flex-col gap-6">
        {contacts.map((contact, index) => {
          let href = contact.href;
          let textLink = contact.textHref;
          let Icon = null;

          if (contact.type === ContactsType.PHONE) {
            href = `tel:${href}`;
            textLink = contact.href;
            Icon = PhoneIcon;
          }

          if (contact.type === ContactsType.EMAIL) {
            href = `mailto:${href}`;
            textLink = contact.href;
            Icon = AtIcon;
          }

          if (contact.type === ContactsType.LOCATION) {
            Icon = LocationIcon;
          }

          if (contact.type === ContactsType.OTHER) {
            Icon = LinkIcon;
          }

          return (
            <div key={contact.href + index} className="flex gap-4">
              {Icon && <Icon className="border-accent text-accent bg-surface-main h-12 w-12 rounded-xs border p-3" />}
              <div>
                <p className="text-warm-gray text-[14px]">{contact.label}</p>
                <a
                  className="font-ermilov text-accent hover:text-accent/50 text-[20px] uppercase transition-colors"
                  href={href}
                >
                  {textLink}
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
