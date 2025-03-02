import { useEffect } from "react";
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
        // console.log("yes");
      }
    }catch(error) {
      console.log(error);
    }
  }, [navigate, setTabIndex]); 



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
    // console.log(tabIndex, "yoooo");
  },[tabIndex])
  return (
    <div className="w-full h-full flex flex-col md:flex-row justify-center items-center sm:flex p-4 ">
      <Navbar />
      <BoundingBox>
        <Header tabIndex={tabIndex} setTabIndex={setTabIndex} />
        {renderTabContent()}
      </BoundingBox>
    </div>
  );
};

export default Dashboard;