"use client";

import { Toast } from "@/components";
import { ChildrenProps } from "@/types";

export const WidthToast = ({ children }: ChildrenProps) => {
  return (
    <>
      {children}
      <Toast
        limit={5}
        draggable
        rtl={false}
        closeOnClick
        pauseOnHover
        autoClose={3000}
        pauseOnFocusLoss
        newestOnTop={false}
        position="top-right"
        hideProgressBar={false}
      />
    </>
  );
};
