"use client";

import { getCardStyles } from "./styles";
import { MobilizationCardContent } from "@/schemas";
import { BlockMobileIcon, BlockTabletIcon } from "../../../public/icons";

type StepCardProps = {
  step?: number;
  content: MobilizationCardContent;
  buttonComponent?: React.ReactNode;
};

export const StepCard = ({ step, content, buttonComponent }: StepCardProps) => {
  const styles = getCardStyles(!!buttonComponent);

  return (
    <div className={styles.container}>
      <BlockMobileIcon className={styles.iconMobile} preserveAspectRatio="none" />
      <BlockTabletIcon className={styles.iconTablet} preserveAspectRatio="none" />

      <div className={styles.containerContent}>
        <p className={styles.step}>0{step}</p>

        <h3 className={styles.title}>{content.title}</h3>

        <p className={styles.subTitle}>{content.subtitle}</p>

        <p className={styles.primaryDescription}>{content.primaryDescription}</p>

        {content.secondaryDescription && content.secondaryDescription !== "" && (
          <p className={styles.secondaryDescription}>{content.secondaryDescription}</p>
        )}

        {buttonComponent && <div className={styles.buttonContainer}>{buttonComponent}</div>}
      </div>
    </div>
  );
};
