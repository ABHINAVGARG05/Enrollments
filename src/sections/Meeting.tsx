import BoundingBox from "../components/BoundingBox";
import Navbar from "../components/Navbar";
import Calendar from "../components/Calendar";
import Button from "../components/Button";
import secureLocalStorage from "react-secure-storage";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Meeting = () => {
  const [statusTech, setStatusTech] = useState(false);
  const [statusDesign, setStatusDesign] = useState(false);
  const [statusManagement, setStatusManagement] = useState(false);
  const [date, setDate] = useState<number | null>(null);
  const [time, setTime] = useState<string>("");
  const [id, setId] = useState<string>("");
  const [gmeet, setGmeet] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const isSelectedTime = (value: string) => time === value;
  const [scheduledTime, setScheduledTime] = useState<string>("");
  const [showBooked, setShowBooked] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(10);
  const navigate = useNavigate();
  const [justBooked, setJustBooked] = useState(false);

  // console.log(secureLocalStorage.getItem("userDetails"));

  const handleDate: (data: number) => void = (data) => {
    setDate(data);
    // console.log(date);
  };

  const handleTime = (data: string) => {
    setTime(data);
    // console.log(time);
  };

  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);

    const formattedDate = date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    const formattedTime = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    return `${formattedDate}, ${formattedTime}`;
  };

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
        // console.log("response", response);
        if (response.data) {
          setStatusTech(response.data.passed);
          console.log(response.data.passed);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

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
          setStatusDesign(response.data.passed);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

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
          }/applicatiostatus/statusmanagement/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // console.log("response", response);
        if (response.data) {
          setStatusManagement(response.data.passed);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const domains: string[] = [];

  if (statusTech) domains.push("Tech");
  if (statusDesign) domains.push("Design");
  if (statusManagement) domains.push("Management");

  useEffect(() => {
    const fetchId = async () => {
      const id = secureLocalStorage.getItem("id");

      if (typeof id === "string") {
        setId(id);
        console.log(id);
      } else {
        console.error("User id not found in local storage");
      }
    };
    fetchId();
  }, []);

  useEffect(() => {
    const savedLink = secureLocalStorage.getItem("gmeetLink");
    const savedTime = secureLocalStorage.getItem("scheduledTime");
    if (typeof savedLink === "string") {
      setGmeet(savedLink);
    }
    if (typeof savedTime === "string") {
      setScheduledTime(savedTime);
    }
  }, []);

  const scheduleTime = `2025-12-${date}T${time}:00.000+05:30`;
  console.log(scheduleTime);
  // "2025-12-10T22:00:00.000+05:30"


  useEffect(() => {
  if (gmeet && justBooked) {
    setShowBooked(true);
    setSecondsLeft(10);

    const interval = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    const timeout = setTimeout(() => {
      setShowBooked(false);
      setJustBooked(false); 
      clearInterval(interval);
    }, 10000);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }
}, [gmeet, justBooked]);


  const handleMeeting = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!date || !time) {
      alert("Please select date and time");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const meetingDetails = {
      candidateId: id,
      domains,
      scheduletime: scheduleTime,
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/meet/schedule`,
        meetingDetails
      );

      console.log(response);
      console.log(response.data.data.gmeetLink);
      const link = response.data.data.gmeetLink;
      const time = response.data.data.scheduledTime;

      secureLocalStorage.setItem("gmeetLink", link);
      secureLocalStorage.setItem("scheduledTime", time);
      setGmeet(link);
      setScheduledTime(time);
      setJustBooked(true); 
      // const storeDate = {
      //   date,
      //   time,
      // };

      // secureLocalStorage.setItem("interviewLink", link);
      // secureLocalStorage.setItem("storedDateTime", JSON.stringify(storeDate));
      // console.log(secureLocalStorage.getItem("userDetails"));
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    

    console.log(id);

    try{
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/meet/cancel`, 
        { candidateId: id }
      )

      console.log(response);
      Cookies.remove("jwtToken");
      secureLocalStorage.clear();

      setGmeet("");
      setScheduledTime("");
      setShowBooked(false);

      navigate("/");
      
    } catch(error){
      console.error(error);
    }

  }

  return (
    <div className="w-full min-h-screen h-full flex flex-col md:flex-row justify-center items-center p-4 overflow-auto">
      <Navbar />
      <BoundingBox className="relative  overflow-auto">
        <div className="w-full h-full text-center relative">
          <h1
            className="text-[1.5rem] md:text-[2.5rem] text-prime"
            style={{ textShadow: "3px 3px 0px red" }}
          >
            SCHEDULE A MEETING
          </h1>
          <div className="w-full h-full nes-container justify-center is-rounded is-dark text-2xl md:text-base text-left md:text-center overflow-auto max-h-[70vh] p-10">
            <div style={{ display: "flex", width: "100%" }}>
              <div style={{ width: "50%", marginRight: "20px" }}>
                <Calendar selectDate={handleDate} />
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "15px",
                }}
              >
                <div style={{ display: "flex" }}>
                  <button
                    className="nes-btn text-sm md:text-base domain-btn"
                    style={{
                      fontSize: "0.7rem",
                      backgroundColor: isSelectedTime("21:20")
                        ? "#fc7a00"
                        : undefined,
                      color: isSelectedTime("21:20") ? "white" : undefined,
                    }}
                    onClick={() => {
                      handleTime("21:20");
                    }}
                  >
                    9:20PM to 9:40PM
                  </button>
                  <button
                    className="nes-btn text-sm md:text-base domain-btn"
                    style={{
                      fontSize: "0.7rem",
                      backgroundColor: isSelectedTime("22:00")
                        ? "#fc7a00"
                        : undefined,
                      color: isSelectedTime("22:00") ? "white" : undefined,
                    }}
                    onClick={() => {
                      handleTime("22:00");
                    }}
                  >
                    10:00PM to 10:20PM
                  </button>
                  <button
                    className="nes-btn text-sm md:text-base domain-btn"
                    style={{
                      fontSize: "0.7rem",
                      backgroundColor: isSelectedTime("22:40")
                        ? "#fc7a00"
                        : undefined,
                      color: isSelectedTime("22:40") ? "white" : undefined,
                    }}
                    onClick={() => {
                      handleTime("22:40");
                    }}
                  >
                    10:40PM to 11:00PM
                  </button>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "30px",
                    alignItems: "center",
                    marginBottom: "55px",
                  }}
                >
                  <label
                    style={{
                      fontSize: "0.8rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={statusTech}
                      onChange={() => {}}
                      style={{ width: "20px", height: "20px" }}
                    />
                    Technical
                  </label>

                  <label
                    style={{
                      fontSize: "0.8rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={statusDesign}
                      onChange={() => {}}
                      style={{ width: "20px", height: "20px" }}
                    />
                    Design
                  </label>

                  <label
                    style={{
                      fontSize: "0.8rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={statusManagement}
                      onChange={() => {}}
                      style={{ width: "20px", height: "20px" }}
                    />
                    Management
                  </label>
                </div>

                <p style={{ fontSize: "0.9rem" }}>
                  Scheduled Time:-{" "}
                  {scheduledTime ? (
                    <strong style={{ color: "#fc7a00" }}>
                      {formatDateTime(scheduledTime)}
                    </strong>
                  ) : (
                    <span style={{ color: "#aaa" }}>Not scheduled yet</span>
                  )}
                </p>

                <Button
                  disabled={!gmeet}
                  onClick={() => window.open(gmeet, "_blank")}
                  className={
                    "text-white font-medium py-2 px-4 rounded-md transition-all duration-300"
                  }
                >
                  {gmeet ? "Interview Link" : "Link available after booking"}
                </Button>

                <Button
                  className={
                    "text-white font-medium py-2 px-4 rounded-md transition-all duration-300"
                  }
                  // onClick={handleMeeting}
                  // disabled={gmeet !== ""}
                  onClick={
                    gmeet && !showBooked
                      ? handleCancel
                      : handleMeeting
                  }
                  disabled={isLoading}
                >
                  {
                    showBooked
                    ? `Congratulations! Slot Booked (${secondsLeft}s)`
                    : gmeet
                    ? "Cancel Meeting"
                    : isLoading
                    ? "Hold Tight! Booking Your Slot"
                    : "Book Your Slot"
                  }

                  {/* TODO:- When meeting is canceled. clear link from the local storage. */}
                </Button>
              </div>
            </div>
          </div>

          <section className="icon-list flex gap-10 md:gap-8 mt-8 w-full mb-0 justify-center scale-75 md:scale-100">
            <a href="https://www.instagram.com/mfc_vit">
              <i className="nes-icon instagram is-medium"></i>
            </a>
            <a href="mailto:mozillafirefox@vit.ac.in">
              <i className="nes-icon gmail is-medium"></i>
            </a>
            <a href="https://www.linkedin.com/company/mfcvit?originalSubdomain=in">
              <i className="nes-icon linkedin is-medium"></i>
            </a>
          </section>
        </div>
      </BoundingBox>
    </div>
  );
};

export default Meeting;
