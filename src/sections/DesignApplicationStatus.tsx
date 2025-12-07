import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import secureLocalStorage from "react-secure-storage";
import { useNavigate } from "react-router-dom";

const DesignApplicationStatus = () => {
  const [status, setStatus] = useState([]);
  const [redirect, setRedirect] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      const id = secureLocalStorage.getItem("id");
      if (!id) {
        console.error("User id not found in secureLocalStorage");
        return;
      }

      // console.log("id12", id);
      const token = Cookies.get("jwtToken");
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_BASE_URL
          }/applicatiostatus/statusdesign/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // console.log("response", response);
        if (response.data) {
          setStatus(response.data.message);
        }
        if(response.data.redirectTo){
          setRedirect(response.data.redirectTo);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return(

    <>
    <p className="text-prime text-sm ">{status}</p>
    { redirect!=="" &&   <p className="text-prime text-sm" onClick={() => {navigate(redirect)}}>Schedule a Meeting</p> }
  </> 
  )
};

export default DesignApplicationStatus;
