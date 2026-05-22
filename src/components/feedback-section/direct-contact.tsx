import { ContactsInfo } from "@/schemas";
import { AtIcon, LinkIcon, LocationIcon, PhoneIcon } from "../../../public/icons";
import { ContactsType } from "@/constants";

interface DirectContactProps {
  title: string;
  contacts: ContactsInfo[];
}

export const DirectContact = ({ title, contacts }: DirectContactProps) => {
  return (
    <div className="border-dark-gray desktop-xl:py-14 desktop:p-10 tablet:py-10 tablet:px-4 w-auto rounded-xs border px-4 py-7">
      <h3 className="text-soft-blush font-ermilov desktop:mb-10 mb-4 text-[20px]/7 uppercase">{title}</h3>
      <div className="desktop-xl:grid-cols-2 desktop:gap-6 grid gap-3">
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
            <div
              key={contact.href + index}
              className="tablet:items-start desktop-xl:items-center flex items-center gap-2"
            >
              {Icon && (
                <Icon className="border-accent text-accent bg-surface-main desktop-xl:h-12 desktop-xl:min-w-12 desktop-xl:p-3 desktop:h-8 desktop:min-w-8 desktop:p-1.5 tablet:h-6 tablet:min-w-6 tablet:p-1.25 h-12 min-w-12 rounded-xs border p-3" />
              )}
              <div>
                <p className="text-warm-gray text-[14px]/3.5 font-medium">{contact.label}</p>
                <a
                  className="text-accent desktop:text-[20px] hover:text-accent/50 text-[14px] font-extrabold break-all transition-colors"
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
