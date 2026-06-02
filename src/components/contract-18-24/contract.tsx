import Image from "next/image";

import { CornerFrame } from "../cornerFrame";
import { getContractStyles } from "./styles";
import { Contract1824Content } from "@/schemas";
import { BadgeIcon, HeadingIcon, ThumbsupIcon, WalletIcon } from "../../../public/icons";
import { useTranslations } from "next-intl";

interface ContractProps {
  content: Contract1824Content;
  buttonComponent?: React.ReactNode;
}

const iconsList = [BadgeIcon, ThumbsupIcon, WalletIcon];

export const Contract = ({ content, buttonComponent }: ContractProps) => {
  const styles = getContractStyles();

  const t = useTranslations("contractSection");

  return (
    <div className={styles.container}>
      <div className={styles.subContainer}>
        <div>
          <h3 className={styles.title}>{content.title}</h3>
          <p className={styles.subtitle}>{content.subtitle}</p>
          <div className={styles.contactContainer}>
            <p className={styles.contactStartText}>{content.contact.startText + " "}</p>
            <a href={`tel:${content.contact.number}`} className={styles.contactNumber}>
              {content.contact.number}
            </a>
            <p className={styles.contactEndText}>{" " + content.contact.endText}</p>
          </div>
          <div className={styles.contentContainer}>
            {content.content.map((item, index) => {
              const Icon = iconsList[index];

              return (
                <div key={item.title} className={styles.listContainer}>
                  <div className={styles.listSubContainer}>
                    {Icon && <Icon className={styles.icon} />}
                    <div>
                      <p className={styles.itemTitle}>{item.title}</p>
                      <p className={styles.itemSubtitle}>{item.subtitle}</p>
                    </div>
                  </div>
                  {content.content.length - 1 !== index && <div className="bg-accent h-full w-px" />}
                </div>
              );
            })}
          </div>
          {buttonComponent}
        </div>
        {content.imgContent.backgroundImage?.secureUrl && (
          <div className={styles.imgContainer}>
            <Image
              width={800}
              height={600}
              className={styles.img}
              alt={t("altPhotoText")}
              src={content.imgContent.backgroundImage.secureUrl}
            />
            <div className={styles.imgPostContainer}>
              <div className={styles.titleContainer}>
                <HeadingIcon className={styles.imgIcon} />
                <p className={styles.imgTitle}>{content.imgContent.title}</p>
              </div>
              <p className={styles.imgSubtitle}>{content.imgContent.subtitle}</p>
            </div>
            <CornerFrame className={styles.cornerFrame} />
          </div>
        )}
      </div>
    </div>
  );
};
