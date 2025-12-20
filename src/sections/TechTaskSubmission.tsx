import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import secureLocalStorage from "react-secure-storage";
import { ToastContent } from "../components/CustomToast";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { useTabStore } from "../store";
interface Props {
  setOpenToast: React.Dispatch<React.SetStateAction<boolean>>;
  setToastContent: React.Dispatch<React.SetStateAction<ToastContent>>;
}

interface CustomJwtPayload extends JwtPayload {
  isTechDone?: boolean;
}

// interface FormDataType {
//   question1: string | [string, string];
//   question2: string | [string, string];
//   question3: string | [string, string];
//   question4: string | [string, string];
//   question5: string | [string, string];
// }

const TechTaskSubmission = ({ setOpenToast, setToastContent }: Props) => {
  const [subdomain, setSubDomain] = useState<string[]>([]);
  const [isTechDone, setIsTechDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const id = secureLocalStorage.getItem("id");
  const DRAFT_KEY = id ? `tech_draft_${id}` : null;

  const [isSavingDraft, setIsSavingDraft] = useState(false);

  const [savingFields, setSavingFields] = useState<Record<string, boolean>>({});

  // const [formData, setFormData] = useState<FormDataType>({
  //   question1: "",
  //   question2: "",
  //   question3: "",
  //   question4: "",
  //   question5: "",
  // });
  
    interface FormData {
      [key: string]: [string, string];
    }
  
    const [isDraftLoaded, setIsDraftLoaded] = useState(false);
  const [formData, setFormData] = useState<FormData>({});
    const syncTimerRef = React.useRef<number | null>(null);
  
    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    if (checked) {
      setSubDomain((prevDomains) =>
        Array.from(new Set([...prevDomains, value]))
      );
    } else {
      setSubDomain((prevDomains) => prevDomains.filter((d) => d !== value));
    }
  };

  interface TechDraft {
    id: string;
    formData: FormData;
    subdomain: string[];
    updatedAt: number;
  }

const hydrateFromBackend = (task: any) => {
    if (!task) return;

    setSubDomain(task.subdomain || []);

    const restoredFormData: FormData = {};

    Object.entries(task).forEach(([key, value]) => {
      if (key.startsWith("question") && Array.isArray(value) && value[0]) {
        restoredFormData[key] = ["", value[0]];
      }
    });

    setFormData(restoredFormData);
  };

useEffect(() => {
    if (!DRAFT_KEY || !isDraftLoaded) return;

    const draft = {
      id,
      formData,
      subdomain,
      updatedAt: Date.now(),
    };

    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  }, [formData, subdomain, isDraftLoaded]);


  useEffect(() => {
      if (!id) return;
  
      if (DRAFT_KEY) {
        const raw = localStorage.getItem(DRAFT_KEY);
        if (raw) {
          try {
            const draft = JSON.parse(raw);
            if (draft?.id === id) {
              setFormData(draft.formData || {});
              setSubDomain(draft.subdomain || []);
            }
          } catch (err) {
            console.error("Failed to load local draft", err);
          } finally {
            setIsDraftLoaded(true);
          }
          return;
        }
      }
  
      // 2️⃣ fallback to backend
      const fetchDraftFromBackend = async () => {
        try {
          const token = Cookies.get("jwtToken");
          if (!token) return;
  
          const res = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/upload/tech/${id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
  
          const task = res.data?.data;
  
          if (!task || task.isDone) {
            setIsDraftLoaded(true);
            return;
          }
  
          hydrateFromBackend(task);
        } catch (err) {
          console.error("Failed to fetch draft from backend", err);
        } finally {
          setIsDraftLoaded(true);
        }
      };
  
      fetchDraftFromBackend();
    }, [id]);

    const syncDraftToServer = async () => {
        if (!id) return;
    
        const token = Cookies.get("jwtToken");
        if (!token) return;
    
        try {
          await axios.patch(
            `${import.meta.env.VITE_BASE_URL}/upload/tech/${id}`,
            buildBackendPayload(),
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setIsSavingDraft(false);
    setSavingFields({});
        } catch (err) {
          console.error("Draft sync failed (will retry later)", err);
        }
      };

    const buildBackendPayload = () => {
    const payload: Record<string, any> = {};

    payload.subdomain = subdomain;

    // flatten formData
    Object.entries(formData).forEach(([key, value]) => {
      if (value?.[1]?.trim()) {
        payload[key] = [value[1]];
      }
    });

    return payload;
  };

  useEffect(() => {
      if (!isDraftLoaded) return;
      if (!id) return;
  
      if (syncTimerRef.current) {
        clearTimeout(syncTimerRef.current);
      }
  
      syncTimerRef.current = window.setTimeout(() => {
        syncDraftToServer();
      }, 2000);
  
      return () => {
        if (syncTimerRef.current) {
          clearTimeout(syncTimerRef.current);
        }
      };
    }, [formData, subdomain, isDraftLoaded]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    question: string
  ) => {
    const { name, value } = e.target;

    setSavingFields((prev) => ({
    ...prev,
    [name]: true,
  }));

  
  setIsSavingDraft(true);

    setFormData((prevData) => ({
      ...prevData,
      [name]: [
        typeof prevData[name as keyof typeof prevData] === "object"
          ? (prevData[name as keyof typeof prevData] as [string, string])[0]
          : question,
        value,
      ],
    }));
  };

  const fetchUserDetails = async () => {
    try {
      // const id = secureLocalStorage.getItem("id");
      if (!id) throw new Error("User id not found in secureLocalStorage");
      const token = Cookies.get("jwtToken");
      if (!token) throw new Error("JWT token not found");

      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/user/user/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      secureLocalStorage.setItem("userDetails", JSON.stringify(response.data));

      if (response.data.techIsDone) {
        setIsTechDone(true);
        secureLocalStorage.setItem("TechSub", true);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const handleSubmitTechTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;

    if (subdomain.length === 0) {
      setOpenToast(true);
      setToastContent({
        message: "Please select at least one subdomain!",
        type: "warning",
      });
      return;
    }

    // const id = secureLocalStorage.getItem("id");
    if (!id) {
      setOpenToast(true);
      setToastContent({
        message: "User ID not found. Please try logging in again.",
        type: "error",
      });
      return;
    }

    const token = Cookies.get("jwtToken");
    if (!token) {
      setOpenToast(true);
      setToastContent({
        message: "Authentication token missing. Please log in again.",
        type: "error",
      });
      return;
    }

    // const updatedFormData = {
    //   ...formData,
    //   subdomain: subdomain.join(", "),
    // } as Record<string, unknown>;

        const payload = buildBackendPayload();


    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/upload/tech/${id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          timeout: 20000,
        }
      );

      if (response.data) {
        secureLocalStorage.setItem("TechSub", true);
        setIsTechDone(true);
        setOpenToast(true);
        setToastContent({
          message: "Task Submitted Successfully!",
          type: "success",
        });
        if (DRAFT_KEY) {
          localStorage.removeItem(DRAFT_KEY);
        }
        if (syncTimerRef.current) {
          clearTimeout(syncTimerRef.current);
        }
        await fetchUserDetails();
      }
    } catch (error) {
      console.error("Error submitting tech task:", error);
      setOpenToast(true);
      setToastContent({
        message: "Failed to submit task. Please try again or contact support.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Check if tech task is already submitted
  if (
    isTechDone ||
    secureLocalStorage.getItem("TechSub") === true ||
    secureLocalStorage.getItem("TechSub") === "true"
  ) {
    return (
      <div className="p-4">
        You've successfully submitted the Tech Task. You can now track the
        status of your application in the designated "Application Status" tab.
      </div>
    );
  }

  return (
    <>
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
        <h2>Choose a subdomain</h2>
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
                value="cyber-sec"
                checked={subdomain.includes("cyber-sec")}
                onChange={handleCheckboxChange}
              />
              <span className="text-xs md:text-xs">Cyber Security</span>
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
          name="question1"
          value={formData.question1?.[1] || ""}
          onChange={(e) => handleInputChange(e, "question1")}
          required
          placeholder="Write here..."
        ></textarea>
        <p className="text-xs text-gray-400">
  {savingFields["question1"] ? "Saving..." : "Saved"}
</p>

        <section className="my-2 text-xs md:text-sm">
          <span className="text-prime">Answer some general questions:</span>
          <br />
          {/* {quizQuestions.map((quiz, index) => (
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
                className="w-full text-label text-xs"
              >
                {quiz.question}
              </label>
              <br />
              <textarea
                id={`textarea_field_${index + 2}`}
                className="nes-textarea is-dark min-h-[5rem]"
                name={`question${index + 2}`}
                placeholder="Write here..."
                onChange={(e) => handleInputChange(e, quiz.question)}
                required
              ></textarea>
            </div>
          ))} */}
          {quizQuestions.map(
            (quiz, index) =>
              quiz.subdomain &&
              subdomain.includes(quiz.subdomain) && (
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
                    className="w-full text-label text-xs"
                  >
                    {quiz.question}
                  </label>
                  <br />
                  <textarea
                    id={`textarea_field_${index + 2}`}
                    className="nes-textarea is-dark min-h-[5rem]"
                    name={`question${index + 2}`}
                    value={formData[`question${index + 2}`]?.[1] || ""}
                    placeholder="Write here..."
                    onChange={(e) => handleInputChange(e, quiz.question)}
                    required
                  />
                  <div className="flex justify-end">
  <span className="text-xs text-gray-400">
    {savingFields[`question${index + 2}`] ? "Saving..." : "Saved"}
  </span>
</div>

                </div>
              )
          )}
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

const quizQuestions = [
  {
    domain: "tech",
    subdomain: "frontend",
    label: "tech_que1",
    question: "What is npm, and how does a developer use it?",
  },
  {
    domain: "tech",
    subdomain: "backend",
    label: "tech_que2",
    question:
      "What is the difference between a compiled language and an interpreted language?",
  },
  {
    domain: "tech",
    subdomain: "cp",
    label: "tech_que3",
    question:
      "Research XOR Linked Lists and explain how they work in your own words.",
  },
  {
    domain: "tech",
    subdomain: "app",
    label: "tech_que4",
    question:
      "Suppose you want to hide some data in a multimedia file. What would be your approach?",
  },
];

export default TechTaskSubmission;
