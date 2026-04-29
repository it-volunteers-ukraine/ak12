"use client";

import { useLocale } from "next-intl";
import { useState, useRef, useId } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";

import { cn } from "@/utils";
import { useOutsideClick } from "@/hooks";
import { ActiveLanguage, Locale } from "@/types";
import { AngleIcon } from "../../../public/icons";

export default function LanguageSwitcher({ className }: { className?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const menuId = useId();

  const isUk = locale === ActiveLanguage.UK;

  useOutsideClick(() => setIsOpen(false), menuRef);

  const switchLanguage = (nextLocale: Locale) => {
    setIsOpen(false);

    triggerRef.current?.focus();

    if (locale !== nextLocale) {
      router.replace(pathname, { locale: nextLocale });
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={menuId}
        aria-label="Change language"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "text-soft-blush focus:border-accent flex h-6 w-12 items-center justify-between border border-transparent px-0.5 py-1 text-[14px] font-bold transition-colors focus:ring-0 focus:outline-none",
          !isOpen && "focus:bg-dark-khaki hover:bg-olive-brown hover:border-accent/50 rounded-xs",
          isOpen && "bg-dark-khaki hover:border-accent/50 rounded-t-xs",
          className,
        )}
      >
        {isUk ? "Укр" : "Eng"}
        <AngleIcon className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
      </button>

      <div
        id={menuId}
        role="listbox"
        aria-label="Language options"
        className={cn(
          "bg-disabled absolute top-full left-0 z-50 flex h-6 w-12 origin-top flex-col rounded-b-xs shadow-lg transition-all duration-200 ease-in-out",
          isOpen ? "pointer-events-auto scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0",
          className,
        )}
        inert={!isOpen ? true : undefined}
        aria-hidden={!isOpen}
      >
        <button
          type="button"
          role="option"
          aria-selected={false}
          tabIndex={!isOpen ? -1 : 0}
          onClick={() => switchLanguage(isUk ? ActiveLanguage.EN : ActiveLanguage.UK)}
          className="text-soft-blush hover:border-accent/50 focus:border-accent flex h-6 w-full items-center justify-center rounded-b-xs border border-transparent px-0.5 py-1 text-[14px] font-bold transition-colors focus:ring-0 focus:outline-none"
        >
          {isUk ? "Eng" : "Укр"}
        </button>
      </div>
    </div>
  );
}
