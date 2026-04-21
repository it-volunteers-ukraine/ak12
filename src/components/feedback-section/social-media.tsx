import { socialPlatformsIconsMap } from "@/constants";
import { SocialLink } from "@/schemas";

interface SocialMediaProps {
  title: string;
  socialLinks: SocialLink[];
}

export const SocialMedia = ({ title, socialLinks }: SocialMediaProps) => {
  return (
    <div className="border-dark-gray w-auto rounded-xs border px-10 py-10">
      <h3 className="text-soft-blush font-ermilov mb-10 text-[20px]/7 uppercase">{title}</h3>
      <ul className="flex gap-4">
        {socialLinks.map((link) => {
          const Icon = socialPlatformsIconsMap[link.platform];

          return (
            <li
              key={link.href}
              className="bg-surface-main hover:bg-charcoal border-accent/50 w-full rounded-xs border transition-colors"
            >
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent font-ermilov flex justify-center gap-2 py-3 text-[16px] capitalize"
              >
                {link.platform}
                <Icon className="h-6 w-6" />
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
