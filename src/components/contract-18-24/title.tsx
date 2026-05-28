import { getTitleStyles } from "./styles";

interface TitleProps {
  title: string;
  subTitle: string;
}

export const Title = ({ title, subTitle }: TitleProps) => {
  const styles = getTitleStyles();

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.subTitle}>{subTitle}</p>
    </div>
  );
};
