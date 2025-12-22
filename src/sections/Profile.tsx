import Input from "../components/Input";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { useEffect, useState, useCallback } from "react";
import CustomToast, { ToastContent } from "../components/CustomToast";
import { useTabStore } from "../store";
import secureLocalStorage from "react-secure-storage";
import { z } from "zod";
import { jwtDecode, JwtPayload } from "jwt-decode";
interface CustomJwtPayload extends JwtPayload {
  isProfileDone?: boolean;
  domain?: [];
}

// Constants
const API_BASE_URL = import.meta.env.VITE_BASE_URL;
const TOAST_DURATION = 3000;
const MOBILE_REGEX = /^\d{10}$/;
const EMAIL_REGEX = /^\S+@\S+\.\S+$/;
const MAX_EVENT_LENGTH = 100;

// Enums
enum Domain {
  TECH = "tech",
  DESIGN = "design",
  MANAGEMENT = "management",
}

enum ToastType {
  SUCCESS = "success",
  ERROR = "error",
}

// Types
interface UserDetails {
  id: string;
  mobile: string;
  emailpersonal: string;
  participatedEvent: string;
  volunteeredEvent: string;
  domain: Domain[];
  isProfileDone: boolean;
}

interface ProfileFormState {
  mobile: string;
  emailpersonal: string;
  participatedEvent: string;
  volunteeredEvent: string;
  domain: Domain[];
}

interface ValidationError {
  field: keyof ProfileFormState;
  message: string;
}

// Zod Schema for validation
const profileSchema = z.object({
  mobile: z.string().regex(MOBILE_REGEX, "Mobile number must be 10 digits"),
  emailpersonal: z.string().regex(EMAIL_REGEX, "Invalid email format"),
  participatedEvent: z
    .string()
    .max(MAX_EVENT_LENGTH, "Participation event details too long"),
  volunteeredEvent: z
    .string()
    .max(MAX_EVENT_LENGTH, "Volunteering event details too long"),
  domain: z
    .array(z.enum([Domain.TECH, Domain.DESIGN, Domain.MANAGEMENT]))
    .min(1, "Select at least one domain"),
});

// Custom Hooks
const useAuth = () => {
  const getToken = useCallback(() => Cookies.get("jwtToken") || "", []);
  const getUserId = useCallback(
    () => secureLocalStorage.getItem("id") as string | null,
    []
  );
  return { getToken, getUserId };
};

