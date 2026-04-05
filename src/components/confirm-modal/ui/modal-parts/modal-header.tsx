import { ChildrenProps } from "@/types";

export const ModalHeader = ({ children }: ChildrenProps) => {
  return <div className="text-2xl text-gray-600">{children}</div>;
};
