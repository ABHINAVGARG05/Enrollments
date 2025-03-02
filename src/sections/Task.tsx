import { useState, useEffect } from "react";
import TechTask from "./TechTask";
import DesignTask from "./DesignTask";
import ManagementTask from "./ManagementTask";
import { useTabStore } from "../store";
import Cookies from "js-cookie"
import secureLocalStorage from "react-secure-storage";
import { jwtDecode, JwtPayload } from "jwt-decode";
interface CustomJwtPayload extends JwtPayload {
  isProfileDone?: boolean; 
  domain ?: [];
}

const Task = () => {
  const { tabIndex, setTabIndex } = useTabStore();
  const [selectedDomain, setSelectedDomain] = useState(0);
  const [selectedSubDomain, setSelectedSubDomain] = useState("");
  const [domains, setDomains] = useState<string[]>([]);
  useEffect(() => {
    setSelectedSubDomain("");
  }, [selectedDomain]);

  const token = Cookies.get("refreshToken")
  if(token) {
    const decoded = jwtDecode<CustomJwtPayload>(token);

  useEffect(() => {
    if(decoded?.domain){
      setDomains(decoded?.domain)
    }
      // console.log("userDomains:", userDomains);
      //const isProfileDone = userDetails.isProfileDone;
      // if (isProfileDone) {
      //   setTabIndex(1);
      // } else {
      //   setTabIndex(0);
      //   // console.log("tabIndex", tabIndex);
      // }
  }, []);
 }

  return (
    <div className="w-full profile py-6 flex gap-4 flex-col lg:flex-row">
      <div className="w-full  nes-container is-rounded  is-centered lg:w-[30%] invert">
        <div className="h-auto mb-4 text-lg">Domains</div>
        <div className="flex flex-col justify-between gap-4 lg:gap-8">
          {domains?.includes("tech") && (
            <button
              type="button"
              onClick={() => setSelectedDomain(0)}
              className={`
              nes-btn w-full lg:h-[30%] text-sm md:text-base domain-btn
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
              nes-btn w-full lg:h-[30%] text-sm md:text-base domain-btn
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
              nes-btn w-full lg:h-[30%] text-sm md:text-base domain-btn
              ${selectedDomain === 2 && "is-primary"}
            `}
            >
              Management
            </button>
          )}
        </div>
      </div>

      <div className=" nes-container is-rounded is-dark with-title is-centered dark-nes-container w-full lg:w-[90%] relative dark-container-nes">
        {selectedSubDomain !== "" && (
          <button
            type="button"
            onClick={() => setSelectedSubDomain("")}
            className="nes-btn is-error absolute -top-2 -right-2 z-[50] h-fit btn-back"
          >
            <i className="nes-icon close is-small"></i>
          </button>
        )}
        <div className="h-auto mb-4 mt-2 text-lg">Tasks</div>
        <div className="w-full h-full flex items-center relative">
          {domains?.includes("tech") && selectedDomain === 0 && (
            <TechTask
              selectedSubDomain={selectedSubDomain}
              setSelectedSubDomain={setSelectedSubDomain}
            />
          )}
          {domains?.includes("design") && selectedDomain === 1 && (
            <DesignTask
              selectedSubDomain={selectedSubDomain}
              setSelectedSubDomain={setSelectedSubDomain}
            />
          )}
          {domains?.includes("management") && selectedDomain === 2 && (
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
