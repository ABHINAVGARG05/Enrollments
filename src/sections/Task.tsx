import { useState, useEffect, useCallback } from "react";
import TechTask from "./TechTask";
import DesignTask from "./DesignTask";
import ManagementTask from "./ManagementTask";
import { useTabStore } from "../store";
import Cookies from "js-cookie";
import secureLocalStorage from "react-secure-storage";
import { jwtDecode, JwtPayload } from "jwt-decode";
import axios from "axios";

interface CustomJwtPayload extends JwtPayload {
  isProfileDone?: boolean;
}

interface UserDetails {
  mobile?: string;
  emailpersonal?: string;
  participatedEvent?: boolean;
  volunteeredEvent?: boolean;
  domain?: string[];
  isProfileDone?: boolean;
  data?: {
    isProfileDone?: boolean;
    domain?: string[];
  };
}

const DOMAIN_MAP = {
  tech: 0,
  design: 1,
  management: 2
};

const Task = () => {
  const { tabIndex, setTabIndex } = useTabStore();
  const [selectedDomain, setSelectedDomain] = useState(0);
  const [selectedSubDomain, setSelectedSubDomain] = useState("");
  const [domains, setDomains] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Reset selected subdomain when domain changes
  useEffect(() => {
    setSelectedSubDomain("");
  }, [selectedDomain]);

  // Memoize the loadUserData function to prevent unnecessary re-renders
  const loadUserData = useCallback(() => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Get user details from local storage
      const userDetailsStr = secureLocalStorage.getItem("userDetails");
      
      if (userDetailsStr && typeof userDetailsStr === "string") {
        const userDetails = JSON.parse(userDetailsStr) as UserDetails;
        
        // Handle both possible structures of userDetails
        const userDomains = userDetails?.domain || userDetails?.data?.domain || [];
        const isProfileDone = userDetails?.isProfileDone || userDetails?.data?.isProfileDone;
        
        if (userDomains.length > 0) {
          setDomains(userDomains);
          
          // Set initial selected domain based on available domains
          if (userDomains.includes("tech")) {
            setSelectedDomain(DOMAIN_MAP.tech);
          } else if (userDomains.includes("design")) {
            setSelectedDomain(DOMAIN_MAP.design);
          } else if (userDomains.includes("management")) {
            setSelectedDomain(DOMAIN_MAP.management);
          }
        }
        
        // Set tab index based on profile completion status
        if (isProfileDone) {
          setTabIndex(1);
        } else {
          setTabIndex(0);
        }
        
        setIsLoading(false);
      } else {
        // Fallback to token if user details not found in local storage
        const token = Cookies.get("jwtToken") || Cookies.get("refreshToken");
        
        if (token) {
          try {
            const decoded = jwtDecode<CustomJwtPayload>(token);
            const isProfileDone = decoded.isProfileDone;
            
            if (isProfileDone) {
              setTabIndex(1);
            } else {
              setTabIndex(0);
            }
            
            // Since we don't have domains from token, fetch user details
            fetchUserDetails();
          } catch (decodeError) {
            console.error("Error decoding token:", decodeError);
            setError("Invalid token format");
            setIsLoading(false);
          }
        } else {
          setError("No user data available");
          setIsLoading(false);
        }
      }
    } catch (error) {
      console.error("Error loading user data:", error);
      setError("Failed to load user data");
      setIsLoading(false);
    }
  }, [setTabIndex]);

  // Function to fetch user details from API
  const fetchUserDetails = useCallback(async () => {
    try {
      const id = secureLocalStorage.getItem("id");
      
      if (!id) {
        throw new Error("User ID not found");
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
        // Store user details in secure local storage
        secureLocalStorage.setItem("userDetails", JSON.stringify(response.data));
        
        // Update domains state
        const userDomains = response.data.domain || response.data.data?.domain || [];
        setDomains(userDomains);
        
        // Set initial selected domain based on available domains
        if (userDomains.includes("tech")) {
          setSelectedDomain(DOMAIN_MAP.tech);
        } else if (userDomains.includes("design")) {
          setSelectedDomain(DOMAIN_MAP.design);
        } else if (userDomains.includes("management")) {
          setSelectedDomain(DOMAIN_MAP.management);
        }
        
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      setError("Failed to fetch user details");
      setIsLoading(false);
    }
  }, []);

  // Load user data on component mount
  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  if (isLoading) {
    return (
      <div className="w-full profile py-6 flex justify-center items-center">
        <div className="nes-container is-rounded is-dark">
          <p>Loading your tasks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full profile py-6 flex justify-center items-center">
        <div className="nes-container is-rounded is-dark">
          <p className="text-error">{error}</p>
          <button 
            className="nes-btn is-primary mt-4"
            onClick={() => loadUserData()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // If no domains are available, show a message
  if (!domains || domains.length === 0) {
    return (
      <div className="w-full profile py-6 flex justify-center items-center">
        <div className="nes-container is-rounded is-dark">
          <p>No domains found. Please update your profile first.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full profile py-6 flex gap-4 flex-col lg:flex-row">
      <div className="w-full nes-container is-rounded is-centered lg:w-[30%] invert">
        <div className="h-auto mb-4 text-lg">Domains</div>
        <div className="flex flex-col justify-between gap-4 lg:gap-8">
          {domains.includes("tech") && (
            <button
              type="button"
              onClick={() => setSelectedDomain(0)}
              className={`
                nes-btn w-full lg:h-[30%] text-sm md:text-base domain-btn
                ${selectedDomain === 0 ? "is-primary" : ""}
              `}
              aria-label="Technical Domain"
            >
              Technical
            </button>
          )}
          {domains.includes("design") && (
            <button
              type="button"
              onClick={() => setSelectedDomain(1)}
              className={`
                nes-btn w-full lg:h-[30%] text-sm md:text-base domain-btn
                ${selectedDomain === 1 ? "is-primary" : ""}
              `}
              aria-label="Design Domain"
            >
              Design
            </button>
          )}
          {domains.includes("management") && (
            <button
              type="button"
              onClick={() => setSelectedDomain(2)}
              className={`
                nes-btn w-full lg:h-[30%] text-sm md:text-base domain-btn
                ${selectedDomain === 2 ? "is-primary" : ""}
              `}
              aria-label="Management Domain"
            >
              Management
            </button>
          )}
        </div>
      </div>

  <div className="nes-container is-rounded is-dark with-title is-centered dark-nes-container w-full lg:w-[90%] relative dark-container-nes max-h-[75vh] overflow-y-auto task-box">

        {selectedSubDomain !== "" && (
          <button
            type="button"
            onClick={() => setSelectedSubDomain("")}
            className="nes-btn is-error absolute -top-2 -right-2 z-[50] h-fit btn-back"
            aria-label="Back to domain selection"
          >
            <i className="nes-icon close is-small"></i>
          </button>
        )}
        <div className="h-auto mb-10 mt-4 text-lg">Tasks</div>
        {selectedSubDomain !== "" && selectedDomain !== DOMAIN_MAP.management && (
          <div className="mb-4">
            <p className="text-xs">
              <span className="text-red-500 font-semibold">NOTE:</span>
              <span className="text-white"> Click to View Description</span>
            </p>
          </div>
        )}
        <div className="w-full  flex items-start relative">
          {domains.includes("tech") && selectedDomain === 0 && (
            <TechTask
              selectedSubDomain={selectedSubDomain}
              setSelectedSubDomain={setSelectedSubDomain}
            />
          )}
          {domains.includes("design") && selectedDomain === 1 && (
            <DesignTask
              selectedSubDomain={selectedSubDomain}
              setSelectedSubDomain={setSelectedSubDomain}
            />
          )}
          {domains.includes("management") && selectedDomain === 2 && (
            <ManagementTask
              selectedSubDomain={selectedSubDomain}
              setSelectedSubDomain={setSelectedSubDomain}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Task;