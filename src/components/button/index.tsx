"use client";

interface IButton {
  title: string;
}

export const Button = ({ title }: IButton) => {
  return <button className="rounded bg-green-600 px-4 py-2 text-white">{title}</button>;
};
