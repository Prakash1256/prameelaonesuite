import { CheckCircle2, CircleAlert, X } from "lucide-react";
import { useEffect } from "react";
import { cn } from "../../lib/utils";

export type ToastMessage = {
  id: number;
  title: string;
  description: string;
  variant: "success" | "error";
};

type ToastProps = {
  toast: ToastMessage;
  onClose: () => void;
};

export function Toast({ toast, onClose }: ToastProps) {
  useEffect(() => {
    const timeoutId = window.setTimeout(onClose, 4000);

    return () => window.clearTimeout(timeoutId);
  }, [onClose, toast.id]);

  const isSuccess = toast.variant === "success";

  return (
    <div
      aria-live="polite"
      className={cn(
        "fixed right-4 top-4 z-50 flex w-[min(360px,calc(100%_-_32px))] items-start gap-3 rounded-md border bg-card p-4 shadow-lg",
        isSuccess ? "border-primary/25" : "border-destructive/30"
      )}
      role={isSuccess ? "status" : "alert"}
    >
      {isSuccess ? (
        <CheckCircle2 className="mt-0.5 shrink-0 text-primary" size={20} aria-hidden="true" />
      ) : (
        <CircleAlert className="mt-0.5 shrink-0 text-destructive" size={20} aria-hidden="true" />
      )}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-foreground">{toast.title}</p>
        <p className="mt-1 text-sm text-muted-foreground">{toast.description}</p>
      </div>
      <button
        aria-label="Dismiss notification"
        className="rounded-sm p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        onClick={onClose}
        title="Dismiss notification"
        type="button"
      >
        <X size={16} aria-hidden="true" />
      </button>
    </div>
  );
}
