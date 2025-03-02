import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import secureLocalStorage from "react-secure-storage";
import { ToastContent } from "../components/CustomToast";
import { jwtDecode, JwtPayload } from "jwt-decode";
// import { useTabStore } from "../store";
interface Props {
  setOpenToast: React.Dispatch<React.SetStateAction<boolean>>;
  setToastContent: React.Dispatch<React.SetStateAction<ToastContent>>;
}

interface CustomJwtPayload extends JwtPayload {
  isManagementDone?: boolean; 
}

const ManagementTaskSubmission = ({ setOpenToast, setToastContent }: Props) => {
  // const [domain, setDomain] = useState<string[]>([]);
  const [coreType, setCoreType] = useState("junior");
  // const { tabIndex, setTabIndex } = useTabStore();
  const [subdomain, setSubDomain] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    question1: "",
    question2: "",
    question3: "",
    question4: "",
    question5: "",
    question6: "",
    question7: "",
    question8: "",
    question9: "",
    question10: "",
    question11: "",
    question12: "",
    question13: "",
    question14: "",
    question15: "",
    question16: "",
    question17: "",
  });

  useEffect(() => {
    const token = Cookies.get("jwtToken");
    if(token) {
      const decoded = jwtDecode<CustomJwtPayload>(token);
      if(decoded?.isManagementDone){
        setIsManagementDone(true);
      }
    }
    const localData = secureLocalStorage.getItem("userDetails") as
      | string
      | null;
    const data: { isSC?: boolean } = localData && JSON.parse(localData);
    if (data && data.isSC) {
      setCoreType("senior");
    } else {
      setCoreType("junior");
    }
  }, []);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    if (checked) {
      setSubDomain((prevDomains) => [...prevDomains, value]);
    } else {
      setSubDomain((prevDomains) =>
        prevDomains.filter((domain) => domain !== value)
      );
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    question: string
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: [
        prevData[name as keyof typeof formData]
          ? prevData[name as keyof typeof formData][0]
          : question,
        value,
      ],
    }));
  };

  const handleSubmitDesignTask = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (subdomain.length === 0) {
      setOpenToast(true);
      setToastContent({ message: "Please select at least one sub-domain!" });
      return;
    }

    secureLocalStorage.setItem("MangSub",true);

    const id = secureLocalStorage.getItem("id");
    if (!id) {
      console.error("User id not found in secureLocalStorage");
      return;
    }

    // console.log("id1", id);
    const token = Cookies.get("jwtToken") || secureLocalStorage.getItem("jwtToken");
    if (!token) {
      console.error("JWT token is missing. Authentication required.");
      return;
    }

    const updatedFormData = {
      ...formData,
      subdomain: subdomain.join(", "),
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/upload/management/${id}`,
        updatedFormData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Response:", response.data);
      if (response.data) {
        fetchUserDetails();
      }
      // console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  const fetchUserDetails = async () => {
    try {
      const id = secureLocalStorage.getItem("id");

      if (!id) {
        throw new Error("User id not found in secureLocalStorage");
      }
      const token = Cookies.get("jwtToken") || secureLocalStorage.getItem("jwtToken");

      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/user/user/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log(response.data);

      //console.log("User Details:", response.data);
      secureLocalStorage.setItem("userDetails", JSON.stringify(response.data));

      if (response.data.managementIsDone) {
        setIsManagementDone(true);
        setOpenToast(true);
        setToastContent({ message: "Task Submitted Successfully!" });
      }
    } catch (error: any) {
      console.error("Fetch User Details Error:", error.response?.data || error.message);
    }
  };
  const [isManagementDone, setIsManagementDone] = useState(false);
  //const [isTechDone, setIsTechDone] = useState(false);
  const userDetailsString = secureLocalStorage.getItem("userDetails");
  let mang = false;

  const token = Cookies.get("refreshToken");
  if (token) {
    const decoded = jwtDecode<CustomJwtPayload>(token);
    if (decoded?.isManagementDone) {
      mang = decoded?.isManagementDone;
    }
    //console.log("refresh--->", decoded)
  }
  if(secureLocalStorage.getItem("MangSub") || mang) {
    setOpenToast(true);
    setToastContent({
      message:"Task Submitted Successfully",
    })
    fetchUserDetails();
  }
  if (secureLocalStorage.getItem("MangSub")) {
    return (
      <div className="p-4">
        You've successfully submitted the Management Task. You can now track
        the status of your application in the designated "Application Status"
        tab.
      </div>
    );
  }
  return (
    <>
      {/* <div className="p-4">
        The time limit for task submissions has ended. Kindly await the results,
        which will be available in the application status tab, if you have
        submitted the tasks.
      </div> */}
      <section className="mb-4 text-xs md:text-sm">
        Append all your management tasks in following manner:
        <br />
        <span className="text-prime">[SubDomain] - [Link 1]</span>
        <br />
        <span className="text-prime hidden md:block">
          [SubDomain] - [Link 2]
        </span>
      </section>
      <form onSubmit={handleSubmitDesignTask}>
        <h2>Choose Sub-Domain</h2>
        <div className="flex">
          <div className="flex flex-col md:flex-row md:gap-4 flex-wrap justify-center mb-4 md:mb-0">
            <label>
              <input
                type="checkbox"
                className="nes-checkbox is-dark"
                value="generaloperations"
                checked={subdomain.includes("generaloperations")}
                onChange={handleCheckboxChange}
              />
              <span className="text-xs md:text-xs">General Operations</span>
            </label>
            <label>
              <input
                type="checkbox"
                className="nes-checkbox is-dark"
                value="outreach"
                checked={subdomain.includes("outreach")}
                onChange={handleCheckboxChange}
              />
              <span className="text-xs md:text-xs">Outreach</span>
            </label>
            <label>
              <input
                type="checkbox"
                className="nes-checkbox is-dark"
                value="publicity"
                checked={subdomain.includes("publicity")}
                onChange={handleCheckboxChange}
              />
              <span className="text-xs md:text-xs ">Publicity</span>
            </label>
            <label>
              <input
                type="checkbox"
                className="nes-checkbox is-dark"
                value="editorial"
                checked={subdomain.includes("editorial")}
                onChange={handleCheckboxChange}
              />
              <span className="text-xs md:text-xs">Editorial</span>
            </label>
          </div>
        </div>
        <textarea
          id="textarea_field"
          className="nes-textarea is-dark min-h-[15rem]"
          required
          name="question1"
          onChange={(e) => handleInputChange(e, "question1")}
          placeholder="Write here..."
        ></textarea>

        <section className="my-8  text-xs md:text-sm">
          <span className="text-prime">
            Answer some general questions: (Choose a sub-domain in order to
            procure your questions)
          </span>
          <br />
          <br />
          {quizQuestions.map(
            (quiz, index) =>
              quiz.subdomain &&
              subdomain.includes(quiz.subdomain) &&
              quiz.for === coreType && (
                <div
                  style={{
                    backgroundColor: "rgba(0,0,0,0)",
                    padding: "1rem",
                  }}
                  key={index}
                  className="nes-field is-inline flex flex-col mb-6 "
                >
                  <label
                    style={{ color: "#fff" }}
                    className="w-full text-label text-xs "
                  >
                    {quiz.question}
                  </label>
                  <br />
                  <textarea
                    id="textarea_field"
                    className="nes-textarea is-dark min-h-[5rem]"
                    required
                    name={`question${quiz.label + 1}`}
                    placeholder="Write here..."
                    onChange={(e) => handleInputChange(e, quiz.question)}
                  ></textarea>
                </div>
              )
          )}
        </section>
        <p className="text-prime text-xs md:text-sm mt-4 md:mt-0">
          Note: Once submitted you cannot revert back
        </p>
        <button
          type="submit"
          className="nes-btn is-error w-full text-xs md:text-sm"
        >
          Submit
        </button>
      </form>
    </>
  );
};

export default ManagementTaskSubmission;
const quizQuestions = [
  {
    domain: "management",
    subdomain: "generaloperations",
    label: 1,
    for: "junior",
    question:
      "Imagine a speaker session for our club. Now give us a basic idea of the event flow of that speaker session",
  },
  {
    domain: "management",
    subdomain: "generaloperations",
    label: 2,
    for: "junior",
    question:
      "As an event coordinator, you're assigned to lead a team project, but you're facing challenges with team members not meeting deadlines. How would you address this issue?",
  },
  {
    domain: "management",
    subdomain: "generaloperations",
    label: 3,
    for: "junior",
    question:
      "Scenario A: During a club meeting, a member presents a project that uses a controversial approach or technology. Scenario B: You're planning a club event, but there's a sudden conflict with another major event on campus, potentially impacting attendance. How would you facilitate a respectful discussion in both situations, ensuring all viewpoints are heard and a productive outcome is reached? What alternative plans would you consider in the second scenario to ensure the success of your event?",
  },
  {
    domain: "management",
    subdomain: "generaloperations",
    label: 4,
    for: "junior",
    question:
      "Describe a time when you had to resolve a conflict between team members. How did you handle it?",
  },
  {
    domain: "management",
    subdomain: "generaloperations",
    label: 5,
    for: "junior",
    question:
      "If you had to implement a new process or system within the club, how would you approach it?",
  },
  {
    domain: "management",
    subdomain: "outreach",
    label: 6,
    for: "junior",
    question:
      "Your club has planned a hackathon, but a key sponsor pulls out at the last minute. How would you adapt your event strategy and secure alternative funding to ensure the event's success?",
  },
  {
    domain: "management",
    subdomain: "outreach",
    label: 7,
    for: "junior",
    question:
      "Imagine you need to plan an outreach event for a specific community. How would you go about it?",
  },
  {
    domain: "management",
    subdomain: "outreach",
    label: 8,
    for: "junior",
    question:
      "How would you approach building partnerships with external organizations or individuals?",
  },
  {
    domain: "management",
    subdomain: "outreach",
    label: 9,
    for: "junior",
    question:
      "If you had to create a social media campaign for the club, what would be your strategy?",
  },
  {
    domain: "management",
    subdomain: "outreach",
    label: 10,
    for: "junior",
    question:
      "What strategies would you use to effectively communicate the club's mission and values to external stakeholders?",
  },
  {
    domain: "management",
    subdomain: "publicity",
    label: 11,
    for: "junior",
    question:
      "Describe your approach to creating a cohesive brand identity for the club.",
  },
  {
    domain: "management",
    subdomain: "publicity",
    label: 12,
    for: "junior",
    question: "How would you measure the success of a publicity campaign?",
  },
  {
    domain: "management",
    subdomain: "publicity",
    label: 13,
    for: "junior",
    question:
      "What strategies would you use to generate buzz or excitement around a club initiative?",
  },
  {
    domain: "management",
    subdomain: "publicity",
    label: 14,
    for: "junior",
    question:
      "If the club faced a public relations crisis, how would you handle it?",
  },
  {
    domain: "management",
    subdomain: "publicity",
    label: 15,
    for: "junior",
    question:
      "If the club faced negative publicity or criticism online, how would you respond and manage the situation?",
  },
  {
    domain: "management",
    subdomain: "editorial",
    label: 16,
    for: "junior",
    question:
      "Imagine you're editing a piece of content and discover a factual error. How would you approach fixing it",
  },
  {
    domain: "management",
    subdomain: "editorial",
    label: 17,
    for: "junior",
    question:
      "Do you have any ideas for a tech-driven editorial project the club could work on?",
  },
  {
    domain: "management",
    subdomain: "editorial",
    label: 18,
    for: "junior",
    question:
      "An article captures attention with a provocative headline, but the content feels exaggerated and lacks depth. How would you address this with the author?",
  },
  {
    domain: "management",
    subdomain: "editorial",
    label: 19,
    for: "junior",
    question:
      "Suggest a good title for an upcoming tech event or hackathon along with a catchy tagline.",
  },
  {
    domain: "management",
    subdomain: "editorial",
    label: 20,
    for: "junior",
    question:
      "What are your three favourite dialogues from the entertainment industry?",
  },
  {
    domain: "management",
    subdomain: "finance",
    label: 21,
    for: "junior",
    question:
      "Can you describe a situation in which you had to manage a limited budget effectively? How did you prioritize expenses?",
  },
  {
    domain: "management",
    subdomain: "finance",
    label: 22,
    for: "junior",
    question:
      "How do you plan to ensure that the club's expenses align with its financial goals and objectives?",
  },
  {
    domain: "management",
    subdomain: "finance",
    label: 23,
    for: "junior",
    question:
      "What strategies would you employ to identify potential cost-saving opportunities for the club without compromising quality?",
  },
  {
    domain: "management",
    subdomain: "finance",
    label: 24,
    for: "junior",
    question:
      "How would you handle unexpected expenses or budget overruns within the club? Can you provide an example from your past experience?",
  },
  {
    domain: "management",
    subdomain: "finance",
    label: 25,
    for: "junior",
    question:
      "In what ways do you believe technology can be leveraged to streamline expense tracking and financial management for the club?",
  },
  {
    domain: "management",
    subdomain: "generaloperations",
    label: 1,
    for: "senior",
    question:
      "Our club has received feedback from members indicating dissatisfaction with the current communication channels. How would you propose and implement improvements?",
  },
  {
    domain: "management",
    subdomain: "generaloperations",
    label: 2,
    for: "senior",
    question:
      "If you're unsure how to handle a particular aspect of your role in the management team, what steps would you take to seek advice and guidance from more experienced members or mentors within the club?",
  },
  {
    domain: "management",
    subdomain: "generaloperations",
    label: 3,
    for: "senior",
    question:
      "Imagine you receive negative feedback from club members about the structure of your club meetings. How would you gather additional feedback and implement changes to improve the overall experience for members?",
  },
  {
    domain: "management",
    subdomain: "generaloperations",
    label: 4,
    for: "senior",
    question:
      " Scenario A: During a club meeting, a member presents a project that uses a controversial approach or technology.Scenario B: You're planning a club event, but there's a sudden conflict with another major event on campus, potentially impacting attendance. How would you facilitate a respectful discussion in both situations, ensuring all viewpoints are heard and a productive outcome is reached? What alternative plans would you consider in the second scenario to ensure the success of your event?",
  },
  {
    domain: "management",
    subdomain: "generaloperations",
    label: 5,
    for: "senior",
    question:
      "How would you handle a situation where a team member consistently underperforms or fails to meet expectations?",
  },

  {
    domain: "management",
    subdomain: "outreach",
    label: 6,
    for: "senior",
    question:
      "Your club has planned a hackathon, but a key sponsor pulls out at the last minute. How would you adapt your event strategy and secure alternative funding to ensure the event's success?",
  },

  {
    domain: "management",
    subdomain: "outreach",
    label: 7,
    for: "senior",
    question:
      "How would you handle a situation where the club received negative feedback or criticism from the public?",
  },

  {
    domain: "management",
    subdomain: "outreach",
    label: 8,
    for: "senior",
    question:
      "Imagine you need to plan a community service or volunteering event. What steps would you take?",
  },

  {
    domain: "management",
    subdomain: "outreach",
    label: 9,
    for: "senior",
    question:
      "How would you approach identifying and reaching out to potential sponsors for the club?",
  },

  {
    domain: "management",
    subdomain: "outreach",
    label: 10,
    for: "senior",
    question:
      "How would you handle a situation where the club's outreach efforts were met with resistance or opposition from a particular community or group?",
  },
  {
    domain: "management",
    subdomain: "publicity",
    label: 11,
    for: "senior",
    question:
      "Let's say you're tasked with promoting an upcoming technical talk hosted by your club, but you're not familiar with effective marketing strategies. How would you approach spreading the word and engaging potential attendees?",
  },

  {
    domain: "management",
    subdomain: "publicity",
    label: 12,
    for: "senior",
    question:
      "What strategies would you use to generate buzz or excitement around a club initiative?",
  },

  {
    domain: "management",
    subdomain: "publicity",
    label: 13,
    for: "senior",
    question:
      "If the club faced negative publicity or criticism online, how would you respond and manage the situation?",
  },

  {
    domain: "management",
    subdomain: "publicity",
    label: 14,
    for: "senior",
    question:
      "How would you assess the current effectiveness of our club's publicity and promotional efforts? What metrics or indicators would you use to measure success?",
  },

  {
    domain: "management",
    subdomain: "publicity",
    label: 15,
    for: "senior",
    question:
      "What measures would you take to ensure consistency in our club's branding and messaging across different promotional channels and materials?",
  },
  {
    domain: "management",
    subdomain: "editorial",
    label: 16,
    for: "senior",
    question:
      "How would you approach incorporating multimedia elements (e.g., videos, infographics) into your content?",
  },
  {
    domain: "management",
    subdomain: "editorial",
    label: 17,
    for: "senior",
    question:
      "What techniques would you use to ensure the accuracy and objectivity of your editorial content?",
  },
  {
    domain: "management",
    subdomain: "editorial",
    label: 18,
    for: "senior",
    question:
      "How would you go about researching and fact-checking information for a piece of editorial content?",
  },

  {
    domain: "management",
    subdomain: "editorial",
    label: 19,
    for: "senior",
    question:
      "What strategies would you use to ensure that your editorial content is inclusive and representative of diverse perspectives?",
  },

  {
    domain: "management",
    subdomain: "editorial",
    label: 20,
    for: "senior",
    question:
      "If you had to collaborate with external contributors or guest authors, how would you manage the process?",
  },
  {
    domain: "management",
    subdomain: "finance",
    label: 21,
    for: "senior",
    question:
      "Can you outline your approach to negotiating contracts or agreements with vendors to secure favorable terms for the club?",
  },
  {
    domain: "management",
    subdomain: "finance",
    label: 22,
    for: "senior",
    question:
      "How do you plan to monitor and evaluate the club's financial performance on a regular basis? What key metrics would you focus on?",
  },

  {
    domain: "management",
    subdomain: "finance",
    label: 23,
    for: "senior",
    question:
      "Suppose there's a significant decrease in the club's revenue due to unforeseen circumstances. How would you adjust the budget to maintain financial stability?",
  },

  {
    domain: "management",
    subdomain: "finance",
    label: 24,
    for: "senior",
    question:
      "Can you describe a time when you successfully implemented a cost-control measure in a previous role or project? What was the outcome?",
  },
  {
    domain: "management",
    subdomain: "finance",
    label: 25,
    for: "senior",
    question:
      "How would you communicate financial information and updates to other club members or stakeholders to ensure transparency and accountability?",
  },
];
