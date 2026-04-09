import { ChildrenProps } from "@/types";

export const ModalFooter = ({ children }: ChildrenProps) => {
  return <div className="flex justify-between gap-2">{children}</div>;
};
