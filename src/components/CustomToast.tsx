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

  const bgClass = useMemo(() => {
    switch (type) {
      case "success":
        return "bg-green-500";
      case "error":
        return "bg-red-500";
      case "warning":
        return "bg-yellow-400 text-black";
      case "info":
      default:
        return "bg-blue-500";
    }
  }, [type]);

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`absolute top-4 right-4 p-4 z-[1000] min-w-[280px] max-w-[520px] ${bgClass} rounded-md text-xs md:text-sm text-white shadow-lg ${customStyle || ""}`}
      onClick={() => {
        setToast && setToast(false);
        setToastContent && setToastContent({});
        onClose && onClose();
      }}
    >
      {message}
    </div>
  );
};

export default CustomToast;
