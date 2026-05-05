import { socialPlatformsIconsMap } from "@/constants";
import { SocialLink } from "@/schemas";
import { cn } from "@/utils";

export const SocialLinkList = ({ socialLinks, isFooter }: { socialLinks: SocialLink[]; isFooter?: boolean }) => {
  return (
    <ul className={cn("", isFooter && "flex gap-3", !isFooter && "tablet:flex hidden items-center gap-2")}>
      {socialLinks.map((item, index) => {
        const Icon = socialPlatformsIconsMap[item.platform];

        return (
          <li key={item.href + index} className="flex h-6 w-6 items-center">
            <a
              href={item.href}
              className="focus:border-accent hover:border-accent inline-block rounded-xs border border-transparent active:border-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon className="text-soft-blush h-full w-full" />
            </a>
          </li>
        );
      })}
    </ul>
  );
};
