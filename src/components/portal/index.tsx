"use client";

import { createPortal } from "react-dom";

interface IPortalProps {
    opened?: boolean;
    children: React.ReactNode;
}

export const Portal = ({ opened, children }: IPortalProps) => {
    if (!opened) {
        return null;
    }

    return createPortal(children, document.body);
};
