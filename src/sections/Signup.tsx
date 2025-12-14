import axios from "axios";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
import secureLocalStorage from "react-secure-storage";
import BoundingBox from "../components/BoundingBox";
import Button from "../components/Button";
import CustomToast, { ToastContent } from "../components/CustomToast";
import Input from "../components/Input";

interface SignupFormValues {
  name: string;
  registerNumber: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Signup: React.FC = () => {
  const [openToast, setOpenToast] = useState(false);
  const [toastContent, setToastContent] = useState<ToastContent>({});
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [regno, setRegno] = useState("");
  const [error, setError] = useState(false);
  const [formErrors, setFormErrors] = useState<Partial<SignupFormValues>>({});
  const [mutex, setMutex] = useState(false);
  const navigate = useNavigate();
  function validateData() {
    const errors: Partial<SignupFormValues> = {};
    let isError = false;
    if (username.length < 3) {
      errors.name = "Name is required";
      isError = true;
    } else {
      errors.name = "";
      isError = false;
    }

    const registerNumberRegex = /^(23|24|25)[BM][A-Z]{2}\d{4}$/;
    if (!regno) {
      errors.registerNumber = "Register number is required";
      isError = true;
    } else if (!registerNumberRegex.test(regno)) {
      errors.registerNumber = "Invalid register number format";
      isError = true;
    } else {
      errors.registerNumber = "";
      isError = false;
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@vitstudent\.ac\.in$/;
    // const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!email) {
      errors.email = "Email is required";
      isError = true;
    } else if (!emailRegex.test(email)) {
      errors.email = "Invalid email address. Must end with @vitstudent.ac.in";
      isError = true;
    }
    if (!password) {
      errors.password = "Password is required";
      isError = true;
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
      isError = true;
    }
    if (!confirmpassword) {
      errors.confirmPassword = "Confirm Password is required";
      isError = true;
    } else if (password !== confirmpassword) {
      errors.confirmPassword = "Passwords must match";
      isError = true;
    }
    // Update the formErrors state with the new errors
    setFormErrors(errors);
    return isError;
  }
  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isErrorValidation = validateData();

    const formData = {
      username,
      email,
      regno,
      password,
      confirmpassword,
    };
    if (!isErrorValidation) {
      try {
        setMutex(true);
        const response = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/auth/signup`,
          formData
        );
        // console.log(response)
        if (response.data.token) {
          document.cookie = "jwtToken=" + response.data.token;
          if (response.data.refreshToken) {
            document.cookie = "refreshToken=" + response.data.refreshToken;
          }
          setOpenToast(true);
          setToastContent({
            message: "OTP SENT",
            // type: "error",
          });

          // toast.success("OTP SENT", {
          //   className: "custom-bg",
          //   autoClose: 3000,
          //   theme: "dark",
          // });
          secureLocalStorage.setItem("id", response.data.id);
          secureLocalStorage.setItem("name", response.data.username);
          secureLocalStorage.setItem("email", response.data.email);
          navigate("/verifyotp");
          setMutex(false);
        }
        if (response.data.error) {
          setOpenToast(true);
          setToastContent({
            message: `${response.data.error}`,
            type: "error",
          });
          setMutex(false);
        }

        setError(false);
        console.error(error);
        // TODO: Set the appropriate error message here
      } catch (error) {
        console.log(error);
        setMutex(false);
        // setOpenToast(true);
        // setToastContent({
        //   message: "Error while signup",
        //   type: "error",
        // });
        // toast.error("Invalid Username or Password", {
        //   className: "custom-bg-error",
        //   autoClose: 3000,
        //   theme: "dark",
        // });
        setError(true);
      }
    }
  };
  return (
    <div className="w-full flex-grow h-full md:h-full relative flex justify-center items-center text-dark  p-8">
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
        <div className="w-full h-full relative z-[100] flex flex-col md:flex-row justify-between">
          <div className="signup-info text-center md:text-left  flex-col justify-center hidden md:inline-flex items-center md:items-start p-6 md:p-8 md:mt-0 ">
            <h1 className="text-[2.2rem] md:text-[3rem] font-bold text-prime tracking-wide hidden md:inline-flex">
              MOZILLA FIREFOX
            </h1>
            <span className="text-light text-lg md:text-2xl mt-2 md:mt-4 hidden md:inline-flex">
              IS RECRUITING
            </span>
            <div className="mt-6 text-sm md:text-base hidden md:block">
              <div className="text-white mb-2 md:mb-4">Already have an account?</div>
              <NavLink
                className="nes-btn bg-prime hover:bg-orange-600 text-white px-4 py-2 rounded transition-all duration-300"
                to="/"
              >
                Login Here &rarr;
              </NavLink>
            </div>
            <section className="icon-list  gap-4 mt-6 justify-center hidden md:inline-flex">
              <a
                href="https://www.instagram.com/mfc_vit"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:scale-110 transition-transform duration-300"
              >
                <i className="nes-icon instagram is-medium"></i>
              </a>
              <a
                href="mailto:mozillafirefox@vit.ac.in"
                className="hover:scale-110 transition-transform duration-300"
              >
                <i className="nes-icon gmail is-medium"></i>
              </a>
              <a
                href="https://www.linkedin.com/company/mfcvit?originalSubdomain=in"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:scale-110 transition-transform duration-300"
              >
                <i className="nes-icon linkedin is-medium"></i>
              </a>
            </section>
          </div>

          <div className="flex-grow  text-white rounded-lg shadow-lg p-10 mt-0 md:mt-0">
            <div className="text-center block md:hidden">
              <h1 className="text-2xl sm:text-3xl md:text-[3rem] font-bold text-prime tracking-wide">
                MOZILLA FIREFOX
              </h1>
              <span className="text-base sm:text-4xl text-light mt-2">IS RECRUITING</span>
            </div>

            <div className="text-center mt-6 block md:hidden">
              <h2 className="text-lg sm:text-xl font-bold text-white">SIGNUP PAGE</h2>
            </div>

            <form
              className="flex flex-col gap-8 md:gap-6 w-full mx-auto mt-4 md:mt-0"
              onSubmit={handleSignup}
            >
              <Input
                label={"Name"}
                placeholder="Enter your name"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required={true}
                className=" text-black"
              />
              {formErrors.name && (
                <div className="text-xs text-prime">{formErrors.name}</div>
              )}

              <Input
                label={"Email"}
                placeholder="Enter your VIT Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value.trim().toLowerCase())}
                required={true}
                className=" text-black"
              />
              {formErrors.email && (
                <div className="text-xs text-prime">{formErrors.email}</div>
              )}

              <Input
                label={"Registration Number"}
                placeholder="Enter your Registration Number"
                type="text"
                value={regno}
                onChange={(e) => setRegno(e.target.value.toUpperCase())}
                required={true}
                className=" text-black"
              />
              {formErrors.registerNumber && (
                <div className="text-xs text-prime">{formErrors.registerNumber}</div>
              )}

              <Input
                label={"Password"}
                placeholder="Enter a secure password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value.trim())}
                required={true}
                className=" text-black"
              />
              {formErrors.password && (
                <div className="text-xs text-prime">{formErrors.password}</div>
              )}

              <Input
                label={"Confirm Password"}
                placeholder="Re-enter your password"
                type="password"
                value={confirmpassword}
                onChange={(e) => setConfirmPassword(e.target.value.trim())}
                required={true}
                className=" text-black"
              />
              {formErrors.confirmPassword && (
                <div className="text-xs text-prime">{formErrors.confirmPassword}</div>
              )}

              <Button
                submit={true}
                disabled={mutex}
                className="bg-prime hover:bg-orange-600 text-white font-bold py-3 rounded transition-all duration-300"
              >
                {mutex === true ? (
                  <div className="flex items-center justify-center gap-4">
                    <span>Loading</span>
                    <img
                      src="/loader.png"
                      alt="loading..."
                      className="w-6 invert animation-spin"
                    />
                  </div>
                ) : (
                  "Sign Up"
                )}
              </Button>
            </form>


            <div className="mt-8 block md:hidden text-center">
              <div className="text-white mb-4">Already have an account?</div>
              <NavLink
                className="nes-btn bg-prime hover:bg-orange-600 text-white px-4 py-2 rounded block mx-auto w-2/3 text-center"
                to="/"
              >
                Login Here &rarr;
              </NavLink>
              <section className="icon-list flex gap-4 mt-6 justify-center">
                <a
                  href="https://www.instagram.com/mfc_vit"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:scale-110 transition-transform duration-300"
                >
                  <i className="nes-icon instagram is-medium"></i>
                </a>
                <a
                  href="mailto:mozillafirefox@vit.ac.in"
                  className="hover:scale-110 transition-transform duration-300"
                >
                  <i className="nes-icon gmail is-medium"></i>
                </a>
                <a
                  href="https://www.linkedin.com/company/mfcvit?originalSubdomain=in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:scale-110 transition-transform duration-300"
                >
                  <i className="nes-icon linkedin is-medium"></i>
                </a>
              </section>
            </div>

            <div className="mt-8 block">

            </div>
          </div>
        </div>
        <img
          src="/background.png"
          alt=""
          className="w-full hidden md:block absolute bottom-0 invert brightness-[50%] left-0"
        />
        <div className="fixed bottom-0 w-full md:hidden opacity-75">
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

export default Signup;
