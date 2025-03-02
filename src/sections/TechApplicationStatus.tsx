import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import secureLocalStorage from "react-secure-storage";

const TechApplicationStatus = () => {
  const [status, setStatus] = useState([]);

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
          `${import.meta.env.VITE_BASE_URL}/applicatiostatus/statustech/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("response", response);
        if (response.data) {
          setStatus(response.data.message);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return <p className="text-prime text-sm ">{status}</p>;
};

export default TechApplicationStatus;
