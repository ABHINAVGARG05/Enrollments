import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import secureLocalStorage from "react-secure-storage";
import { ToastContent } from "../components/CustomToast";
import { useTabStore } from "../store";
import { jwtDecode, JwtPayload } from "jwt-decode";
interface Props {
  setOpenToast: React.Dispatch<React.SetStateAction<boolean>>;
  setToastContent: React.Dispatch<React.SetStateAction<ToastContent>>;
}

interface CustomJwtPayload extends JwtPayload {
  isDesignDone?: boolean;
}
const DesignTaskSubmission = ({ setOpenToast, setToastContent }: Props) => {
  const { tabIndex, setTabIndex } = useTabStore();
  const [subdomain, setSubDomain] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  interface FormData {
    [key: string]: string | [string, string];
  }

  const [formData, setFormData] = useState<FormData>({
    question1: "",
    question2: "",
    question3: "",
    question4: "",
    question5: "",
  });

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target as HTMLInputElement;
    if (checked) {
      setSubDomain((prevDomains) => [...prevDomains, value]);
    } else {
      setSubDomain((prevDomains) =>
        prevDomains.filter((domain) => domain !== value)
      );
    }
  };

  const handleInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
    question: string
  ) => {
    const { name, value, type } = e.target as
      | HTMLInputElement
      | HTMLTextAreaElement;
    if (type === "radio" && e.target instanceof HTMLInputElement) {
      if (e.target.checked) {
        setFormData((prevData) => ({
          ...prevData,
          [name]: [prevData[name] ? prevData[name][0] : question, value],
        }));
        // console.log(name, value, type, e.target.checked);
      }
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: [prevData[name] ? prevData[name][0] : question, value],
      }));
    }
  };
  const handleSubmitTechTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (subdomain.length === 0) {
      setOpenToast(true);
      setToastContent({
        message: "Please select at least one sub-domain!",
        type: "warning",
      });
      return;
    }

    const id = secureLocalStorage.getItem("id");
    if (!id) {
      console.error("User id not found in secureLocalStorage");
      setOpenToast(true);
      setToastContent({
        message: "User ID not found. Please log in again.",
        type: "error",
      });
      return;
    }

    // console.log("id1", id);
    const token = Cookies.get("jwtToken");

    const updatedFormData = {
      ...formData,
      subdomain: subdomain.join(", "),
    };

    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/upload/design/${id}`,
        updatedFormData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log("response", response);
      if (response.data) {
        secureLocalStorage.setItem("DesgSub", true);
        setOpenToast(true);
        setToastContent({
          message: "Task Submitted Successfully!",
          type: "success",
        });
        await fetchUserDetails();
      }
      // console.log(response.data);
    } catch (error) {
      console.error(error);
      setOpenToast(true);
      setToastContent({
        message: "Failed to submit task. Please try again or contact support.",
        type: "error",
      });
    } finally {
      setLoading(false);
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
      if (response.data.designIsDone) {
        setIsDesignDone(true);
        // toast already shown on submit
      }
      // console.log(response.data);

      // console.log("techIsDone", response.data.techIsDone);
    } catch (error) {
      console.log(error);
    }
  };
  const [isDesignDone, setIsDesignDone] = useState(false);
  //const [isTechDone, setIsTechDone] = useState(false);
  const userDetailsString = secureLocalStorage.getItem("userDetails");
  let desg = false;

  const token = Cookies.get("refreshToken");
  if (token) {
    const decoded = jwtDecode<CustomJwtPayload>(token);
    if (decoded?.isDesignDone) {
      desg = decoded?.isDesignDone;
    }
    // console.log("refresh--->", decoded);
    // console.log(desg);
  }
  if (secureLocalStorage.getItem("DesgSub") || desg) {
    return (
      <div className="p-4">
        You've successfully submitted the Design Task. You can now track the
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
      <section className="mb-2  text-xs md:text-sm">
        Append all your design tasks in following manner:
        <br />
        <span className="text-prime">
          [Project Title 1] - [Figma / Gdrive / Other Link]
        </span>
        <br />
        <span className="text-prime hidden md:block">
          [Project Title 2] - [Figma / Gdrive / Other Link]
        </span>
      </section>
      <form onSubmit={handleSubmitTechTask}>
        <h2>Choose Sub-Domain</h2>
        <div className="flex">
          <div className="flex md:flex-row flex-col md:gap-4 flex-wrap justify-center">
            <label>
              <input
                type="checkbox"
                className="nes-checkbox is-dark"
                value="graphicdesign"
                checked={subdomain.includes("graphicdesign")}
                onChange={handleCheckboxChange}
              />
              <span className="text-xs md:text-xs">Graphic Design</span>
            </label>
            <label>
              <input
                type="checkbox"
                className="nes-checkbox is-dark"
                value="ui/ux"
                checked={subdomain.includes("ui/ux")}
                onChange={handleCheckboxChange}
              />
              <span className="text-xs md:text-xs">UI/UX</span>
            </label>
            <label>
              <input
                type="checkbox"
                className="nes-checkbox is-dark"
                value="3d"
                checked={subdomain.includes("3d")}
                onChange={handleCheckboxChange}
              />
              <span className="text-xs md:text-xs">3D Modelling</span>
            </label>
            <label>
              <input
                type="checkbox"
                className="nes-checkbox is-dark"
                value="videoediting/photography"
                checked={subdomain.includes("videoediting/photography")}
                onChange={handleCheckboxChange}
              />
              <span className="text-[0.6rem] md:text-xs">
                Videoediting/Photography
              </span>
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

        <section className="my-2  text-xs md:text-sm">
          <span className="text-prime">Answer some general questions:</span>
          <br />
          {quizQuestions.map((quiz, index) => (
            <div
              style={{
                backgroundColor: "rgba(0,0,0,0)",
                padding: "1rem",
              }}
              key={index}
              className="nes-field is-inline flex flex-col mb-6"
            >
              <label
                style={{ color: "#fff" }}
                className="w-full text-label text-xs "
              >
                {quiz.question}
              </label>
              <br />
              <div
                style={{ backgroundColor: "#212529", padding: "1rem 0" }}
                className="w-full flex flex-wrap justify-between"
              >
                {quiz.options.map((option, index) => (
                  <label
                    className="w-full md:w-[45%] text-xs mb-4"
                    key={index + 19992}
                  >
                    <input
                      type="radio"
                      className="nes-radio is-dark"
                      name={quiz.question}
                      value={option}
                      onChange={(e) => handleInputChange(e, quiz.question)}
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
              <textarea
                id="textarea_field"
                className="nes-textarea is-dark min-h-[5rem]"
                required
                name={quiz.label}
                placeholder="Write here..."
              ></textarea>
            </div>
          ))}
          {quizSubQuestions.map((quiz, index) => (
            <div
              style={{
                backgroundColor: "rgba(0,0,0,0)",
                padding: "1rem",
              }}
              key={index}
              className="nes-field is-inline flex flex-col mb-6"
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
                name={`question${index + 9}`}
                placeholder="Write here..."
                onChange={(e) => handleInputChange(e, quiz.question)}
                required
              ></textarea>
            </div>
          ))}
        </section>
        <p className="text-prime text-xs md:text-sm mt-4 md:mt-0">
          Note: Once submitted you cannot revert
        </p>
        <button
          type="submit"
          className="nes-btn is-error w-full text-xs md:text-sm"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </>
  );
};

export default DesignTaskSubmission;
const quizSubQuestions = [
  {
    domain: "design",
    label: "design_que9",
    question:
      'BrightHive, a fast-growing AI startup, needs a modern logo. After extensive research and iterations, you present a design that the marketing team and COO approve. However, the CEO, Alex, says, "Something feels off, but I can’t explain why." With no clear feedback and a tight deadline, how do you refine the design while ensuring alignment with the company’s vision?',
  },
  {
    domain: "design",
    label: "design_que10",
    question:
      'At GoFleet, a logistics platform, you present a redesigned dashboard backed by user data. Midway, senior VP Michael interrupts, saying, "This looks way more complicated than before." His opinion could influence the final decision. With only five minutes to respond, how do you justify your design and keep the project moving forward?',
  },
  {
    domain: "design",
    label: "design_que11",
    question:
      'During a usability test for SwiftPay’s bill-splitting feature, a participant, Sophia, repeatedly makes a mistake but dismisses it as "not paying attention." You suspect a UI flaw but can’t make changes yet. How do you confirm if it’s user error or a design issue without influencing the results?',
  },
  {
    domain: "design",
    label: "design_que12",
    question:
      'You’re editing a documentary for Echo Films about farmers facing climate change. The most emotional interview, featuring David, is suddenly cut by the producer, Linda, who says, "The client thinks it’s too bleak." Losing it weakens the story. How do you convince Linda to keep the integrity of the film while addressing client concerns?',
  },
  {
    domain: "design",
    label: "design_que13",
    question:
      'ViralView, a media company, sends you raw footage for an ad campaign but provides no script, storyboard, or guidance—just a message from the creative director, James: "Make something great." With a tight deadline and unclear expectations, how do you decide on storytelling, editing style, and pacing to ensure the final product impresses?',
  },
];
const quizQuestions = [
  {
    domain: "design",
    label: "design_que1",
    question:
      "In Figma, what feature allows multiple designers to collaborate simultaneously on the same design file?",
    options: [
      "Version control",
      "Real-time Editing",
      "Component libraries",
      "Auto-layout",
    ],
  },
  {
    domain: "design",
    label: "design_que2",
    question:
      "Which tool in Adobe Photoshop is used to remove unwanted elements from a photo seamlessly?",
    options: [
      "Clone Stamp Tool",
      "Magic Wand Tool",
      "Gradient Tool",
      "Crop Tool",
    ],
  },
  {
    domain: "design",
    label: "design_que3",
    question:
      "When creating a motion graphic in Adobe After Effects, what is the purpose of the 'Keyframe'?",
    options: [
      "To lock a layer in place",
      "To mark the beginning and end of an animation",
      "To apply a special effect",
      "To adjust the brightness and contrast",
    ],
  },
  {
    domain: "design",
    label: "design_que4",
    question:
      "Which file format is commonly used for 3D models and can be imported into various 3D rendering software?",
    options: [".SVG", ".OBJ", ".PSD", ".PNG"],
  },
  {
    domain: "design",
    label: "design_que5",
    question: "In video editing, what does the term 'cutaway' refer to?",
    options: [
      "A transition between scenes",
      "Removing unwanted parts of a video clip",
      "Inserting a secondary shot to cover a jump in continuity",
      "Adjusting the audio levels of a clip",
    ],
  },
  {
    domain: "design",
    label: "design_que6",
    question:
      "Which tool in Canva allows users to apply pre-designed styles and formatting to their designs?",
    options: ["Effects tool", "Layouts tool", "Brand Kit", "Templates tool"],
  },
  {
    domain: "design",
    label: "design_que7",
    question:
      "What is the purpose of the 'Bezier Curve' tool in vector graphic design software like Adobe Illustrator?",
    options: [
      "To create straight lines",
      "To create complex shapes with smooth curves",
      "To fill shapes with color",
      "To crop images",
    ],
  },
  {
    domain: "design",
    label: "design_que8",
    question:
      "When rendering a 3D scene, what does the term 'ray tracing' refer to?",
    options: [
      "Simulating the behavior of light rays to create realistic lighting and reflections",
      "Creating wireframe models",
      "Applying textures to 3D models",
      "Adjusting the camera angle",
    ],
  },
];
