import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import secureLocalStorage from "react-secure-storage";

// import { useTabStore } from "../store";
import { ToastContent } from "../components/CustomToast";
import { jwtDecode, JwtPayload } from "jwt-decode";
// import { useTabStore } from "../store";
interface Props {
  setOpenToast: React.Dispatch<React.SetStateAction<boolean>>;
  setToastContent: React.Dispatch<React.SetStateAction<ToastContent>>;
}

interface CustomJwtPayload extends JwtPayload {
  isTechDone?: boolean;
}

const TechTaskSubmission = ({ setOpenToast, setToastContent }: Props) => {
  // const { tabIndex, setTabIndex } = useTabStore();
  const [subdomain, setSubDomain] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    question1: "",
    question2: "",
    question3: "",
    question4: "",
    question5: "",
  });

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

  const handleSubmitTechTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (subdomain.length === 0) {
      setOpenToast(true);
      setToastContent({ message: "Please select at least one sub-domain!" });
      return;
    }

    const id = secureLocalStorage.getItem("id");
    secureLocalStorage.setItem("TechSub", true);

    if (!id) {
      console.error("User id not found in secureLocalStorage");
      return;
    }

    // console.log("id1", id);
    const token = Cookies.get("jwtToken");

    const updatedFormData = {
      ...formData,
      subdomain: subdomain.join(", "),
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/upload/tech/${id}`,
        updatedFormData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("response", response);
      if (response.data) {
        fetchUserDetails();
      }
      console.log(response.data);
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
      const token = Cookies.get("jwtToken");
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/user/user/${id}`,
        {
          headers: {
            Authorization: `Bearer ` + `${token}`,
          },
        }
      );
      // console.log(response.data);

      secureLocalStorage.setItem("userDetails", JSON.stringify(response.data));

      // console.log(response.data);
      if (response.data.techIsDone) {
        setIsTechDone(true);
        setOpenToast(true);
        setToastContent({ message: "Task Submitted Successfully!" });
      }
      // console.log("techIsDone", response.data.techIsDone);
    } catch (error) {
      console.log(error);
    }
  };

  const [isTechDone, setIsTechDone] = useState(false);
  //const [isTechDone, setIsTechDone] = useState(false);
  const userDetailsString = secureLocalStorage.getItem("userDetails");
  let tech = false;

  const token = Cookies.get("refreshToken");
  if (token) {
    const decoded = jwtDecode<CustomJwtPayload>(token);
    if (decoded?.isTechDone) {
      tech = decoded?.isTechDone;
    }
    console.log("refresh--->", decoded)
  }

  // if (typeof userDetailsString === "string") {
  //   const userDetails = JSON.parse(userDetailsString);
  //   console.log(userDetails,'hbjqkcao;a')
  //   if (Array.isArray(userDetails?.data.techIsDone) && userDetails?.techIsDone.length > 0) {
  //     tech = userDetails?.data.techIsDone[0]; 
  //   }
  //   console.log(tech,"hihdwuoacbso")
  // }

  if (secureLocalStorage.getItem("TechSub")) {
    {
      return (
        <div className="p-4">
          You've successfully submitted the Tech Task. You can now track the
          status of your application in the designated "Application Status" tab.
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
          Append all your tech tasks in following manner:
          <br />
          <span className="text-prime">
            [Project Title 1] - [Github Link 1] - [Demo Link 1]
          </span>
          <br />
          <span className="text-prime hidden md:block">
            [Project Title 2] - [Github Link 2] - [Demo Link 2]
          </span>
        </section>
        <form onSubmit={handleSubmitTechTask}>
          <h2>Choose Sub-Domain</h2>
          <div className="flex">
            <div className="flex flex-row gap-4 flex-wrap justify-center">
              <label>
                <input
                  type="checkbox"
                  className="nes-checkbox is-dark"
                  value="frontend"
                  checked={subdomain.includes("frontend")}
                  onChange={handleCheckboxChange}
                />
                <span className="text-xs md:text-xs">Frontend</span>
              </label>
              <label>
                <input
                  type="checkbox"
                  className="nes-checkbox is-dark"
                  value="backend"
                  checked={subdomain.includes("backend")}
                  onChange={handleCheckboxChange}
                />
                <span className="text-xs md:text-xs">Backend</span>
              </label>
              <label>
                <input
                  type="checkbox"
                  className="nes-checkbox is-dark"
                  value="fullstack"
                  checked={subdomain.includes("fullstack")}
                  onChange={handleCheckboxChange}
                />
                <span className="text-xs md:text-xs">Fullstack</span>
              </label>
              <label>
                <input
                  type="checkbox"
                  className="nes-checkbox is-dark"
                  value="app"
                  checked={subdomain.includes("app")}
                  onChange={handleCheckboxChange}
                />
                <span className="text-xs md:text-xs">App Dev</span>
              </label>
              <label>
                <input
                  type="checkbox"
                  className="nes-checkbox is-dark"
                  value="ml"
                  checked={subdomain.includes("ml")}
                  onChange={handleCheckboxChange}
                />
                <span className="text-xs md:text-xs">AI/ML</span>
              </label>
              <label>
                <input
                  type="checkbox"
                  className="nes-checkbox is-dark"
                  value="gamedev"
                  checked={subdomain.includes("gamedev")}
                  onChange={handleCheckboxChange}
                />
                <span className="text-xs md:text-xs">Game Dev</span>
              </label>
              <label>
                <input
                  type="checkbox"
                  className="nes-checkbox is-dark"
                  value="cp"
                  checked={subdomain.includes("cp")}
                  onChange={handleCheckboxChange}
                />
                <span className="text-xs md:text-xs">CP</span>
              </label>
            </div>
          </div>
          <textarea
            id="textarea_field"
            className="nes-textarea is-dark min-h-[15rem]"
            // required
            name="question1"
            onChange={(e) => handleInputChange(e, "question1")}
            required
            placeholder="Write here..."
          ></textarea>

          <section className="my-2  text-xs md:text-sm">
            <span className="text-prime">Answer some general questions:</span>
            <br />
            {quizQuestions.map((quiz, index) => (
              <div
                style={{
                  backgroundColor: "rgba(0,0,0,0)",
                  padding: "1rem",
                }}
                className="nes-field is-inline flex flex-col mt-4"
                key={index}
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
                  // required
                  name={`question${index + 2}`}
                  placeholder="Write here..."
                  onChange={(e) => handleInputChange(e, quiz.question)}
                  required
                ></textarea>
              </div>
            ))}
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
  }

  export default TechTaskSubmission;
  const quizQuestions = [
    {
      domain: "tech",
      label: "tech_que1",
      question: "What is npm, and how does a developer use it?",
    },
    {
      domain: "tech",
      label: "tech_que2",
      question:
        "What is the difference between a compiled language and an interpreted language?",
    },
    {
      domain: "tech",
      label: "tech_que3",
      question:
        "Research XOR Linked Lists and explain how they work in your own words.",
    },
    {
      domain: "tech",
      label: "tech_que4",
      question:
        "Suppose you want to hide some data in a multimedia file. What would be your approach?",
    },
  ];
