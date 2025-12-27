import BoundingBox from "../components/BoundingBox";
import Navbar from "../components/Navbar";
import Calendar from "../components/Calendar";
import Button from "../components/Button";
import secureLocalStorage from "react-secure-storage";
import Cookies from "js-cookie";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CustomToast, { ToastContent } from "../components/CustomToast";

const Meeting = () => {
  const [openToast, setOpenToast] = useState(false);
  const [toastContent, setToastContent] = useState<ToastContent>({});
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
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const timeSlots = [
    { value: "21:20", label: "9:20PM to 9:40PM" },
    { value: "22:00", label: "10:00PM to 10:20PM" },
    { value: "22:40", label: "10:40PM to 11:00PM" },
    { value: "11:00", label: "11:00AM to 11:20AM" },
    { value: "11:20", label: "11:20AM to 11:40AM" },
    { value: "14:00", label: "2:00PM to 2:20PM" },
    { value: "15:00", label: "3:00PM to 3:20PM" },
    { value: "16:00", label: "4:00PM to 4:20PM" },
  ];

  const handleDate: (data: number) => void = (data) => {
    setDate(data);
  };

  const handleTime = (data: string) => {
    setTime(data);
    setDropdownOpen(false);
  };

  const selectedSlot = timeSlots.find(slot => slot.value === time);

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

      const token = Cookies.get("jwtToken");
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL
          }/applicatiostatus/statusdesign/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
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

      const token = Cookies.get("jwtToken");
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL
          }/applicatiostatus/statusmanagement/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data) {
          setStatusManagement(response.data.passed);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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

  // Ensure date is properly padded (e.g., "05" instead of "5")
  const formattedDate = date ? String(date).padStart(2, '0') : null;
  const scheduleTime = formattedDate ? `2025-12-${formattedDate}T${time}:00.000+05:30` : "";

  useEffect(() => {
    if (gmeet && justBooked) {
      setShowBooked(true);
      setSecondsLeft(5);

      const interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);

      const timeout = setTimeout(() => {
        setShowBooked(false);
        setJustBooked(false);
        clearInterval(interval);
      }, 5000);

      return () => {
        clearTimeout(timeout);
        clearInterval(interval);
      };
    }
  }, [gmeet, justBooked]);

  const isValidUrl = (url: string): boolean => {
    try {
      const parsed = new URL(url);
      // Only allow Google Meet URLs or standard https URLs
      return parsed.protocol === 'https:' && 
             (parsed.hostname.includes('meet.google.com') || 
              parsed.hostname.includes('google.com'));
    } catch {
      return false;
    }
  };

