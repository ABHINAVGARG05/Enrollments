import { useEffect, useState, useCallback } from "react";
import { ToastContent } from "../components/CustomToast";
import axios from "axios";
import Cookies from "js-cookie";
import Navbar from "../components/Navbar";
import BoundingBox from "../components/BoundingBox";
import secureLocalStorage from "react-secure-storage";
import { useNavigate } from "react-router-dom";
import Toast from "../components/CustomToast"; // Import Toast component

interface UserDetails {
  domain?: string[];
  data?: {
    domain?: string[];
  };
}

const ChangeProfile = () => {
  const navigate = useNavigate();
  const [domain, setDomain] = useState<string[]>([]);
  const [openToast, setOpenToast] = useState(false);
  const [error, setError] = useState(false);
  const [toastContent, setToastContent] = useState<ToastContent>({});
  const [isDomainChanged, setIsDomainChanged] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle checkbox changes for domain selection
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;

    setDomain((prevDomains) => {
      const newDomains = checked
        ? [...prevDomains, value]
        : prevDomains.filter((domain) => domain !== value);

      // Only set isDomainChanged if the domains actually changed
      const currentDomainStr = JSON.stringify(prevDomains.sort());
      const newDomainStr = JSON.stringify(newDomains.sort());

      if (currentDomainStr !== newDomainStr) {
        setIsDomainChanged(true);
      }

      return newDomains;
    });
  };

  // Fetch user details from API
  const fetchUserDetails = useCallback(async () => {
    setIsLoading(true);
    try {
      const id = secureLocalStorage.getItem("id");

      if (!id) {
        throw new Error("User ID not found in secureLocalStorage");
      }

      const token = Cookies.get("jwtToken");
      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/user/user/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data) {
        // Store fetched user details in local storage
        secureLocalStorage.setItem(
          "userDetails",
          JSON.stringify(response.data)
        );

        // Extract domain from response data - handle different possible structures
        const userDomain =
          response.data.domain ||
          (response.data.data && response.data.data.domain) ||
          [];

        setDomain(Array.isArray(userDomain) ? userDomain : []);
        setIsDomainChanged(false); // Reset domain changed flag after fetching
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      setError(true);
      setToastContent({
        message: "Failed to load profile data",
        type: "error",
      });
      setOpenToast(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle form submission to update user domain
  const handleUserDomain = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate that at least one domain is selected
    if (!domain.length) {
      setToastContent({
        message: "Please select at least one domain",
        type: "warning",
      });
      setOpenToast(true);
      return;
    }

    setIsSubmitting(true);

    try {
      const id = secureLocalStorage.getItem("id");
      if (!id) {
        throw new Error("User ID not found in secureLocalStorage");
      }

      const token = Cookies.get("jwtToken");
      if (!token) {
        throw new Error("Authentication token not found");
      }

      const formData = { domain };

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
        // Update local storage with the new user details
        const updatedUserDetails = {
          ...response.data,
          domain: domain, // Ensure domain is explicitly set
        };

        secureLocalStorage.setItem(
          "userDetails",
          JSON.stringify(updatedUserDetails)
        );

        // Force refresh the token to update domain information
        await refreshToken();

        setToastContent({
          message: "Profile updated successfully.",
          type: "success",
        });
        setOpenToast(true);

        setIsDomainChanged(false);
        setError(false);

        setToastContent({
          message:
            "Your profile has been updated. Please re-login to continue.",
          type: "warning",
        });
        setOpenToast(true);

        setTimeout(() => {
          Cookies.remove("jwtToken");
          Cookies.remove("refreshToken");
          secureLocalStorage.clear();
          navigate("/");
        }, 2500);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setToastContent({
        message: "Error updating profile. Please try again.",
        type: "error",
      });
      setOpenToast(true);
      setError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const refreshToken = async () => {
    try {
      const token = Cookies.get("jwtToken");
      const refreshToken = Cookies.get("refreshToken");

      if (!token || !refreshToken) {
        console.warn("Missing tokens for refresh");
        return false;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/auth/refresh`,
        { refreshToken },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data && response.data.accessToken) {
        Cookies.set("jwtToken", response.data.accessToken);
        if (response.data.refreshToken) {
          Cookies.set("refreshToken", response.data.refreshToken);
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to refresh token:", error);
      return false;
    }
  };

  useEffect(() => {
    const loadUserData = async () => {
      const userDetailsStr = secureLocalStorage.getItem("userDetails");

      if (typeof userDetailsStr === "string") {
        try {
          const userDetails = JSON.parse(userDetailsStr) as UserDetails;

          const userDomain =
            userDetails?.domain ||
            (userDetails?.data && userDetails.data.domain) ||
            [];

          setDomain(Array.isArray(userDomain) ? userDomain : []);
          setIsLoading(false);
        } catch (error) {
          console.error("Error parsing user details:", error);
          await fetchUserDetails();
        }
      } else {
        await fetchUserDetails();
      }
    };

    loadUserData();

    return () => {};
  }, [fetchUserDetails]);

  // Handle toast close
  const handleToastClose = () => {
    setOpenToast(false);
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-screen h-full bg-black p-4 flex flex-grow flex-col md:flex-row">
        <Navbar />
        <BoundingBox className="items-center justify-center">
          <div className="nes-container is-rounded is-dark">
            <p>Loading profile data...</p>
          </div>
        </BoundingBox>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen h-full bg-black p-4 flex flex-grow flex-col md:flex-row">
      <Navbar />
      <BoundingBox className="text-white">
        <div className="w-full max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          <div className="nes-container is-rounded is-dark w-full h-[60vh] overflow-y-auto flex flex-col">
            <h1 className="text-sm text-center md:text-left md:text-xl lg:text-2xl">
              Profile Info
            </h1>
            <hr className="h-1 bg-white" />
            <div className="mt-4 text-xs md:text-sm leading-snug">
              You can update the domains you’re interested in. This helps us
              route tasks and communication to the right teams.
            </div>
          </div>
          <div className="nes-container is-rounded is-dark w-full h-[60vh] overflow-y-auto flex flex-col">
            <h2 className="text-sm text-center md:text-left md:text-xl lg:text-2xl">
              Update Your Profile
            </h2>
            <hr className="h-1 bg-white" />
            <form
              onSubmit={handleUserDomain}
              className="mt-6 h-full flex flex-col"
            >
              <section className="flex items-start text-xs md:text-base flex-col gap-3">
                <p className="w-full text-sn md:text-lg">Select domain(s):</p>
                <div className="flex flex-col w-full gap-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="nes-checkbox is-dark"
                      value="tech"
                      checked={domain.includes("tech")}
                      onChange={handleCheckboxChange}
                      disabled={isSubmitting}
                    />
                    <span className="text-xs md:text-sm lg:text-base">
                      Technical
                    </span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="nes-checkbox is-dark"
                      value="design"
                      checked={domain.includes("design")}
                      onChange={handleCheckboxChange}
                      disabled={isSubmitting}
                    />
                    <span className="text-xs md:text-sm lg:text-base">
                      Design
                    </span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="nes-checkbox is-dark"
                      value="management"
                      checked={domain.includes("management")}
                      onChange={handleCheckboxChange}
                      disabled={isSubmitting}
                    />
                    <span className="text-xs md:text-sm lg:text-base">
                      Management
                    </span>
                  </label>
                </div>
              </section>
              <div className="mt-6 flex w-full justify-end mt-auto">
                <button
                  type="submit"
                  className="nes-btn is-success"
                  disabled={!isDomainChanged || isSubmitting}
                >
                  {isSubmitting ? "Updating..." : "Update →"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Toast notification */}
        {openToast && (
          <Toast
            message={toastContent.message || ""}
            type={toastContent.type || "success"}
            onClose={handleToastClose}
          />
        )}
      </BoundingBox>
    </div>
  );
};

export default ChangeProfile;
