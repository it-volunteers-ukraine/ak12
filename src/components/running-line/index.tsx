"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import { cn } from "@/utils";
import { MarqueeItem } from "../marquee-item";

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
    <div className="relative w-full overflow-hidden">
      <div
        ref={contentRef}
        aria-hidden="true"
        className="pointer-events-none absolute flex whitespace-nowrap opacity-0"
      >
        {itemList.map((item, index) => (
          <MarqueeItem key={`measure-${index}`} item={item} index={index} />
        ))}
      </div>
      <Link href="#vacancy" ref={containerRef} className="box-marquee bg-accent group flex h-16 w-full items-center">
        <div
          className={cn(
            "flex items-center whitespace-nowrap group-hover:[animation-play-state:paused]",
            isRunningAnimation && "animation-marquee",
          )}
        >
          {items.map((item, index) => (
            <MarqueeItem key={`item-${index}`} item={item} index={index} />
          ))}
        </div>
      </Link>
    </div>
  );
};
