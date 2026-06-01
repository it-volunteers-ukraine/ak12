import { StepCard } from "./card";
import { MobilizationContent } from "@/schemas";
import { getMobilizationStyles } from "./styles";

interface MobilizationProps {
  content: MobilizationContent;
  buttonComponent: React.ReactNode;
}

export const Mobilization = ({ content, buttonComponent }: MobilizationProps) => {
  const styles = getMobilizationStyles();

  return (
    <div className={styles.container}>
      <div className={styles.containerCards}>
        {content.cards.map((card, index) => (
          <StepCard
            key={index}
            content={card}
            step={index + 1}
            buttonComponent={index === 0 ? buttonComponent : undefined}
          />
        ))}
      </div>
      <div className={styles.containerContent}>
        <p className={styles.primaryDescription}>{content.primaryDescription + " "}</p>
        <p className={styles.accentedDescription}>{content.accentedDescription}</p>
        <p className={styles.secondaryDescription}>{content.secondaryDescription}</p>
      </div>
    </div>
  );
};
