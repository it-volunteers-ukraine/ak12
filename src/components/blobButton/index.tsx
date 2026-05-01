import React from "react";

import { cn } from "@/utils";

type BlobButtonProps = {
  href: string;
  className?: string;
  openInNewTab?: boolean;
  children: React.ReactNode;
  typeStyles?: "primary" | "sub";
};

export const BlobButton = ({
  href,
  children,
  className,
  openInNewTab = true,
  typeStyles = "primary",
}: BlobButtonProps) => {
  return (
    <a
      href={href}
      target={openInNewTab ? "_blank" : undefined}
      rel={openInNewTab ? "noopener noreferrer" : undefined}
      className={cn(
        "group relative flex h-10 w-50 scale-100 items-center justify-center focus:outline-none",
        className,
      )}
    >
      <svg
        fill="none"
        viewBox="0 0 200 40"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 -z-10 h-full w-full"
      >
        <path
          d="M4 1H146.729C147.111 1 147.489 1.0731 147.844 1.21484L156.413 4.64258C157.004 4.87882 157.634 5 158.271 5H196C197.657 5 199 6.34314 199 8V36C199 37.6569 197.657 39 196 39H20.7705C20.3888 39 20.0106 38.9269 19.6562 38.7852L2.88574 32.0771C1.74688 31.6215 1.00005 30.5186 1 29.292V4C1 2.34315 2.34315 1 4 1Z"
          className={cn(
            "fill-surface-main stroke-accent group-hover:stroke-accent/50 group-focus:stroke-accent/50 transition-colors",
            typeStyles === "primary" && "group-hover:fill-olive-brown",
            typeStyles === "sub" && "fill-soft-blush",
          )}
          strokeWidth="2"
        />
      </svg>

      {children}
    </a>
  );
};
