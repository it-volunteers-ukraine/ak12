import Image from "next/image";
import { useTranslations } from "next-intl";

import { TransferContent } from "@/schemas";
import { getTransferStyles } from "./styles";
import { BoltIcon, HeadsetIcon, HitMarkerIcon } from "../../../public/icons";

interface TransferProps {
  content: TransferContent;
  buttonComponent?: React.ReactNode;
}

const iconsList = [HeadsetIcon, HitMarkerIcon, BoltIcon];

export const Transfer = ({ content, buttonComponent }: TransferProps) => {
  const styles = getTransferStyles();

  const t = useTranslations("contractSection");

  return (
    <div className={styles.container}>
      <div className={styles.subContainer}>
        <h3 className={styles.title}>{content.title}</h3>
        <p className={styles.subTitle}>{content.subtitle}</p>
        <div className={styles.containerContent}>
          <p className={styles.startText}>{content.transferLink.startText + " "}</p>
          <p className={styles.link}>{content.transferLink.link}</p>
          <p className={styles.endText}>{content.transferLink.endText}</p>
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
        {content.backgroundImage?.secureUrl && (
          <Image
            width={800}
            height={600}
            alt={t("altPhotoText")}
            src={content.backgroundImage?.secureUrl}
            className={styles.img}
          />
        )}
      </div>
    </div>
  );
};
