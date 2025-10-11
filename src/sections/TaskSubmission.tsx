import { useEffect, useState } from "react";
import TechTaskSubmission from "./TechTaskSubmission";
import DesignTaskSubmission from "./DesignTaskSubmission";
import ManagementTaskSubmission from "./ManagementTaskSubmission";
import secureLocalStorage from "react-secure-storage";
import CustomToast from "../components/CustomToast";
import { ToastContent } from "../components/CustomToast";
import { jwtDecode, JwtPayload } from "jwt-decode";
import Cookies from "js-cookie"
interface CustomJwtPayload extends JwtPayload {
  isProfileDone?: boolean; 
  domain ?: [];
}

const DOMAIN_MAP = {
  tech: 0,
  design: 1,
  management: 2
};

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

const TaskSubmission = () => {
  const [openToast, setOpenToast] = useState(false);
  const [toastContent, setToastContent] = useState<ToastContent>({});
  const [selectedDomain, setSelectedDomain] = useState(-1);
  const [domains, setDomains] = useState<string[]>([]);
  const domainArr = ["tech", "design", "management"];
  const [domain, setDomain] = useState<string[]>([]);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    if (checked) {
      setDomain((prevDomains) => [...prevDomains, value]);
    } else {
      setDomain((prevDomains) =>
        prevDomains.filter((domain) => domain !== value)
      );
    }
  };

  useEffect(() => {
    const userDetailsStr = secureLocalStorage.getItem("userDetails");
      
      if (userDetailsStr && typeof userDetailsStr === "string") {
        const userDetails = JSON.parse(userDetailsStr) as UserDetails;
        
        // Handle both possible structures of userDetails
        const userDomains = userDetails?.domain || userDetails?.data?.domain || [];
       // const isProfileDone = userDetails?.isProfileDone || userDetails?.data?.isProfileDone;
        
        if (userDomains.length > 0) {
          setDomains(userDomains);
        }
      }
  }, []);

  return (
    <div className="w-full profile py-6 flex gap-4 flex-col lg:flex-row">
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
      <div className=" nes-container is-rounded h-full  max-h-fit text-sm with-title is-centered w-full lg:w-[30%] invert">
        <div className="h-auto mb-4 text-lg">Domains</div>
        <div className="flex flex-col h-full justify-start gap-4 lg:gap-8">
          {domains?.includes("tech") && (
            <button
              type="button"
              onClick={() => setSelectedDomain(0)}
              className={`
              nes-btn w-full lg:h-[20%] text-sm md:text-base domain-btn
              ${selectedDomain === 0 && "is-primary"}
            `}
            >
              Technical
            </button>
          )}
          {domains?.includes("design") && (
            <button
              onClick={() => setSelectedDomain(1)}
              type="button"
              className={`
              nes-btn w-full lg:h-[20%] text-sm md:text-base domain-btn
              ${selectedDomain === 1 && "is-primary"}
            `}
            >
              Design
            </button>
          )}
          {domains?.includes("management") && (
            <button
              onClick={() => setSelectedDomain(2)}
              type="button"
              className={`
              nes-btn w-full lg:h-[20%] text-sm  md:text-base domain-btn
              ${selectedDomain === 2 && "is-primary"}
            `}
            >
              Management
            </button>
          )}
        </div>
      </div>
      <div className="text-white w-full h-full lg:w-[90%] max-h-fit  overflow-y-scroll overflow-x-hidden">
      
        <div className="w-full h-fit nes-container is-rounded is-dark dark-nes-container text-sm overflow-y-scroll">
        <div className="h-auto mb-4 text-lg">Task Submission</div>
          {selectedDomain === -1 && (
            <div className="min-h-40 flex items-center justify-center text-center">
              Select any domain to submit task.
            </div>
          )}
          {domains?.includes("tech") && selectedDomain === 0 && (
            <TechTaskSubmission
              setOpenToast={setOpenToast}
              setToastContent={setToastContent}
            />
          )}
          {domains?.includes("design") && selectedDomain === 1 && (
            <DesignTaskSubmission
              setOpenToast={setOpenToast}
              setToastContent={setToastContent}
            />
          )}
          {domains?.includes("management") && selectedDomain === 2 && (
            <ManagementTaskSubmission
              setOpenToast={setOpenToast}
              setToastContent={setToastContent}
            />
          )}
        </div>
      </div>
    </div>
  );
};
// TODO: While submitting an empty form, show an error message
export default TaskSubmission;
