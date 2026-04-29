import { SocialLink } from "@/schemas";
import { socialPlatformsIconsMap } from "@/constants";

export const SocialLinkList = ({ socialLinks }: { socialLinks: SocialLink[] }) => {
  return (
    <ul className="tablet:flex hidden items-center gap-2">
      {socialLinks.map((item) => {
        const Icon = socialPlatformsIconsMap[item.platform];

        return (
          <li key={item.href} className="flex items-center">
            <a
              href={item.href}
              className="focus:border-accent hover:border-accent inline-block rounded-xs border active:border-2"
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
