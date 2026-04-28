import { SocialLink } from "@/schemas";
import { socialPlatformsIconsMap } from "@/constants";

export const SocialLinkList = ({ socialLinks }: { socialLinks: SocialLink[] }) => {
  return (
    <ul className="flex items-center gap-4">
      {socialLinks.slice(0, 2).map((item) => {
        const Icon = socialPlatformsIconsMap[item.platform];

        return (
          <li key={item.href} className="flex items-center">
            <a
              key={item.platform}
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
