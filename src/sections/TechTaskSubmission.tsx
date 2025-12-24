import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import secureLocalStorage from "react-secure-storage";
import { ToastContent } from "../components/CustomToast";
import {
  DraftResumeModal,
  DraftStatusIndicator,
} from "../hooks/useDraftSystem";
import { jwtDecode } from "jwt-decode";

interface Props {
  setOpenToast: React.Dispatch<React.SetStateAction<boolean>>;
  setToastContent: React.Dispatch<React.SetStateAction<ToastContent>>;
}

const BROADCAST_CHANNEL_NAME = "mfc_tech_draft_sync";

const TechTaskSubmission = ({ setOpenToast, setToastContent }: Props) => {
  const [subdomain, setSubDomain] = useState<string[]>([]);
  const [isTechDone, setIsTechDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const id = secureLocalStorage.getItem("id");
  const DRAFT_KEY = id ? `tech_draft_${id}` : null;

  const [savingFields, setSavingFields] = useState<Record<string, boolean>>({});
  const [isSyncing, setIsSyncing] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [lastSaved, setLastSaved] = useState<number | null>(null);
  const [showResumePrompt, setShowResumePrompt] = useState(false);
  const [pendingDraft, setPendingDraft] = useState<{
    formData: FormData;
    subdomain: string[];
    updatedAt: number;
  } | null>(null);

  interface FormData {
    [key: string]: [string, string];
  }

  const [isDraftLoaded, setIsDraftLoaded] = useState(false);
  const [formData, setFormData] = useState<FormData>({});
  const syncTimerRef = useRef<number | null>(null);
  const syncQueueRef = useRef<{ formData: FormData; subdomain: string[] }[]>(
    []
  );
  const broadcastChannelRef = useRef<BroadcastChannel | null>(null);
  const versionRef = useRef(0);

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

  interface BackendTaskResponse {
    subdomain?: string[];
    [key: string]: unknown;
  }

  const hydrateFromBackend = useCallback((task: BackendTaskResponse) => {
    if (!task) return;

    setSubDomain(task.subdomain || []);

    const restoredFormData: FormData = {};

    Object.entries(task).forEach(([key, value]) => {
      if (
        key.startsWith("question") &&
        Array.isArray(value) &&
        value.length > 0
      ) {
        const val = value[0];
        if (typeof val === "string") {
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

  const buildBackendPayload = useCallback(() => {
    const payload: Record<string, unknown> = {};

    payload.subdomain = subdomain;

    Object.entries(formData).forEach(([key, value]) => {
      if (value?.[1]?.trim()) {
        payload[key] = [value[1]];
      }
    });

    return payload;
  }, [formData, subdomain]);

  useEffect(() => {
    if (!id) return;

    const initDraft = async () => {
      if (DRAFT_KEY) {
        const raw = localStorage.getItem(DRAFT_KEY);
        if (raw) {
          try {
            const draft = JSON.parse(raw);
            if (draft?.id === id) {
              const hasContent =
                Object.keys(draft.formData || {}).length > 0 ||
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

    initDraft();
  }, [id, hydrateFromBackend, DRAFT_KEY]);

  const syncDraftToServer = useCallback(async () => {
    if (!id) return;

    const token = Cookies.get("jwtToken");
    if (!token) return;

    try {
      setIsSyncing(true);
      await axios.patch(
        `${import.meta.env.VITE_BASE_URL}/upload/tech/${id}`,
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

        const payload: Record<string, unknown> = { subdomain: item.subdomain };
        Object.entries(item.formData).forEach(([key, value]) => {
          if (value?.[1]?.trim()) {
            payload[key] = [value[1]];
          }
        });

        await axios.patch(
          `${import.meta.env.VITE_BASE_URL}/upload/tech/${id}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (err) {
        console.error("Queue sync failed:", err);
        syncQueueRef.current.push(item);
      }
    }
  }, [id]);

  // const [isTechDone, setIsTechDone] = useState(false);

  useEffect(() => {
    const checkSubmissionStatus = () => {
      const token = Cookies.get("refreshToken");
      if (token) {
        try {
          const decoded = jwtDecode<{ isTechDone?: boolean }>(token);
          if (decoded?.isTechDone) {
            setIsTechDone(true);
          }
        } catch (err) {
          console.error("Error decoding refresh token:", err);
        }
      }

      // TechSub from secureLocalStorage
      if (secureLocalStorage.getItem("TechSub")) {
        setIsTechDone(true);
      }
    };

    checkSubmissionStatus();
  }, []);

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
          const payload: Record<string, unknown> = { subdomain };
          Object.entries(formData).forEach(([key, value]) => {
            if (value?.[1]?.trim()) {
              payload[key] = [value[1]];
            }
          });

          const blob = new Blob([JSON.stringify(payload)], {
            type: "application/json",
          });
          navigator.sendBeacon(
            `${import.meta.env.VITE_BASE_URL}/upload/tech/${id}?token=${token}`,
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
      broadcastChannelRef.current = new BroadcastChannel(
        BROADCAST_CHANNEL_NAME
      );

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
    e: React.ChangeEvent<HTMLTextAreaElement>,
    question: string
  ) => {
    const { name, value } = e.target;

    setSavingFields((prev) => ({
      ...prev,
      [name]: true,
    }));

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

      if (response.data.isTechDone) {
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
                      {savingFields[`question${index + 2}`]
                        ? "Saving..."
                        : "Saved"}
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
  {
    domain: "tech",
    subdomain: "cyber-sec",
    label: "tech_que5",
    question:
      "Explain the difference between symmetric and asymmetric encryption. When would you use each?",
  },
  {
    domain: "tech",
    subdomain: "ml",
    label: "tech_que6",
    question:
      "What is the difference between supervised and unsupervised learning? Provide an example use case for each.",
  },
];

export default TechTaskSubmission;