const useUserDetails = () => {
  const { getToken, getUserId } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserDetails = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const id = getUserId();
      if (!id) throw new Error("User ID not found");

      const token = getToken();
      const { data } = await axios.get<UserDetails>(
        `${API_BASE_URL}/user/user/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // console.log(data)
      secureLocalStorage.setItem("userDetails", JSON.stringify(data));
      return data;
    } catch (error) {
      const message =
        error instanceof AxiosError
          ? error.response?.data?.message || "Failed to fetch user details"
          : "An unexpected error occurred";
      setError(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [getToken, getUserId]);

  return { fetchUserDetails, isLoading, error };
};

// const useUserDetails = () => {
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const fetchUserDetails = useCallback(async () => {
//     setIsLoading(true);
//     setError(null);
//     try {
//       // Simulate API delay
//       await new Promise((resolve) => setTimeout(resolve, 1000));

//       // Mock user data
//       const mockData: UserDetails = {
//         id: "123",
//         mobile: "9876543210",
//         emailpersonal: "test@example.com",
//         participatedEvent: "Hackathon 2024",
//         volunteeredEvent: "Tech Fest 2023",
//         domain: [Domain.TECH, Domain.DESIGN],
//         isProfileDone: false,
//       };

//       secureLocalStorage.setItem("userDetails", JSON.stringify(mockData));
//       return mockData;
//     } catch (error) {
//       setError("Failed to fetch user details");
//       throw error;
//     } finally {
//       setIsLoading(false);
//     }
//   }, []);

//   return { fetchUserDetails, isLoading, error };
// };

const useProfileUpdate = () => {
  const { getToken, getUserId } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProfile = useCallback(
    async (formData: ProfileFormState) => {
      setIsLoading(true);
      setError(null);
      try {
        const id = getUserId();
        if (!id) throw new Error("User ID not found");

        const token = getToken();
        const { data } = await axios.put(
          `${API_BASE_URL}/user/updateuser/${id}`,
          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        // console.log(data)
        return data;
      } catch (error) {
        const message =
          error instanceof AxiosError
            ? error.response?.data?.message || "Failed to update profile"
            : "An unexpected error occurred";
        setError(message);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [getToken, getUserId]
  );

  return { updateProfile, isLoading, error };
};

// const useProfileUpdate = () => {
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const updateProfile = useCallback(async (formData: ProfileFormState) => {
//     setIsLoading(true);
//     setError(null);
//     try {
//       // Simulate API delay
//       await new Promise((resolve) => setTimeout(resolve, 1000));

//       // Mock success response
//       secureLocalStorage.setItem("userDetails", JSON.stringify({ ...formData, isProfileDone: true }));
//       return { message: "Profile updated successfully!" };
//     } catch (error) {
//       setError("Failed to update profile");
//       throw error;
//     } finally {
//       setIsLoading(false);
//     }
//   }, []);

//   return { updateProfile, isLoading, error };
// };

// Main Component
const Profile = () => {
  const { setTabIndex } = useTabStore();
  const {
    fetchUserDetails,
    isLoading: isFetching,
    error: fetchError,
  } = useUserDetails();
  const {
    updateProfile,
    isLoading: isUpdating,
    error: updateError,
  } = useProfileUpdate();

  const [formState, setFormState] = useState<ProfileFormState>({
    mobile: "",
    emailpersonal: "",
    participatedEvent: "",
    volunteeredEvent: "",
    domain: [],
  });

  const [validationErrors, setValidationErrors] = useState<ValidationError[]>(
    []
  );
  const [toast, setToast] = useState<ToastContent | null>(null);
  const [isProfileComplete, setIsProfileComplete] = useState<boolean | null>(
    null
  );

  // Initialize form from stored data
  useEffect(() => {
    const userDetailsStr = secureLocalStorage.getItem("userDetails") as
      | string
      | null;
    const token = Cookies.get("refreshToken");
    // console.log(token)
    if (token) {
      try {
        const decoded = jwtDecode<CustomJwtPayload>(token);
        if (decoded.isProfileDone) {
          setIsProfileComplete(decoded?.isProfileDone);
        }
      } catch (err) {
        console.error("Error decoding token:", err);
      }
    }
    if (userDetailsStr) {
      const userDetails = JSON.parse(userDetailsStr);
      //setIsProfileComplete(userDetails?.data.isProfileDone);
      setFormState({
        mobile: userDetails.mobile,
        emailpersonal: userDetails.emailpersonal,
        participatedEvent: userDetails.participatedEvent,
        volunteeredEvent: userDetails.volunteeredEvent,
        domain: userDetails.domain || [],
      });
    } else {
      fetchUserDetails().catch(() => {
        /* handled in hook */
      });
    }
  }, [fetchUserDetails]);

  // Update tab index when profile is complete and show notice
  useEffect(() => {
    if (isProfileComplete) {
      setToast({
        message: "Profile is already completed.",
        type: ToastType.SUCCESS,
        duration: TOAST_DURATION,
      });
      setTabIndex(1);
    }
  }, [isProfileComplete, setTabIndex]);

  // Immediate form updates for snappy typing
  const handleInputChange = useCallback(
    (field: keyof ProfileFormState, value: string) => {
      setFormState((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const handleDomainChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value, checked } = e.target;
      setFormState((prev) => ({
        ...prev,
        domain: checked
          ? [...prev.domain, value as Domain]
          : prev.domain.filter((domain) => domain !== value),
      }));
    },
    []
  );

  const validateForm = useCallback(() => {
    const result = profileSchema.safeParse(formState);
    if (!result.success) {
      const errors = result.error.errors.map((error) => ({
        field: error.path[0] as keyof ProfileFormState,
        message: error.message,
      }));
      setValidationErrors(errors);
      return false;
    }
    setValidationErrors([]);
    return true;
  }, [formState]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      setToast({
        message: "Please fix form errors before submitting",
        type: ToastType.ERROR,
        duration: TOAST_DURATION,
      });
      return;
    }

    try {
      const data = await updateProfile(formState);
      // Mark locally as completed for immediate lock
      secureLocalStorage.setItem("profileComplete", true);
      // Refetch latest details from backend
      await fetchUserDetails();
      // Lock in UI immediately
      setIsProfileComplete(true);
      setToast({
        message: data.message || "Profile updated successfully!",
        type: ToastType.SUCCESS,
        duration: TOAST_DURATION,
      });
      // Soft, subtle reload to ensure all providers/stores pick newer flags without visible flicker
      setTimeout(() => {
        // Use replace to avoid extra history entry; Vite dev preserves state; in prod this is quick
        window.location.reload();
      }, 400);
    } catch (error) {
      setToast({
        message: updateError || "Failed to update profile",
        type: ToastType.ERROR,
        duration: TOAST_DURATION,
      });
    }
  };

  // Get field-specific error message
  const getFieldError = useCallback(
    (field: keyof ProfileFormState) => {
      return validationErrors.find((error) => error.field === field)?.message;
    },
    [validationErrors]
  );

  // Loading state
  if (isFetching) {
    return (
      <div className="min-h-[75vh] w-[90%] md:w-[70%] text-center text-white mx-auto text-sm md:text-xl flex items-center justify-center">
        Loading profile...
      </div>
    );
  }

  // Error state
  if (fetchError) {
    return (
      <div className="min-h-[75vh] w-[90%] md:w-[70%] text-center text-white mx-auto text-sm md:text-xl flex items-center justify-center">
        Error loading profile: {fetchError}
        <button
          onClick={() => fetchUserDetails()}
          className="nes-btn is-error ml-4"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="w-full profile py-4 flex gap-4 flex-col lg:flex-row ">
      {toast && (
        <CustomToast
          setToast={() => setToast(null)}
          setToastContent={() => {}}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
        />
      )}

      {isProfileComplete ? (
        <div className="min-h-[75vh] w-[90%] lg:w-[70%] text-center text-white mx-auto text-sm md:text-xl flex items-center justify-center">
          You've already completed your profile and it is locked.
        </div>
      ) : (
        <>
          <div className="nes-container is-rounded is-dark dark-nes-container w-full lg:w-[30%] flex flex-col p-4 h-[70vh]">
            {/* ✅ Centered Title */}
            <div className="h-auto mb-4 text-lg">Hello World</div>

            {/* ✅ Auto-Adjusting Text Content */}
            <div className="flex-1 break-words text-light p-2 text-xs md:text-sm lg:text-base leading-tight md:leading-normal">
              Please complete your profile with your contact details, domains,
              and any relevant information. This helps us match tasks and
              communications to you.
            </div>
          </div>
          <div className="nes-container is-rounded w-full lg:w-[70%] is-dark dark-nes-container h-[70vh] custom-scroll overflow-y-auto z-[1000]">
            <form
              className="flex flex-col gap-8 md:gap-4 w-full"
              onSubmit={handleSubmit}
            >
              <section className="flex items-start text-xs md:text-base lg:items-center flex-col lg:flex-row leading-tight md:leading-normal">
                <label className="w-full lg:w-[40%] text-sm">
                  Mobile Number:
                </label>
                <div className="w-full lg:w-[60%]">
                  <Input
                    label="mobile"
                    placeholder="Your mobile"
                    type="text"
                    value={formState.mobile}
                    onChange={(e) =>
                      handleInputChange("mobile", e.target.value)
                    }
                    className={getFieldError("mobile") ? "is-error" : ""}
                  />
                  {getFieldError("mobile") && (
                    <p className="text-red-500 text-xs mt-1">
                      {getFieldError("mobile")}
                    </p>
                  )}
                </div>
              </section>

              <section className="flex items-start text-xs md:text-base lg:items-center flex-col lg:flex-row">
                <label className="w-full lg:w-[40%] text-sm">
                  Personal Email:
                </label>
                <div className="w-full lg:w-[60%] ">
                  <Input
                    label="emailpersonal"
                    placeholder="Personal Email"
                    type="text"
                    value={formState.emailpersonal}
                    onChange={(e) =>
                      handleInputChange("emailpersonal", e.target.value)
                    }
                    className={getFieldError("emailpersonal") ? "is-error" : ""}
                  />
                  {getFieldError("emailpersonal") && (
                    <p className="text-red-500 text-xs mt-1">
                      {getFieldError("emailpersonal")}
                    </p>
                  )}
                </div>
              </section>

              <section className="flex items-start text-xs md:text-base lg:items-center flex-col lg:flex-row">
                <p className="w-full lg:w-[40%]">Domains:</p>
                <div className="flex flex-col">
                  <label>
                    <input
                      type="checkbox"
                      className="nes-checkbox is-dark"
                      value={Domain.TECH}
                      checked={formState.domain?.includes(Domain.TECH)}
                      onChange={handleDomainChange}
                    />
                    <span className="text-xs md:text-sm lg:text-base">
                      Technical
                    </span>
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      className="nes-checkbox is-dark"
                      value={Domain.DESIGN}
                      checked={formState.domain?.includes(Domain.DESIGN)}
                      onChange={handleDomainChange}
                    />
                    <span className="text-xs md:text-sm lg:text-base">
                      Design
                    </span>
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      className="nes-checkbox is-dark"
                      value={Domain.MANAGEMENT}
                      checked={formState.domain?.includes(Domain.MANAGEMENT)}
                      onChange={handleDomainChange}
                    />
                    <span className="text-xs md:text-sm lg:text-base">
                      Management
                    </span>
                  </label>
                  {getFieldError("domain") && (
                    <p className="text-red-500 text-xs mt-1">
                      {getFieldError("domain")}
                    </p>
                  )}
                </div>
              </section>

              <section className="flex items-start text-xs md:text-base flex-col">
                <label className="w-full text-sm">
                  Have you volunteered in any MFC events? If yes, enter the
                  event name.
                </label>
                <div className="w-full">
                  <Input
                    label="volunteeredEvent"
                    placeholder="Enter event details"
                    type="text"
                    value={formState.volunteeredEvent}
                    onChange={(e) =>
                      handleInputChange("volunteeredEvent", e.target.value)
                    }
                    className={
                      getFieldError("volunteeredEvent") ? "is-error" : ""
                    }
                  />
                  {getFieldError("volunteeredEvent") && (
                    <p className="text-red-500 text-xs mt-1">
                      {getFieldError("volunteeredEvent")}
                    </p>
                  )}
                </div>
              </section>

              <section className="flex items-start text-xs md:text-base flex-col">
                <label className="w-full text-sm">
                  Have you participated in any MFC events?<br></br> If yes,
                  enter the event name.
                </label>
                <div className="w-full">
                  <Input
                    label="participatedEvent"
                    placeholder="Enter event details"
                    type="text"
                    value={formState.participatedEvent}
                    onChange={(e) =>
                      handleInputChange("participatedEvent", e.target.value)
                    }
                    className={
                      getFieldError("participatedEvent") ? "is-error" : ""
                    }
                  />
                  {getFieldError("participatedEvent") && (
                    <p className="text-red-500 text-xs mt-1">
                      {getFieldError("participatedEvent")}
                    </p>
                  )}
                </div>
              </section>

              <div className="w-full flex justify-end">
                <button
                  type="submit"
                  className="nes-btn is-error w-fit custom-nes-error text-xs md:text-xl"
                  disabled={isUpdating}
                >
                  {isUpdating ? "Updating..." : "Next →"}
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;
