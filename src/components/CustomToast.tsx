import { useEffect, useMemo } from "react";

export type ToastContent = {
  type?: "success" | "error" | "info" | "warning" | string;
  message?: string;
  duration?: number;
  customStyle?: string;
};

interface Props {
  type?: "success" | "error" | "info" | "warning" | string;
  message?: string;
  duration?: number;
  customStyle?: string;
  setToast?: React.Dispatch<React.SetStateAction<boolean>>;
  setToastContent?: React.Dispatch<React.SetStateAction<ToastContent>>;
  onClose?: () => void;
}

const CustomToast = ({
  type = "info",
  message,
  duration = 3000,
  customStyle,
  setToast,
  setToastContent,
  onClose,
}: Props) => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      setToast && setToast(false);
      setToastContent && setToastContent({});
      onClose && onClose();
    }, duration);
    return () => clearTimeout(timeout);
  }, [duration, onClose, setToast, setToastContent]);

  const toastStyles = useMemo(() => {
    switch (type) {
      case "success":
        return {
          bg: "bg-green-600",
          border: "border-2 border-green-400",
          text: "text-white",
          shadow: "shadow-green-500/30",
        };
      case "error":
        return {
          bg: "bg-red-600",
          border: "border-2 border-red-400",
          text: "text-white",
          shadow: "shadow-red-500/30",
        };
      case "warning":
        return {
          bg: "bg-yellow-500",
          border: "border-2 border-yellow-400",
          text: "text-black",
          shadow: "shadow-yellow-500/30",
        };
      case "info":
      default:
        return {
          bg: "bg-blue-600",
          border: "border-2 border-blue-400",
          text: "text-white",
          shadow: "shadow-blue-500/30",
        };
    }
  }, [type]);

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`fixed top-4 right-4 p-4 z-[10000] min-w-[280px] max-w-[520px] ${toastStyles.bg} ${toastStyles.border} ${toastStyles.text} rounded-lg text-xs md:text-sm font-medium shadow-lg ${toastStyles.shadow} cursor-pointer transition-all duration-300 hover:scale-[1.02] ${customStyle || ""}`}
      style={{ fontFamily: "'Press Start 2P', system-ui, sans-serif" }}
      onClick={() => {
        setToast && setToast(false);
        setToastContent && setToastContent({});
        onClose && onClose();
      }}
    >
      <div className="flex items-center gap-3">
        <span className="text-lg">
          {type === "success" && "✓"}
          {type === "error" && "✕"}
          {type === "warning" && "⚠"}
          {type === "info" && "ℹ"}
        </span>
        <span>{message}</span>
      </div>
    </div>
  );
};

export default CustomToast;
