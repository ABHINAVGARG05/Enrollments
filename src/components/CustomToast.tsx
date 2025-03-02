import { useEffect } from "react";
export type ToastContent = {
  type?: string;
  message?: string;
  duration?: number;
  customStyle?: string;
};
interface Props {
  type?: string;
  message?: string;
  duration?: number;
  customStyle?: string;
  setToast?: React.Dispatch<React.SetStateAction<boolean>>;
  setToastContent?: React.Dispatch<React.SetStateAction<ToastContent>>;
  onClose?: () => void; 
}

const CustomToast = ({
  type,
  message,
  duration = 3000,
  customStyle,
  setToast,
  setToastContent,
  onClose,
}: Props) => {
  //   const [render, setRender] = useState(true);
  useEffect(() => {
    // setRender(true);
    const timeout = setTimeout(() => {
      //   setRender(false);
      setToast && setToast(false);
      setToastContent && setToastContent({});
      onClose && onClose();
    }, duration);
    return () => {
      clearTimeout(timeout);
    };
  }, []);
  //   if (!render) return null;
  return (
    <div
      className={`absolute top-4 right-4 p-4 z-[1000] min-w-[300px] max-w-[500px] ${
        type && type === "error" ? "bg-red-500" : "bg-green-500"
      } rounded-md text-xs text-white ${customStyle}`}
    >
      {message}
    </div>
  );
};

export default CustomToast;
