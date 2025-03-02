import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useState, useCallback } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import { toast } from "react-toastify";
import BoundingBox from "../components/BoundingBox";
import Button from "../components/Button";
import CustomToast, { ToastContent } from "../components/CustomToast";
import Input from "../components/Input";
import PlayBtn from "../components/PlayBtn";
import Scene3d from "../components/Scene3d";
import { useCharacterAnimations } from "../context/CharAnimation";
import { useTabStore } from "../store";
import { jwtDecode, JwtPayload } from "jwt-decode";


const Landing = () => {
  const [openToast, setOpenToast] = useState(false);
  const [toastContent, setToastContent] = useState<ToastContent>({});
  const [showComponents, setShowComponents] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [isSceneVisible, setIsSceneVisible] = useState(false);

  const { isPlayButton } = useCharacterAnimations();
  const { tabIndex, setTabIndex } = useTabStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isPlayButton) {
      const timeout = setTimeout(() => setShowComponents(true), 3500);
      return () => clearTimeout(timeout);
    }
  }, [isPlayButton]);

  const handlePlayBtnClick = () => {
    setIsSceneVisible(true);
  };

  interface CustomJwtPayload extends JwtPayload {
    isProfileDone?: boolean; 
  }

  const validateInputs = useCallback(() => {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setToastContent({
        message: "Email and password cannot be empty.",
        type: "error",
      });
      setOpenToast(true);
      return false;
    }
    return { email: trimmedEmail, password: trimmedPassword };
  }, [email, password]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const inputs = validateInputs();
    if (!inputs) return;

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/auth/login`,
        inputs
      );

      if (response.data.token) {
        Cookies.set("refreshToken",response.data.refreshToken,{secure:true})
        Cookies.set("jwtToken", response.data.token, { secure: true });

        toast.success("Login successful", {
          autoClose: 3000,
          theme: "dark",
        });

        secureLocalStorage.setItem("id", response.data.id);
        secureLocalStorage.setItem("name", response.data.username);
        secureLocalStorage.setItem("email", response.data.email);

        await fetchUserDetails(response.data.id);
      } else if (response.data.error) {
        setToastContent({ message: response.data.error, type: "error" });
        setOpenToast(true);
      }
    } catch (err) {
      console.error("Login error:", err);
      setToastContent({
        message: "Invalid Username or Password",
        type: "error",
      });
      setOpenToast(true);
    }
  };

  const fetchUserDetails = async (userId: string) => {
    try {
      const token = Cookies.get("jwtToken");
      if (!token) throw new Error("JWT token not found");

      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/user/user/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      secureLocalStorage.setItem("userDetails", JSON.stringify(response.data));

      const isProfileDone = response.data?.isProfileDone;
      navigate("/dashboard");
      
    } catch (err) {
      console.error("Error fetching user details:", err);
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

      <BoundingBox>
        <div className="w-full h-full relative z-[100] flex lg:justify-between items-center flex-col lg:flex-row">
          <div className="heading text-center md:text-left flex flex-col items-center lg:items-start z-[100]">
            <div className={`flex flex-col items-center lg:items-start transition-all duration-500 ease-in-out ${isPlayButton ? 'text-[2rem]' : 'md:text-[3rem]'}`}>
              <h1 className={`text-prime font-bold leading-tight whitespace-pre-line transition-all duration-500 ease-in-out lg:mt-24 
            ${isPlayButton ? 'text-3xl sm:text-4xl md:text-3xl lg:text-3xl lg:mt-[0.4375rem] ' : 'text-3xl sm:text-3xl md:text-3xl lg:text-[2.6rem] lg:mt-40'}`}>
                {!isPlayButton ? (
                  <>
                    <span className="lg:block mb-8">MOZILLA</span>
                    <span className="lg:block"> FIREFOX</span>
                  </>
                ) : (
                  "MOZILLA FIREFOX"
                )}
              </h1>

              <div className="text-light text-base md:text-xl sm:text-3xl lg:mt-4 block text-center  lg:text-left">
                IS RECRUITING
              </div>
            </div>
            <div className="hidden lg:block">
              <div
                className={
                  isPlayButton
                    ? "text-prime text-base lg:text-2xl opacity-0 transition-opacity duration-1000 ease-in-out delay-200"
                    : "text-prime text-base lg:text-2xl mt-10 opacity-100"
                }
              >
                Wanna play with Mr.Fox Jr??
              </div>
              <div className="relative w-[95%] h-[55vh] pb-[15vh] flex items-center justify-center">
                {!isPlayButton && <PlayBtn />}
                {isPlayButton && <Scene3d />}
              </div>
            </div>
          </div>

          <div className=" p-4 lg:p-8 mt-4 mb-4 md:mt-0 max-w-full max-h-full z-[100]">
            <form
              className="form-container flex flex-col mt-4 lg:mt-0 gap-3 md:gap-6 w-full lg:w-[60%] mx-auto shadow-lg rounded-lg"
              onSubmit={handleLogin}
            >
              <Input
                label={"email"}
                placeholder="VIT Email"
                type="text"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value.trim().toLowerCase())
                }
                className="rounded-md border-gray-300 focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:focus:ring-blue-400"
              />

              <div className="relative">
                <Input
                  label={"password"}
                  placeholder="Password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value.trim())}
                  className="rounded-md border-gray-300 focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:focus:ring-blue-400"
                />
                {password && (
                  <button
                    type="button"
                    className="absolute right-3 top-3 text-gray-600 hover:text-gray-800"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? "Hide Password" : "Show Password"}
                  >
                  </button>
                )}
              </div>

              <Button
                submit={true}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-all duration-300"
              >
                Sign In
              </Button>

              <NavLink
                to="/forgotpassword"
                className="text-center text-sm md:text-base text-blue-600 hover:underline"
              >
                Forgot Password?
              </NavLink>
            </form>

            <section className="text-center mt-3 md:mt-4 w-full lg:w-[60%] mx-auto flex flex-col gap-3  rounded-lg shadow-md">
              <p className="text-sm md:text-base text-gray-300">
                Don't have an account?
              </p>
              <NavLink
                to="/signup"
                className="text-white bg-blue-600 py-2 px-4 rounded-md w-auto mx-auto hover:bg-orange-500 hover:text-white transition-all duration-300"
              >
                Sign Up
              </NavLink>
            </section>
          </div>
        </div>

        <div className="absolute bottom-0 w-full left-0">
          <img
            src="/background.png"
            alt=""
            className={isPlayButton ? "invert brightness-[40%] opacity-0 transition-opacity duration-1000 ease-in-out delay-200" : "hidden md:block absolute bottom-0 left-0 w-full invert brightness-[40%] "}
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
        </div>

      </BoundingBox>
    </div>
  );
};

export default Landing;

