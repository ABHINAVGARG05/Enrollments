import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import secureLocalStorage from "react-secure-storage";
import { ToastContent } from "../components/CustomToast";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { DraftResumeModal, DraftStatusIndicator } from "../hooks/useDraftSystem";

interface CustomJwtPayload extends JwtPayload {
  isDesignDone?: boolean;
}

interface Props {
  setOpenToast: React.Dispatch<React.SetStateAction<boolean>>;
  setToastContent: React.Dispatch<React.SetStateAction<ToastContent>>;
}

const BROADCAST_CHANNEL_NAME = "mfc_design_draft_sync";

const DesignTaskSubmission = ({ setOpenToast, setToastContent }: Props) => {
  const [subdomain, setSubDomain] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const id = secureLocalStorage.getItem("id");
  const DRAFT_KEY = id ? `design_draft_${id}` : null;
  const [savingFields, setSavingFields] = useState<Record<string, boolean>>({});
  const [isSyncing, setIsSyncing] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [lastSaved, setLastSaved] = useState<number | null>(null);
  const [showResumePrompt, setShowResumePrompt] = useState(false);
  const [pendingDraft, setPendingDraft] = useState<{formData: FormData; subdomain: string[]; updatedAt: number} | null>(null);

  interface FormData {
    [key: string]: [string, string];
  }

  const [isDraftLoaded, setIsDraftLoaded] = useState(false);
  const [formData, setFormData] = useState<FormData>({});
  const syncTimerRef = useRef<number | null>(null);
  const syncQueueRef = useRef<{formData: FormData; subdomain: string[]}[]>([]);
  const broadcastChannelRef = useRef<BroadcastChannel | null>(null);
  const versionRef = useRef(0);

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

  interface BackendTaskResponse {
    subdomain?: string[];
    [key: string]: unknown;
  }

  const hydrateFromBackend = useCallback((task: BackendTaskResponse) => {
    if (!task) return;

    setSubDomain(task.subdomain || []);

    const restoredFormData: FormData = {};

    Object.entries(task).forEach(([key, value]) => {
      if (key.startsWith("question") && Array.isArray(value) && value.length > 0) {
        const val = value[0];
        if (typeof val === 'string') {
            restoredFormData[key] = ["", val];
        }
      }
    });

    setFormData(restoredFormData);
  }, []);

  useEffect(() => {
    if (!DRAFT_KEY || !isDraftLoaded) return;

    const draft = {
      id,
      formData,
      subdomain,
      updatedAt: Date.now(),
      version: ++versionRef.current,
    };

    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
      setLastSaved(Date.now());
    } catch (err) {
      console.error("Failed to save draft:", err);
    }

    if (broadcastChannelRef.current) {
      broadcastChannelRef.current.postMessage({
        type: "DRAFT_UPDATE",
        draft,
        tabId: sessionStorage.getItem("tabId"),
      });
    }
  }, [formData, subdomain, isDraftLoaded, DRAFT_KEY, id]);

  useEffect(() => {
    if (!id) return;

    const initDraft = async () => {
      if (DRAFT_KEY) {
        const raw = localStorage.getItem(DRAFT_KEY);
        if (raw) {
          try {
            const draft = JSON.parse(raw);
            if (draft?.id === id) {
              const hasContent = Object.keys(draft.formData || {}).length > 0 || 
                                (draft.subdomain || []).length > 0;
              
              if (hasContent) {
                setPendingDraft(draft);
                setShowResumePrompt(true);
                return;
              }
            }
          } catch (err) {
            console.error("Failed to load local draft", err);
          }
        }
      }

      try {
        const token = Cookies.get("jwtToken");
        if (!token) {
          setIsDraftLoaded(true);
          return;
        }

        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/upload/design/${id}`,
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

    initDraft();
  }, [id, DRAFT_KEY, hydrateFromBackend]);

  const buildBackendPayload = useCallback(() => {
    const payload: Record<string, string[]> = {};

    payload.subdomain = subdomain;

    // flatten formData
    Object.entries(formData).forEach(([key, value]) => {
      if (value?.[1]?.trim()) {
        payload[key] = [value[1]];
      }
    });

    return payload;
  }, [formData, subdomain]);

  const syncDraftToServer = useCallback(async () => {
    if (!id) return;

    const token = Cookies.get("jwtToken");
    if (!token) return;

    try {
      setIsSyncing(true);
      await axios.patch(
        `${import.meta.env.VITE_BASE_URL}/upload/design/${id}`,
        buildBackendPayload(),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSavingFields({});
    } catch (err) {
      console.error("Draft sync failed (will retry later)", err);
      syncQueueRef.current.push({ formData, subdomain });
    } finally {
      setIsSyncing(false);
    }
  }, [id, buildBackendPayload, formData, subdomain]);

  const processOfflineQueue = useCallback(async () => {
    if (syncQueueRef.current.length === 0) return;
    
    const queue = [...syncQueueRef.current];
    syncQueueRef.current = [];
    
    for (const item of queue) {
      try {
        const token = Cookies.get("jwtToken");
        if (!token || !id) continue;

        const payload: Record<string, string[]> = { subdomain: item.subdomain };
        Object.entries(item.formData).forEach(([key, value]) => {
          if (value?.[1]?.trim()) {
            payload[key] = [value[1]];
          }
        });

        await axios.patch(
          `${import.meta.env.VITE_BASE_URL}/upload/design/${id}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (err) {
        console.error("Queue sync failed:", err);
        syncQueueRef.current.push(item);
      }
    }
  }, [id]);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      processOfflineQueue();
    };

    const handleOffline = () => {
      setIsOffline(true);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [processOfflineQueue]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (!DRAFT_KEY) return;
      
      const draft = {
        id,
        formData,
        subdomain,
        updatedAt: Date.now(),
        version: versionRef.current,
      };
      
      try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
      } catch (err) {
        console.error("Emergency save failed:", err);
      }

      if (navigator.onLine && id) {
        const token = Cookies.get("jwtToken");
        if (token) {
          const payload: Record<string, string[]> = { subdomain };
          Object.entries(formData).forEach(([key, value]) => {
            if (value?.[1]?.trim()) {
              payload[key] = [value[1]];
            }
          });

          const blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
          navigator.sendBeacon(
            `${import.meta.env.VITE_BASE_URL}/upload/design/${id}?token=${token}`,
            blob
          );
        }
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [formData, subdomain, DRAFT_KEY, id]);

  useEffect(() => {
    if (!sessionStorage.getItem("tabId")) {
      sessionStorage.setItem("tabId", Math.random().toString(36).substring(7));
    }

    try {
      broadcastChannelRef.current = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
      
      broadcastChannelRef.current.onmessage = (event) => {
        const { type, draft, tabId } = event.data;
        const myTabId = sessionStorage.getItem("tabId");

        if (type === "DRAFT_UPDATE" && tabId !== myTabId) {
          if (draft.version > versionRef.current) {
            setFormData(draft.formData);
            setSubDomain(draft.subdomain);
            versionRef.current = draft.version;
          }
        }
      };
    } catch (err) {
      console.warn("BroadcastChannel not supported:", err);
    }

    return () => {
      broadcastChannelRef.current?.close();
    };
  }, []);

  useEffect(() => {
    if (!isDraftLoaded) return;
    if (!id) return;

    if (syncTimerRef.current) {
      clearTimeout(syncTimerRef.current);
    }

    syncTimerRef.current = window.setTimeout(() => {
      if (navigator.onLine) {
        syncDraftToServer();
      } else {
        syncQueueRef.current.push({ formData, subdomain });
      }
    }, 2000);

    return () => {
      if (syncTimerRef.current) {
        clearTimeout(syncTimerRef.current);
      }
    };
  }, [formData, subdomain, isDraftLoaded, id, syncDraftToServer]);

  const resumeDraft = useCallback(() => {
    if (pendingDraft) {
      setFormData(pendingDraft.formData);
      setSubDomain(pendingDraft.subdomain);
    }
    setShowResumePrompt(false);
    setPendingDraft(null);
    setIsDraftLoaded(true);
  }, [pendingDraft]);

  const discardDraft = useCallback(() => {
    if (DRAFT_KEY) {
      localStorage.removeItem(DRAFT_KEY);
    }
    setShowResumePrompt(false);
    setPendingDraft(null);
    setIsDraftLoaded(true);
  }, [DRAFT_KEY]);

  const handleInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
    question: string
  ) => {
    const { name, value, type } = e.target as
      | HTMLInputElement
      | HTMLTextAreaElement;

    setSavingFields((prev) => ({
      ...prev,
      [name]: true,
    }));
    if (type === "radio" && e.target instanceof HTMLInputElement) {
      if (e.target.checked) {
        setFormData((prevData) => ({
          ...prevData,
          [name]: [prevData[name] ? prevData[name][0] : question, value],
        }));
      }
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: [prevData[name] ? prevData[name][0] : question, value],
      }));
    }
  };
  const handleSubmitDesignTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

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

    // const updatedFormData = {
    //   ...formData,
    //   subdomain: subdomain.join(", "),
    // };
    const payload = buildBackendPayload();

    // Check if any questions were answered (payload will always contain 'subdomain')
    if (Object.keys(payload).length <= 1) {
      setOpenToast(true);
      setToastContent({
        message: "Please answer at least one question before submitting.",
        type: "warning",
      });
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/upload/design/${id}`,
        payload,
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
        if (DRAFT_KEY) {
          localStorage.removeItem(DRAFT_KEY);
        }
        if (syncTimerRef.current) {
          clearTimeout(syncTimerRef.current);
        }

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
      // const id = secureLocalStorage.getItem("id");

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

  // Check submission status on mount (moved from render to useEffect)
  useEffect(() => {
    const checkSubmissionStatus = () => {
      const token = Cookies.get("refreshToken");
      if (token) {
        try {
          const decoded = jwtDecode<CustomJwtPayload>(token);
          if (decoded?.isDesignDone) {
            setIsDesignDone(true);
          }
        } catch (err) {
          console.error("Error decoding refresh token:", err);
        }
      }
      if (secureLocalStorage.getItem("DesgSub")) {
        setIsDesignDone(true);
      }
    };
    checkSubmissionStatus();
  }, []);

  if (isDesignDone) {
    return (
      <div className="p-4">
        You've successfully submitted the Design Task. You can now track the
        status of your application in the designated "Application Status" tab.
      </div>
    );
  }
  return (
    <>
      <DraftResumeModal
        show={showResumePrompt}
        onResume={resumeDraft}
        onDiscard={discardDraft}
        lastSaved={pendingDraft?.updatedAt}
      />
      <div className="flex justify-end mb-2">
        <DraftStatusIndicator
          isSyncing={isSyncing}
          isOffline={isOffline}
          lastSaved={lastSaved}
        />
      </div>
      <section className="mb-2  text-xs md:text-sm">
        Add all your design tasks in the following format:
        <br />
        <span className="text-prime">
          [Project Title 1] - [Figma / Gdrive / Other Link]
        </span>
        <br />
        <span className="text-prime hidden md:block">
          [Project Title 2] - [Figma / Gdrive / Other Link]
        </span>
      </section>
      <form onSubmit={handleSubmitDesignTask}>
        <h2>Choose a subdomain</h2>
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
                Video Editing / Photography
              </span>
            </label>
          </div>
        </div>
        <textarea
          id="textarea_field"
          className="nes-textarea is-dark min-h-[15rem]"
          required
          name="question1"
          value={formData.question1?.[1] || ""}
          onChange={(e) => handleInputChange(e, "question1")}
          placeholder="Write here..."
        ></textarea>
        <p>{savingFields["question1"] ? "Saving..." : "Saved"}</p>

        <section className="my-2  text-xs md:text-sm">
          <span className="text-prime">Answer some general questions:</span>
          <br />

          {quizSubQuestions.map(
            (quiz, index) =>
              quiz.subdomain &&
              subdomain.includes(quiz.subdomain) && (
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

                  <textarea
                    id="textarea_field"
                    className="nes-textarea is-dark min-h-[5rem]"
                    name={`question${index + 9}`}
                    value={formData[`question${index + 9}`]?.[1] || ""}
                    placeholder="Write here..."
                    onChange={(e) => handleInputChange(e, quiz.question)}
                    required
                  />
                  <p>
                    {savingFields[`question${index + 9}`]
                      ? "Saving..."
                      : "Saved"}
                  </p>
                </div>
              )
          )}
        </section>
        <p className="text-prime text-xs md:text-sm mt-4 md:mt-0">
          Note: Once submitted, this cannot be undone.
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
    subdomain: "graphicdesign",
    label: "design_que9",
    question:
      'BrightHive, a fast-growing AI startup, needs a modern logo. After extensive research and iterations, you present a design that the marketing team and COO approve. However, the CEO, Alex, says, "Something feels off, but I can’t explain why." With no clear feedback and a tight deadline, how do you refine the design while ensuring alignment with the company’s vision?',
  },
  {
    domain: "design",
    subdomain: "ui/ux",
    label: "design_que10",
    question:
      'At GoFleet, a logistics platform, you present a redesigned dashboard backed by user data. Midway, senior VP Michael interrupts, saying, "This looks way more complicated than before." His opinion could influence the final decision. With only five minutes to respond, how do you justify your design and keep the project moving forward?',
  },
  {
    domain: "design",
    subdomain: "ui/ux",
    label: "design_que11",
    question:
      'During a usability test for SwiftPay’s bill-splitting feature, a participant, Sophia, repeatedly makes a mistake but dismisses it as "not paying attention." You suspect a UI flaw but can’t make changes yet. How do you confirm if it’s user error or a design issue without influencing the results?',
  },
  {
    domain: "design",
    subdomain: "videoediting/photography",
    label: "design_que12",
    question:
      'You’re editing a documentary for Echo Films about farmers facing climate change. The most emotional interview, featuring David, is suddenly cut by the producer, Linda, who says, "The client thinks it’s too bleak." Losing it weakens the story. How do you convince Linda to keep the integrity of the film while addressing client concerns?',
  },
  {
    domain: "design",
    subdomain: "videoediting/photography",
    label: "design_que13",
    question:
      'ViralView, a media company, sends you raw footage for an ad campaign but provides no script, storyboard, or guidance—just a message from the creative director, James: "Make something great." With a tight deadline and unclear expectations, how do you decide on storytelling, editing style, and pacing to ensure the final product impresses?',
  },
];
