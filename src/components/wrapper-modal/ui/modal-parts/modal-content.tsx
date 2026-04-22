import { ChildrenProps } from "@/types";

export const ModalContent = ({ children }: ChildrenProps) => {
  return <div className="text-md text-gray-600">{children}</div>;
};
