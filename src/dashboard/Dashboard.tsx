import { useEffect, useCallback } from "react";
import secureLocalStorage from "react-secure-storage";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Navbar from "../components/Navbar";
import BoundingBox from "../components/BoundingBox";
import Header from "../components/Header";
import Profile from "../sections/Profile";
import Task from "../sections/Task";
import TaskSubmission from "../sections/TaskSubmission";
import ApplicationStatus from "../sections/ApplicationStatus";
import { useTabStore } from "../store";
import { jwtDecode, JwtPayload } from "jwt-decode";

interface CustomJwtPayload extends JwtPayload {
  isProfileDone?: boolean; 
}

const Dashboard = () => {
  const { tabIndex, setTabIndex } = useTabStore();
  const navigate = useNavigate();

useEffect(() => {
    const jwtToken = Cookies.get("jwtToken");
    if (!jwtToken) {
      navigate("/");
      return;
    }
    try {
      const decoded = jwtDecode<CustomJwtPayload>(jwtToken);
      if (decoded?.isProfileDone) {
        setTabIndex(1);
        console.log("yes");
      }
    }catch(error) {
      console.log(error);
    }
  }, [navigate]); 



  const profileLocked = (() => {
    // Prefer backend claim
    const jwtToken = Cookies.get("jwtToken");
    try {
      if (jwtToken) {
        const decoded = jwtDecode<CustomJwtPayload>(jwtToken);
        if (decoded?.isProfileDone) return true;
      }
    } catch {
      // ignore decode errors
    }
    // Fallback to local flags
    try {
      const localDone = (secureLocalStorage.getItem && (secureLocalStorage.getItem("profileComplete") as any)) ?? false;
      if (localDone === true || localDone === "true") return true;
      const ud = secureLocalStorage.getItem("userDetails") as string | null;
      if (ud) {
        const parsed = JSON.parse(ud);
        if (parsed?.isProfileDone || parsed?.data?.isProfileDone) return true;
      }
    } catch {
      // noop
    }
    return false;
  })();

  const safeSetTabIndex = useCallback((index: number) => {
    if (profileLocked && index === 0) {
      setTabIndex(1);
      return;
    }
    setTabIndex(index);
  }, [profileLocked, setTabIndex]);

  const renderTabContent = () => {
    switch (tabIndex) {
      case 0:
        return <Profile />;
      case 1:
        return <Task />;
      case 2:
        return <TaskSubmission />;
      case 3:
        return <ApplicationStatus />;
      default:
        return <div>Invalid Tab</div>;
    }
  };
  useEffect(() => {
    console.log(tabIndex, "yoooo");
  },[tabIndex])
  return (
    <div className="w-full h-full flex flex-col md:flex-row justify-center items-center sm:flex p-4 ">
      <Navbar />
      <BoundingBox>
        <Header tabIndex={tabIndex} setTabIndex={safeSetTabIndex} profileLocked={profileLocked} />
        {renderTabContent()}
      </BoundingBox>
    </div>
  );
};

export default Dashboard;