import { useEffect, useState } from "react";
import TechApplicationStatus from "./TechApplicationStatus";
import DesignApplicationStatus from "./DesignApplicationStatus";
import ManagementApplicationStatus from "./ManagementApplicationStatus";
import secureLocalStorage from "react-secure-storage";

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

const ApplicationStatus = () => {
  const [selectedDomain, setSelectedDomain] = useState(-1);
  const [domains, setDomains] = useState<string[]>([]);

  useEffect(() => {
    try {
      const userDetailsStr = secureLocalStorage.getItem("userDetails");
      
      if (userDetailsStr && typeof userDetailsStr === "string") {
        const userDetails = JSON.parse(userDetailsStr) as UserDetails;

        const userDomains = userDetails?.domain || userDetails?.data?.domain || [];
        
        if (userDomains.length > 0) {
          setDomains(userDomains);
        }
      }
    } catch (error) {
      console.error("Error parsing user details:", error);
      setDomains([]);
    }
  }, []);

  return (
    <div className="w-full profile py-6 flex gap-4 flex-col lg:flex-row">
      <div className="w-full nes-container is-rounded is-centered lg:w-[30%] invert">
        <div className="h-auto mb-4 text-lg">Domains</div>
        <div className="flex flex-col justify-between gap-4 lg:gap-8">
          {Array.isArray(domains) && domains.includes("tech") && (
            <button
              type="button"
              onClick={() => setSelectedDomain(0)}
              className={`nes-btn w-full lg:h-[30%] text-sm md:text-base domain-btn ${
                selectedDomain === 0 ? "is-primary" : ""
              }`}
            >
              Technical
            </button>
          )}
          {Array.isArray(domains) && domains.includes("design") && (
            <button
              onClick={() => setSelectedDomain(1)}
              type="button"
              className={`nes-btn w-full lg:h-[30%] text-sm md:text-base domain-btn ${
                selectedDomain === 1 ? "is-primary" : ""
              }`}
            >
              Design
            </button>
          )}
          {Array.isArray(domains) && domains.includes("management") && (
            <button
              onClick={() => setSelectedDomain(2)}
              type="button"
              className={`nes-btn w-full lg:h-[30%] text-sm md:text-base domain-btn ${
                selectedDomain === 2 ? "is-primary" : ""
              }`}
            >
              Management
            </button>
          )}
        </div>
      </div>

      <div className="text-white h-full w-full lg:w-[90%]">
        <div className="w-full bg-black h-full nes-container is-rounded is-centered with-title is-centered is-dark status-box">
          <div className="h-auto mb-4 text-lg">Status</div>
          {selectedDomain === -1 && <div className="text-xs">Select Domain to see Submissions</div>}
          {Array.isArray(domains) && domains.includes("tech") && selectedDomain === 0 && <TechApplicationStatus />}
          {Array.isArray(domains) && domains.includes("design") && selectedDomain === 1 && <DesignApplicationStatus />}
          {Array.isArray(domains) && domains.includes("management") && selectedDomain === 2 && <ManagementApplicationStatus />}
        </div>
      </div>
    </div>
  );
};

export default ApplicationStatus;
