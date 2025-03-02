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
      setToastContent({ message: "Please select at least one sub-domain!" });
      return;
    }

    const id = secureLocalStorage.getItem("id");
    secureLocalStorage.setItem("DesgSub",true);

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
        setOpenToast(true);
        setToastContent({ message: "Task Submitted Successfully!" });
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
    console.log("refresh--->", decoded);
    console.log(desg);
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
              <span className="text-xs md:text-xs">3D</span>
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

export default DesignTaskSubmission;
const quizSubQuestions = [
  {
    domain: "design",
    label: "design_que9",
    question:
      "Describe a project you've worked on where prototyping played a crucial role. What tools did you use, and how did you iterate on your prototypes to achieve the final design?",
  },
  {
    domain: "design",
    label: "design_que10",
    question:
      "Think of a user interface you find particularly intuitive or user-friendly. What specific design elements contribute to its effectiveness, and how would you apply similar principles to enhance the UI of a mobile app geared towards productivity?",
  },
  {
    domain: "design",
    label: "design_que11",
    question:
      "Imagine you're tasked with creating a poster for a fundraising event for a local charity. How would you approach the design to effectively communicate the cause and inspire people to participate? Feel free to describe your preferred design tools and any past experiences relevant to poster making.",
  },
  {
    domain: "design",
    label: "design_que12",
    question:
      "Reflect on a video editing project you've completed in the past. What challenges did you face during the editing process, and how did you overcome them to deliver a polished final product? Additionally, how do you ensure that your editing choices align with the intended message or theme of the video?",
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
