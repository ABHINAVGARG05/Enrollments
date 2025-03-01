import { useEffect, useState } from "react";
import TechApplicationStatus from "./TechApplicationStatus";
import DesignApplicationStatus from "./DesignApplicationStatus";
import ManagementApplicationStatus from "./ManagementApplicationStatus";
import secureLocalStorage from "react-secure-storage";

const ApplicationStatus = () => {
  const [selectedDomain, setSelectedDomain] = useState(-1);
  const [domains, setDomains] = useState<string[]>([]);

  useEffect(() => {
    try {
      const userDetailsString = secureLocalStorage.getItem("userDetails");

      if (typeof userDetailsString === "string") {
        const userDetails = JSON.parse(userDetailsString) as { domain?: string[] };

        if (Array.isArray(userDetails.domain)) {
          setDomains(userDetails.domain);
        } else {
          console.warn("Domains is not an array, setting to empty array.");
          setDomains([]); // Default to empty array
        }
      } else {
        console.warn("No user details found in secureLocalStorage.");
        setDomains([]); // Ensure domains is always an array
      }
    } catch (error) {
      console.error("Error parsing user details:", error);
      setDomains([]); // Prevents crashing if parsing fails
    }
  }, []);

  return (
    <div className="w-full profile py-6 flex gap-4 flex-col lg:flex-row">
      <div className="w-full nes-container is-rounded is-centered lg:w-[30%] invert">
        <div className="h-auto mb-4 text-lg">Domains</div>
        <div className="flex flex-col justify-between lg:gap-4">
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
        <div className="w-full bg-black h-full nes-container is-rounded is-centered with-title is-centered is-dark">
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
