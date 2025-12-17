import axios from "axios";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import BoundingBox from "../components/BoundingBox";
import Button from "../components/Button";
import CustomToast, { ToastContent } from "../components/CustomToast";
import Input from "../components/Input";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const [openToast, setOpenToast] = useState(false);
  const [toastContent, setToastContent] = useState<ToastContent>({});
  const [regno, setRegno] = useState("");
  const [email, setEmail] = useState("");
  const [regnoError, setRegnoError] = useState("");
  const [emailError, setEmailError] = useState("");

  const isValidRegno = /^(23|24|25)[BM][A-Z]{2}\d{4}$/;
  const isValidEmail = /^[A-Za-z0-9._%+-]+@vitstudent\.ac\.in$/;

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setRegnoError("");
    setEmailError("");

    if (!isValidRegno.test(regno)) {
      setRegnoError(
        "Invalid Registration Number. Please enter a valid registration number."
      );
      return;
    }

    if (!isValidEmail.test(email)) {
      setEmailError(
        "Invalid Email Address. Please enter a valid VIT student email address."
      );
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/auth/requestPasswordReset`,
        { email, regno }
      );

      if (response) {
        setOpenToast(true);
        setToastContent({
          message: "Password reset link sent successfully",
        });
        toast.success("Password reset link sent successfully", {
          className: "custom-bg",
          autoClose: 3000,
          theme: "dark",
        });
        // console.log("response", response);
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
      setOpenToast(true);
      setToastContent({
        message: "An unexpected error occurred. Please try again later.",
        type: "error",
      });
      toast.error("An unexpected error occurred. Please try again later.", {
        className: "custom-bg-error",
        autoClose: 3000,
        theme: "dark",
      });
    }
  };

  return (
    <div className="w-full flex-grow h-[100vh] md:h-full relative flex justify-center items-center text-dark p-4 md:p-12">
      {openToast && (
        <CustomToast
          setToast={setOpenToast}
          setToastContent={setToastContent}
          message={toastContent.message}
          type={toastContent.type}
          customStyle={toastContent.customStyle}
          duration={toastContent.duration}
        />
      )}
      <BoundingBox className="overflow-hidden">
        <div className="w-full h-full relative z-[100] flex flex-col lg:flex-row">
          <div className="heading text-center lg:text-left">
            <h1 className="text-[2rem] md:text-[2.4rem] text-prime">
              MOZILLA FIREFOX
            </h1>
            <span className="text-light text-base md:text-2xl">
              IS RECRUITING
            </span>
            {/* <div className="mt-6 text-xs md:text-base">
              <Link className="nes-btn" to="/dashboard">
                Go to Dashboard &rarr;
              </Link>
            </div> */}
          </div>
          <div className="h-full p-8 md:p-8 mt-4 md:mt-0 ">
            <form
              className="flex flex-col gap-3 md:gap-6 w-full lg:w-[60%] mx-auto "
              onSubmit={handleLogin}
            >
              <Input
                label={"email"}
                placeholder="VIT-Email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value.toLowerCase().trim())}
                className=""
              />
              {emailError && (
                <p className="text-red-500 text-sm">{emailError}</p>
              )}
              <Input
                label={"regno"}
                placeholder="Registration Number"
                type="text"
                value={regno}
                onChange={(e) => setRegno(e.target.value.toUpperCase())}
                className=""
              />
              {regnoError && (
                <p className="text-red-500 text-sm">{regnoError}</p>
              )}
              <Button submit={true} className="w-full sm:w-auto mx-auto mb-10">
                Reset Password
              </Button>
            </form>
            <section className="text-center sm:mt-10  text-light w-full mx-auto">
              <div className="text-black text-sm md:text-lg cursor-pointer w-full sm:w-auto mx-auto">
                <NavLink
                  to="/"
                  className="text-black nes-btn is-error custom-nes-error block w-full sm:w-auto mx-auto"
                >
                  &larr; Back
                </NavLink>
              </div>
            </section>
          </div>
        </div>
        <img
          src="/background.png"
          alt=""
          className="hidden md:block absolute bottom-0 invert brightness-[50%] left-0 scale-95"
        />
        <div className="fixed bottom-0 w-full md:hidden">
          <img
            src="/empty-bg.png"
            alt=""
            className="w-[85%] mx-auto invert brightness-50 absolute bottom-8"
          />
          <img
            src="/Dino.png"
            alt=""
            className="invert w-20 absolute bottom-10"
          />
          <img
            src="/cacti.png"
            alt=""
            className="invert w-20 bottom-10 absolute right-20"
          />
          <img
            src="/cacti.png"
            alt=""
            className="invert w-10 bottom-10 absolute right-16"
          />
        </div>
      </BoundingBox>
    </div>
  );
};

export default ForgotPassword;
