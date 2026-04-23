interface ResponseTimeProps {
  title: string;
  description: string;
}

export const ResponseTime = ({ title, description }: ResponseTimeProps) => {
  return (
    <div className="border-dark-gray w-auto rounded-xs border px-10 py-10">
      <h3 className="font-ermilov text-soft-blush mb-3 text-[20px] uppercase">{title}</h3>
      <p className="text-14px text-soft-blush">{description}</p>
    </div>
  );
};
