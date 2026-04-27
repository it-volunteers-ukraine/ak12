import { Button } from "../button";
import { WrapperModal } from "../wrapper-modal/ui";

interface IConfirmModal {
  title?: string;
  isOpen: boolean;
  content?: string;
  isLoading?: boolean;
  onClose: () => void;
  cancelButtonText?: string;
  handleConfirm: () => void;
  confirmButtonText?: string;
}

export const ConfirmModal = ({
  title,
  isOpen,
  content,
  onClose,
  isLoading,
  handleConfirm,
  cancelButtonText,
  confirmButtonText,
}: IConfirmModal) => {
  return (
    <WrapperModal isOpen={isOpen} onClose={onClose}>
      <WrapperModal.ModalTitle>{title}</WrapperModal.ModalTitle>
      <WrapperModal.ModalContent>{content}</WrapperModal.ModalContent>
      <WrapperModal.ModalFooter>
        <Button
          type="button"
          variant="primary"
          isLoading={isLoading}
          onClick={handleConfirm}
          className="w-full rounded-full"
        >
          {confirmButtonText || "Так, зберегти"}
        </Button>
        <Button type="button" variant="danger" onClick={onClose} className="w-full rounded-full" disabled={isLoading}>
          {cancelButtonText || "Скасувати"}
        </Button>
      </WrapperModal.ModalFooter>
    </WrapperModal>
  );
};
