interface ResponseTimeProps {
  title: string;
  description: string;
}

export const ResponseTime = ({ title, description }: ResponseTimeProps) => {
  return (
    <div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
};
