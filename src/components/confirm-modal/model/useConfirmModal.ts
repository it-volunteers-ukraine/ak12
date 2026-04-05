import { useState } from "react";

export const useConfirmModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [onConfirm, setOnConfirm] = useState<(() => void) | null>(null);

    const openModal = (confirmAction: () => void) => {
        setOnConfirm(() => confirmAction);
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
        setOnConfirm(null);
    };

    const handleConfirm = () => {
        if (onConfirm) {
            onConfirm();
        }
        closeModal();
    };

    return { isOpen, openModal, closeModal, handleConfirm };
};
