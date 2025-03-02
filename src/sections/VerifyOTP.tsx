import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import secureLocalStorage from "react-secure-storage";
import OtpInput from "react-otp-input";

import Button from "../components/Button";
import BoundingBox from "../components/BoundingBox";
import CustomToast, { ToastContent } from "../components/CustomToast";

const VerifyOTP: React.FC = () => {
  const navigate = useNavigate();

  // State Management
  const [otp, setOTP] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [toast, setToast] = useState<{ open: boolean; content: ToastContent }>({
    open: false,
    content: {},
  });

  /**
   * Utility function to show toast messages
   */
  const showToast = (message: string, type: "success" | "error" = "error") => {
    setToast({
      open: true,
      content: { message, type },
    });
  };

  /**
   * Handles OTP verification submission
   */
  const handleVerifyOTP = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (otp.length !== 6 || isNaN(Number(otp))) {
      showToast("Please enter a valid 6-digit OTP", "error");
      return;
    }

    try {
      const id = secureLocalStorage.getItem("id");
      if (!id) throw new Error("User ID not found.");

      const token = Cookies.get("jwtToken");
      if (!token) throw new Error("Authentication token missing.");

      setLoading(true);

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/auth/verifyotp/${id}`,
        { otp },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.message === "verified") {
        showToast("OTP verified successfully!", "success");

        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        showToast(response.data.message, "error");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      showToast("Failed to verify OTP. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles OTP resend request
   */
  const handleResendClick = async () => {
    try {
      const token = Cookies.get("jwtToken");
      const id = secureLocalStorage.getItem("id");
      const email = secureLocalStorage.getItem("email");

      if (!id || !email) {
        showToast("User information missing. Please log in again.", "error");
        return;
      }

      setResending(true);

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/auth/resendotp/${id}`,
        { email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.message) {
        showToast(response.data.message, "success");
      }
    } catch (error) {
      console.error("Error resending OTP:", error);
      showToast("Failed to resend OTP. Please try again.", "error");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="w-full flex-grow h-[100vh] md:h-full relative flex justify-center items-center text-dark p-4 md:p-12">
      {toast.open && (
        <CustomToast
          setToast={(open) => 
            setToast((prev) => ({
              ...prev,
              open: typeof open === "function" ? open(prev.open) : open, // Ensures compatibility
            }))
          }
          setToastContent={(content) =>
            setToast((prev) => ({
              ...prev,
              content: { ...prev.content, ...content },
            }))}
          {...toast.content}
        />
      )}

      <BoundingBox>
        <div className="w-full relative z-[100] flex justify-between flex-col md:flex-row mt-8">
          <div className="heading text-center md:text-left">
            <h1 className={`text-prime font-bold whitespace-pre-line transition-all duration-500 ease-in-out text-5xl lg:text-3/2 lg:mt-5 mb-10`}>
              MOZILLA </h1>
            <h1 className={`text-prime font-bold whitespace-pre-line transition-all duration-500 ease-in-out text-5xl lg:text-3/2 lg:mt-5 `}>FIREFOX
            </h1>

            <div className="text-light text-base md:text-xl sm:text-2xl lg:mt-4 block text-center  lg:text-left">
              IS RECRUITING
            </div>

            <div className="mt-6 text-xs md:text-base">
              <div className="text-white -mb-4">Have An Account ??</div>
            </div>
            <div className="mt-6 text-xs md:text-base">
              <NavLink className="nes-btn" to="/">
                Log In &rarr;
              </NavLink>
            </div>
          </div>

          <div className="flex-grow h-full p-4 md:p-8 md:mt-24 flex justify-center items-center ">
            <form
              className="flex flex-col gap-3 md:gap-6 w-full md:w-fit sm:w-fit justify-center items-center mx-auto"
              onSubmit={handleVerifyOTP}
            >
              <OtpInput
                value={otp}
                onChange={setOTP}
                numInputs={6}
                renderSeparator={<span className="hidden md:block">-</span>}
                renderInput={(props) => (
                  <input
                    {...props}
                    className="otp aspect-square nes-input is-dark text-white text-center"
                    maxLength={1}
                  />
                )}
              />

              <button
                onClick={handleResendClick}
                className="nes-btn text-xs"
                type="button"
                disabled={resending}
              >
                {resending ? "Resending OTP..." : "Resend OTP"}
              </button>

              <Button submit disabled={loading}>
                {loading ? (
                  <div className="flex items-center justify-center gap-4">
                    <span>Verifying...</span>
                    <img src="/loader.png" alt="loading" className="w-6 animate-spin invert" />
                  </div>
                ) : (
                  "Verify"
                )}
              </Button>
            </form>
          </div>
        </div>

        <img
          src="/background.png"
          alt=""
          className="hidden md:block absolute bottom-0 invert brightness-[50%] left-0 scale-95"
        />

        <div className="absolute bottom-0 w-full md:hidden">
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

export default VerifyOTP;