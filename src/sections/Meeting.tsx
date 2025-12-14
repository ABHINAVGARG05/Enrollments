import BoundingBox from "../components/BoundingBox";
import Navbar from "../components/Navbar";
import { useState } from 'react';
const Meeting = () => {
  const [loading, setLoading] = useState(false);

  const handleCancelMeeting = async (idOfMeetingToCancel: string) => {
    if (loading) return; // Prevent double clicks
    setLoading(true);

    // Make sure this matches your Backend URL
    const url = "http://localhost:5001/cancel"; 
    
    const dataToSend = {
        meetingId: idOfMeetingToCancel
    };

    try {
        const response = await fetch(url, {
            method: "POST", 
            headers: {
                "Content-Type": "application/json", 
            },
            body: JSON.stringify(dataToSend), 
        });

        const result = await response.json();

        if (response.ok) {
            alert("Meeting cancelled successfully!");
            console.log("Server response:", result);
        } else {
            alert("Failed to cancel: " + (result.message || "Unknown error"));
        }

    } catch (error) {
        console.error("Network error:", error);
        alert("Could not connect to the backend.");
    } finally {
        setLoading(false);
    }
  };
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
                  {scheduledDateTime ? (
                    <strong style={{ color: "#fc7a00" }}>
                      Dec {scheduledDateTime.date}, {scheduledDateTime.time}
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
                  onClick={handleMeeting}
                  disabled={gmeet !== ""}
                >
                  {gmeet
                    ? "Slot Booked"
                    : isLoading
                    ? "Hold Tight! Booking Your Slot"
                    : "Book Your Slot"}
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
