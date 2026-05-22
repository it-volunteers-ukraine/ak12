import { SocialPlatform, socialPlatformsIconsMap } from "@/constants";
import { SocialLink } from "@/schemas";

interface SocialMediaProps {
  title: string;
  socialLinks: SocialLink[];
}

export const SocialMedia = ({ title, socialLinks }: SocialMediaProps) => {
  return (
    <div className="border-dark-gray desktop-xl:py-14 tablet:py-10 tablet:px-6 desktop:p-10 w-auto rounded-xs border px-4 py-7">
      <h3 className="text-soft-blush font-ermilov desktop:mb-10 mb-4 text-[20px]/7 uppercase">{title}</h3>
      <ul className="desktop-xl:grid-cols-2 grid grid-cols-1 gap-4">
        {socialLinks.map((link, index) => {
          const Icon = socialPlatformsIconsMap[link.platform];

          return (
            <li
              key={link.href + index}
              className="bg-surface-main hover:bg-charcoal border-accent/50 w-full rounded-xs border transition-colors"
            >
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent font-ermilov flex items-center justify-center gap-2 py-3 text-[20px] capitalize"
              >
                {link.platform === SocialPlatform.OTHER ? "Link" : link.platform}
                <Icon className="h-6 w-6" />
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
