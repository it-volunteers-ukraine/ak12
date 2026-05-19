interface ResponseTimeProps {
  title: string;
  description: string;
}

export const ResponseTime = ({ title, description }: ResponseTimeProps) => {
  return (
    <div className="border-dark-gray desktop-xl:py-14 tablet:py-10 tablet:px-6 desktop:p-10 w-auto rounded-xs border px-4 py-7">
      <h3 className="font-ermilov text-soft-blush mb-3 text-[20px] uppercase">{title}</h3>
      <p className="text-soft-blush text-[14px] font-medium">{description}</p>
    </div>
  );
};
