"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/utils";
import { BbmIcon, HelicopterIcon, TanksIcon } from "@/assets/icon";

const ICONS = [HelicopterIcon, BbmIcon, TanksIcon];
const WIDTH_MULTIPLIER = 1.5;

interface Props {
  itemList: string[];
}

export const RunningLine = ({ itemList }: Props) => {
  const containerRef = useRef<HTMLAnchorElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const [copies, setCopies] = useState(1);
  const [isRunningAnimation, setIsRunningAnimation] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;

    if (!container || !content) {
      return;
    }

    const calculate = () => {
      const containerWidth = container.offsetWidth;
      const singleWidth = content.scrollWidth;

      if (!containerWidth || !singleWidth) {
        return;
      }

      const targetWidth = containerWidth * WIDTH_MULTIPLIER;

      const neededCopies = Math.ceil(targetWidth / singleWidth);

      setCopies(neededCopies);
      setIsRunningAnimation(true);
    };

    calculate();

    const ro = new ResizeObserver(calculate);

    ro.observe(container);

    return () => ro.disconnect();
  }, [itemList]);

  const items: string[] = [];

  for (let i = 0; i < copies; i++) {
    items.push(...itemList);
  }

  return (
    <a
      href="#vacancy"
      ref={containerRef}
      className="box-marquee bg-accent flex h-16 w-full items-center overflow-hidden hover:cursor-pointer"
    >
      <div aria-hidden="true" className="pointer-events-none absolute top-0 left-0 -z-10 whitespace-nowrap opacity-0">
        <div ref={contentRef} className="flex items-center gap-8 px-8">
          {itemList.map((item, index) => {
            const Icon = ICONS[index % ICONS.length];

            return (
              <div key={`measure-${index}`} className="flex items-center gap-8">
                <Icon className="h-[50px] w-[50px]" />
                <span className="text-[24px] font-bold">{item}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className={cn("flex items-center gap-8 whitespace-nowrap", isRunningAnimation && "animation-marquee")}>
        {items.map((item, index) => {
          const Icon = ICONS[index % ICONS.length];

          return (
            <div key={`${index}-${item}`} className="flex items-center gap-8">
              <Icon className="text-neutral h-[50px] w-[50px]" />
              <span className="text-neutral text-[24px] font-bold">{item}</span>
            </div>
          );
        })}
      </div>
    </a>
  );
};