const handleMeeting = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!date || !time) {
      setOpenToast(true);
      setToastContent({
        message: "Please select date and time",
        type: "error",
      });
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

      const link = response.data.data.gmeetLink;
      const time = response.data.data.scheduledTime;

      secureLocalStorage.setItem("gmeetLink", link);
      secureLocalStorage.setItem("scheduledTime", time);
      setGmeet(link);
      setScheduledTime(time);
      setJustBooked(true);
      setIsLoading(false);
      setOpenToast(true);
      setToastContent({
        message: "Meeting scheduled successfully!",
        type: "success",
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const backendMessage =
          error.response?.data?.error ||
          error.response?.data?.message ||
          "Failed to book meeting";

        setOpenToast(true);
        setToastContent({
          message: backendMessage,
          type: "error",
        });
      }

      setIsLoading(false);
    }

  };

  const handleCancel = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/meet/cancel`,
        { candidateId: id }
      );

      Cookies.remove("jwtToken");
      secureLocalStorage.clear();

      setGmeet("");
      setScheduledTime("");
      setShowBooked(false);

      navigate("/");
      
    } catch(error) {
      console.error("Error cancelling meeting:", error);
      setOpenToast(true);
      setToastContent({
        message: "Failed to cancel meeting. Please try again or contact support.",
        type: "error",
      });
    }
  }

  return (
    <div className="w-full min-h-screen h-full flex flex-col md:flex-row justify-center items-center pt-0 px-4 overflow-auto">
      <Navbar />
      <BoundingBox className="relative">
        <div className="w-full h-full text-center relative">
          <h1
            className="text-[1.5rem] md:text-[2.5rem] text-prime"
            style={{ textShadow: "3px 3px 0px red" }}
          >
            SCHEDULE A MEETING
          </h1>
          <div className="w-full h-full nes-container justify-center is-rounded is-dark text-2xl md:text-base text-left md:text-center overflow-auto max-h-[70vh] p-10">
            <div className="flex flex-col md:flex-row w-full gap-6">
              <div className="w-full md:w-1/3">
                <Calendar selectDate={handleDate} />
              </div>


              <div className="flex flex-col gap-4 w-full md:w-2/3">

                {/* Dropdown for time slots */}
                <div className="relative w-full" ref={dropdownRef}>
                  <div
                    className="nes-btn cursor-pointer"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      width: "100%",
                      fontSize: "0.7rem",
                      textAlign: "left",
                      backgroundColor: time ? "#fc7a00" : undefined,
                      color: time ? "white" : undefined,
                    }}
                  >
                    <span>{selectedSlot ? selectedSlot.label : "Select Time Slot"}</span>
                    <span
                      style={{
                        color: "#fff",
                        fontSize: "1rem",
                        fontWeight: "bold",
                        transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.3s",
                        marginLeft: "1rem",
                      }}
                    >
                      ▼
                    </span>
                  </div>

                  {dropdownOpen && (
                    <div
                      className="absolute w-full z-50"
                      style={{
                        top: "100%",
                        left: 0,
                        marginTop: "0.25rem",
                        maxHeight: "300px",
                        overflowY: "auto",
                        border: "4px solid #fff",
                        padding: "0",
                        background: "#212529",
                      }}
                    >
                      {timeSlots.map((slot, index) => (
                        <div
                          key={slot.value}
                          onClick={() => handleTime(slot.value)}
                          className="cursor-pointer"
                          style={{
                            padding: "0.75rem 1rem",
                            fontSize: "0.7rem",
                            borderBottom: index !== timeSlots.length - 1 ? "2px solid #444" : "none",
                            backgroundColor: isSelectedTime(slot.value) ? "#fc7a00" : "#212529",
                            color: isSelectedTime(slot.value) ? "#fff" : "#fff",
                            transition: "all 0.2s",
                          }}
                          onMouseEnter={(e) => {
                            if (!isSelectedTime(slot.value)) {
                              e.currentTarget.style.backgroundColor = "#fc7a00";
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isSelectedTime(slot.value)) {
                              e.currentTarget.style.backgroundColor = "#212529";
                            }
                          }}
                        >
                          {slot.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 items-start sm:items-center mb-6">

                  <label className="flex items-center gap-2 text-sm">

                    <input
                      type="checkbox"
                      checked={statusTech}
                      onChange={() => { }}
                      style={{ width: "20px", height: "20px" }}
                    />
                    Technical
                  </label>

                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={statusDesign}
                      onChange={() => { }}
                      style={{ width: "20px", height: "20px" }}
                    />
                    Design
                  </label>

                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={statusManagement}
                      onChange={() => { }}
                      style={{ width: "20px", height: "20px" }}
                    />
                    Management
                  </label>
                </div>

                <p className="text-sm md:text-base">
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
                  onClick={() => {
                    if (gmeet && isValidUrl(gmeet)) {
                      window.open(gmeet, "_blank", "noopener,noreferrer");
                    } else {
                      setOpenToast(true);
                      setToastContent({
                        message: "Invalid meeting link. Please contact support.",
                        type: "error",
                      });
                    }
                  }}
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
                  onClick={gmeet && !showBooked ? handleCancel : handleMeeting}
                  disabled={isLoading}
                >
                  {showBooked
                    ? `Congratulations! Slot Booked (${secondsLeft}s)`
                    : gmeet
                      ? "Cancel Meeting"
                      : isLoading
                        ? "Hold Tight! Booking Your Slot"
                        : "Book Your Slot"}
                </Button>
              </div>
            </div>
          </div>

          <section className="icon-list flex gap-10 md:gap-8 mt-8 w-full mb-0 justify-center scale-75 md:scale-100">
            <a href="https://www.instagram.com/mfc_vit" aria-label="Follow MFC on Instagram" target="_blank" rel="noopener noreferrer">
              <i className="nes-icon instagram is-medium"></i>
            </a>
            <a href="mailto:mozillafirefox@vit.ac.in" aria-label="Email Mozilla Firefox Club">
              <i className="nes-icon gmail is-medium"></i>
            </a>
            <a href="https://www.linkedin.com/company/mfcvit?originalSubdomain=in" aria-label="Connect with MFC on LinkedIn" target="_blank" rel="noopener noreferrer">
              <i className="nes-icon linkedin is-medium"></i>
            </a>
          </section>
        </div>
      </BoundingBox>
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
    </div>
  );
};

export default Meeting;