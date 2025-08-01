import Button from "@/components/ui/Button";

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

export const ConfirmationModal = ({
                                    isOpen,
                                    title,
                                    message,
                                    onConfirm,
                                    onCancel,
                                    confirmText = "Confirmar",
                                    cancelText = "Cancelar",
                                  }: ConfirmationModalProps) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{backgroundColor: 'rgba(0, 0, 0, 0.9)'}}
    >
      {/* Conteúdo do Modal */}
      <div className="w-full max-w-lg">
        <div
          className="p-8 pixel-border space-y-6 rounded text-center"
          style={{backgroundColor: "#252637"}}
        >
          <h2 className="text-2xl text-yellow-300 [text-shadow:2px_2px_0_#000]">
            {title}
          </h2>
          <p className="text-white leading-relaxed">{message}</p>
          <div className="flex justify-center gap-4 !mt-8">
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              className="w-1/2"
            >
              {cancelText}
            </Button>
            <Button
              type="button"
              variant="danger"
              onClick={onConfirm}
              className="w-1/2"
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};