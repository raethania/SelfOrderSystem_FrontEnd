import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
    className?: string;
    maxWidth?: string;
};

export function Modal({
    isOpen,
    onClose,
    title,
    children,
    className,
    maxWidth = "max-w-lg",
}: ModalProps) {
    // Close on Escape
    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            if (e.key === "Escape") onClose();
        }
        if (isOpen) {
            document.addEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "hidden";
        }
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "";
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={onClose}
            />

            {/* Modal content */}
            <div
                className={cn(
                    "relative w-full bg-card rounded-2xl shadow-xl ring-1 ring-foreground/10 animate-in zoom-in-95 fade-in duration-200",
                    maxWidth,
                    className
                )}
            >
                {/* Header */}
                {title && (
                    <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                        <h2 className="text-lg font-semibold text-foreground">
                            {title}
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-1.5 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>
                )}

                {/* Body */}
                <div className="px-6 py-5 max-h-[75vh] overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    );
}

/**
 * Confirm delete modal
 */
type ConfirmModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message?: string;
    confirmLabel?: string;
    isLoading?: boolean;
};

export function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title = "Confirm Delete",
    message = "Are you sure you want to delete this item? This action cannot be undone.",
    confirmLabel = "Delete",
    isLoading = false,
}: ConfirmModalProps) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-sm">
            <p className="text-sm text-muted-foreground mb-6">{message}</p>
            <div className="flex gap-3">
                <button
                    onClick={onClose}
                    disabled={isLoading}
                    className="flex-1 h-10 rounded-lg border border-border text-sm font-medium hover:bg-accent transition-colors disabled:opacity-50"
                >
                    Cancel
                </button>
                <button
                    onClick={onConfirm}
                    disabled={isLoading}
                    className="flex-1 h-10 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                    {isLoading ? "Deleting..." : confirmLabel}
                </button>
            </div>
        </Modal>
    );
}
