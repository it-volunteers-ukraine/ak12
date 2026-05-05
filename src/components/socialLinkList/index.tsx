import { socialPlatformsIconsMap } from "@/constants";
import { SocialLink } from "@/schemas";

export const SocialLinkList = ({ socialLinks }: { socialLinks: SocialLink[] }) => {
  return (
    <ul className="tablet:flex hidden items-center gap-2">
      {socialLinks.map((item, index) => {
        const Icon = socialPlatformsIconsMap[item.platform];

        return (
          <li key={item.href + index} className="flex items-center">
            <a
              href={item.href}
              className="focus:border-accent hover:border-accent inline-block rounded-xs border border-transparent active:border-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon className="text-soft-blush h-4.5 w-4.5" />
            </a>
          </li>
        );
      })}
    </ul>
  );
};
