import { useEffect, useState } from "react";
import { ToastContent } from "../components/CustomToast";
import axios from "axios";
import Cookies from "js-cookie";
import Navbar from "../components/Navbar";
import secureLocalStorage from "react-secure-storage";
import { useNavigate } from "react-router-dom";
import { jwtDecode, JwtPayload } from "jwt-decode";

interface CustomJwtPayload extends JwtPayload {
  isProfileDone?: boolean; 
}
const ChangeProfile = () => {
  const navigator = useNavigate();
  const [domain, setDomain] = useState<string[]>([]);
  const [isProfile, setIsProfile] = useState(false);
  const [openToast, setOpenToast] = useState(false);
  const [error, setError] = useState(false);
  const [toastContent, setToastContent] = useState<ToastContent>({});
  const [isDomainChanged, setIsDomainChanged] = useState(false);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    if (checked) {
      setDomain((prevDomains) => [...prevDomains, value]);
    } else {
      setDomain((prevDomains) =>
        prevDomains.filter((domain) => domain !== value)
      );
    }
    setIsDomainChanged(true);
  };

  // Updated function to refresh the token in the DB
  const refreshToken = async () => {
    try {
      const token = Cookies.get("jwtToken");
      const refreshToken = Cookies.get("refreshToken") || secureLocalStorage.getItem("refreshToken");

      if (!token || !refreshToken) {
        console.error("Missing token or refreshToken");
        return false;
      }
      
      // Send the refresh token to the server
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/auth/refresh`,
        { refreshToken }, // Include refresh token in the request body
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (response.data && response.data.accessToken) {
        // Update the token in cookies with the new access token
        Cookies.set("refreshToken", response.data.accessToken);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to refresh token:", error);
      return false;
    }
  };

  const handleUserDomain = async (e: React.FormEvent<HTMLFormElement>) => {
    const formData = {
      domain,
    };
    e.preventDefault();
    try {
      const id = secureLocalStorage.getItem("id");

      if (!id) {
        throw new Error("User id not found in secureLocalStorage");
      }
      const token = Cookies.get("jwtToken");
      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/user/updateuserdomain/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data) {
        // Store user details
        secureLocalStorage.setItem(
          "userDetails",
          JSON.stringify(response.data)
        );

        // Immediately update the refresh token with new domain
        const refreshed = await refreshToken();
        
        if (!refreshed) {
          setOpenToast(true);
          setToastContent({
            message: "Profile updated but token refresh failed",
            type: "warning",
          });
        }

        setIsProfile(response.data.isProfileDone);
        if (response.data.isProfileDone) {
          setOpenToast(true);
          setToastContent({
            message: "Profile Updated Successfully",
          });
          navigator("/dashboard");
        }
      }
      if (response.data.message) {
        setOpenToast(true);
        setToastContent({
          message: response.data.message,
        });
      }

      setError(false);
      setIsDomainChanged(false);
    } catch (error) {
      setOpenToast(true);
      setToastContent({
        message: "Invalid Username or Password",
        type: "error",
      });
      setError(true);
    }
  };

  const fetchUserDetails = async () => {
    try {
      const id = secureLocalStorage.getItem("id");

      if (!id) {
        throw new Error("User id not found in secureLocalStorage");
      }
      const token = Cookies.get("jwtToken");
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/user/user/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      secureLocalStorage.setItem("userDetails", JSON.stringify(response.data));
      if(token){
        const decoded = jwtDecode<CustomJwtPayload>(token);
        setIsProfile(decoded.isProfileDone === true);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  useEffect(() => {
    const localData = secureLocalStorage.getItem("userDetails");
    if (typeof localData === "string") {
      const data = JSON.parse(localData);
      setDomain(data?.domain || []);
    } else {
      console.error(
        "Unexpected data type retrieved from local storage:",
        typeof localData
      );
    }
  }, []);

  useEffect(() => {
    const token = Cookies.get("jwtToken");
    if(token){
      const decoded = jwtDecode<CustomJwtPayload>(token);
      setIsProfile(decoded.isProfileDone === true);
      fetchUserDetails(); // Fetch latest user details when component mounts
    }
  }, []);

  return (
    <div className="w-full min-h-screen h-full bg-black p-12 flex flex-grow flex-col md:flex-row">
      <Navbar />
      <div
        className="border-2 border-dashed border-prime h-full flex-grow p-4 text-white flex flex-col gap-4 items-center md:justify-center"
        style={{ background: "rgba(0,0,0,0)" }}
      >
        {isProfile ? (
          <div className="nes-container is-rounded is-dark w-full md:w-fit">
            <h1 className="text-sm text-center md:text-left md:text-xl lg:text-3xl">
              Update Your Profile
            </h1>
            <hr className="h-1 bg-white" />
            <form onSubmit={handleUserDomain}>
              <section className="flex items-start text-xs md:text-base lg:items-center flex-col lg:flex-row mt-8">
                <p className="w-full text-sn md:text-xl">Update domain:</p>
                <div className="flex flex-col w-full">
                  <label>
                    <input
                      type="checkbox"
                      className="nes-checkbox is-dark"
                      value="tech"
                      checked={domain && domain.includes("tech")}
                      onChange={handleCheckboxChange}
                    />
                    <span className="text-xs md:text-sm lg:text-base">
                      Technical
                    </span>
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      className="nes-checkbox is-dark"
                      value="design"
                      checked={domain && domain.includes("design")}
                      onChange={handleCheckboxChange}
                    />
                    <span className="text-xs md:text-sm lg:text-base">
                      Design
                    </span>
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      className="nes-checkbox is-dark"
                      value="management"
                      checked={domain && domain.includes("management")}
                      onChange={handleCheckboxChange}
                    />
                    <span className="text-xs md:text-sm lg:text-base">
                      Management
                    </span>
                  </label>
                </div>
              </section>
              <button
                type="submit"
                className="nes-btn is-success float-right"
                style={{ marginBlock: "10px" }}
                disabled={!isDomainChanged}
              >
                Update &rarr;
              </button>
            </form>
          </div>
        ) : (
          <section className="flex items-start text-xs md:text-base lg:items-center flex-col lg:flex-row mt-8">
            <p className="w-full text-xl">
              Profile Updated Successfully
            </p>
          </section>
        )}
      </div>
    </div>
  );
};

export default ChangeProfile;