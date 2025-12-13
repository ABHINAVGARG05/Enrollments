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
          <div className="w-full h-fit nes-container justify-center is-rounded is-dark text-2xl md:text-base text-left md:text-center overflow-auto max-h-[50vh] p-10">
            <p>
              Here the content for meeting will come
            </p>
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
