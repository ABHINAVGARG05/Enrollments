import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import Cookies from "js-cookie";

interface DraftData {
  id: string;
  formData: Record<string, [string, string]>;
  subdomain: string[];
  updatedAt: number;
  version: number;
}

interface DraftSystemOptions {
  draftKey: string;
  userId: string | null;
  domain: "tech" | "design" | "management";
  onConflict?: (local: DraftData, remote: DraftData) => void;
  onResume?: (draft: DraftData) => boolean;
}

interface DraftSystemReturn {
  formData: Record<string, [string, string]>;
  subdomain: string[];
  setFormData: React.Dispatch<React.SetStateAction<Record<string, [string, string]>>>;
  setSubdomain: React.Dispatch<React.SetStateAction<string[]>>;
  isDraftLoaded: boolean;
  isSyncing: boolean;
  isOffline: boolean;
  lastSaved: number | null;
  savingFields: Record<string, boolean>;
  setSavingFields: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  clearDraft: () => void;
  forceSave: () => Promise<void>;
  showResumePrompt: boolean;
  resumeDraft: () => void;
  discardDraft: () => void;
}

const SYNC_DELAY = 2000;
const BROADCAST_CHANNEL_NAME = "mfc_draft_sync";

export const useDraftSystem = ({
  draftKey,
  userId,
  domain,
  onConflict,
  onResume,
}: DraftSystemOptions): DraftSystemReturn => {
  const [formData, setFormData] = useState<Record<string, [string, string]>>({});
  const [subdomain, setSubdomain] = useState<string[]>([]);
  const [isDraftLoaded, setIsDraftLoaded] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [lastSaved, setLastSaved] = useState<number | null>(null);
  const [savingFields, setSavingFields] = useState<Record<string, boolean>>({});
  const [showResumePrompt, setShowResumePrompt] = useState(false);
  const [pendingDraft, setPendingDraft] = useState<DraftData | null>(null);

  const syncTimerRef = useRef<number | null>(null);
  const syncQueueRef = useRef<DraftData[]>([]);
  const broadcastChannelRef = useRef<BroadcastChannel | null>(null);
  const versionRef = useRef(0);

  const buildDraft = useCallback((): DraftData => ({
    id: userId || "",
    formData,
    subdomain,
    updatedAt: Date.now(),
    version: ++versionRef.current,
  }), [formData, subdomain, userId]);

  const saveToLocalStorage = useCallback((draft: DraftData) => {
    if (!draftKey) return;
    try {
      localStorage.setItem(draftKey, JSON.stringify(draft));
      setLastSaved(Date.now());
    } catch (err) {
      console.error("Failed to save draft to localStorage:", err);
    }
  }, [draftKey]);

  const loadFromLocalStorage = useCallback((): DraftData | null => {
    if (!draftKey) return null;
    try {
      const raw = localStorage.getItem(draftKey);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (err) {
      console.error("Failed to load draft from localStorage:", err);
    }
    return null;
  }, [draftKey]);

  const syncToServer = useCallback(async (draft: DraftData): Promise<boolean> => {
    if (!userId) return false;
    
    const token = Cookies.get("jwtToken");
    if (!token) return false;

    try {
      setIsSyncing(true);
      const payload: Record<string, unknown> = { subdomain: draft.subdomain };
      
      Object.entries(draft.formData).forEach(([key, value]) => {
        if (value?.[1]?.trim()) {
          payload[key] = [value[1]];
        }
      });

      await axios.patch(
        `${import.meta.env.VITE_BASE_URL}/upload/${domain}/${userId}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setSavingFields({});
      return true;
    } catch (err) {
      console.error("Draft sync failed:", err);
      return false;
    } finally {
      setIsSyncing(false);
    }
  }, [userId, domain]);

  const processOfflineQueue = useCallback(async () => {
    if (syncQueueRef.current.length === 0) return;
    
    const queue = [...syncQueueRef.current];
    syncQueueRef.current = [];
    
    for (const draft of queue) {
      const success = await syncToServer(draft);
      if (!success) {
        syncQueueRef.current.push(draft);
      }
    }
  }, [syncToServer]);

  const broadcastChange = useCallback((draft: DraftData) => {
    if (broadcastChannelRef.current) {
      broadcastChannelRef.current.postMessage({
        type: "DRAFT_UPDATE",
        draftKey,
        draft,
        tabId: sessionStorage.getItem("tabId") || Math.random().toString(36),
      });
    }
  }, [draftKey]);

  const hydrateFromBackend = useCallback(async (): Promise<DraftData | null> => {
    if (!userId) return null;
    
    const token = Cookies.get("jwtToken");
    if (!token) return null;

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/upload/${domain}/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const task = res.data?.data;
      if (!task || task.isDone) return null;

      const restoredFormData: Record<string, [string, string]> = {};
      Object.entries(task).forEach(([key, value]) => {
        if (key.startsWith("question") && Array.isArray(value) && value.length > 0) {
          const val = value[0];
          if (typeof val === "string") {
            restoredFormData[key] = ["", val];
          }
        }
      });

      return {
        id: userId,
        formData: restoredFormData,
        subdomain: task.subdomain || [],
        updatedAt: Date.now(),
        version: 0,
      };
    } catch (err) {
      console.error("Failed to fetch draft from backend:", err);
      return null;
    }
  }, [userId, domain]);

  const resumeDraft = useCallback(() => {
    if (pendingDraft) {
      setFormData(pendingDraft.formData);
      setSubdomain(pendingDraft.subdomain);
      versionRef.current = pendingDraft.version;
    }
    setShowResumePrompt(false);
    setPendingDraft(null);
    setIsDraftLoaded(true);
  }, [pendingDraft]);

  const discardDraft = useCallback(() => {
    if (draftKey) {
      localStorage.removeItem(draftKey);
    }
    setShowResumePrompt(false);
    setPendingDraft(null);
    setIsDraftLoaded(true);
  }, [draftKey]);

  const clearDraft = useCallback(() => {
    if (draftKey) {
      localStorage.removeItem(draftKey);
    }
    setFormData({});
    setSubdomain([]);
    versionRef.current = 0;
  }, [draftKey]);

  const forceSave = useCallback(async () => {
    const draft = buildDraft();
    saveToLocalStorage(draft);
    
    if (navigator.onLine) {
      await syncToServer(draft);
    } else {
      syncQueueRef.current.push(draft);
    }
  }, [buildDraft, saveToLocalStorage, syncToServer]);

  useEffect(() => {
    if (!draftKey || !userId) return;

    const initDraft = async () => {
      const localDraft = loadFromLocalStorage();
      
      if (localDraft && localDraft.id === userId) {
        const hasContent = Object.keys(localDraft.formData).length > 0 || 
                          localDraft.subdomain.length > 0;
        
        if (hasContent) {
          if (onResume) {
            const shouldResume = onResume(localDraft);
            if (shouldResume) {
              setFormData(localDraft.formData);
              setSubdomain(localDraft.subdomain);
              versionRef.current = localDraft.version;
              setIsDraftLoaded(true);
              return;
            }
          } else {
            setPendingDraft(localDraft);
            setShowResumePrompt(true);
            return;
          }
        }
      }

      const remoteDraft = await hydrateFromBackend();
      if (remoteDraft) {
        const hasContent = Object.keys(remoteDraft.formData).length > 0 || 
                          remoteDraft.subdomain.length > 0;
        
        if (hasContent && !localDraft) {
          setFormData(remoteDraft.formData);
          setSubdomain(remoteDraft.subdomain);
        }
      }
      
      setIsDraftLoaded(true);
    };

    initDraft();
  }, [draftKey, userId, loadFromLocalStorage, hydrateFromBackend, onResume]);

  useEffect(() => {
    if (!isDraftLoaded || !draftKey) return;

    const draft = buildDraft();
    saveToLocalStorage(draft);
    broadcastChange(draft);

    if (syncTimerRef.current) {
      clearTimeout(syncTimerRef.current);
    }

    syncTimerRef.current = window.setTimeout(() => {
      if (navigator.onLine) {
        syncToServer(draft);
      } else {
        syncQueueRef.current.push(draft);
      }
    }, SYNC_DELAY);

    return () => {
      if (syncTimerRef.current) {
        clearTimeout(syncTimerRef.current);
      }
    };
  }, [formData, subdomain, isDraftLoaded, draftKey, buildDraft, saveToLocalStorage, syncToServer, broadcastChange]);

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
      const draft = buildDraft();
      
      try {
        localStorage.setItem(draftKey, JSON.stringify(draft));
      } catch (err) {
        console.error("Emergency save failed:", err);
      }

      if (navigator.onLine && userId) {
        const token = Cookies.get("jwtToken");
        if (token) {
          const payload: Record<string, unknown> = { subdomain: draft.subdomain };
          Object.entries(draft.formData).forEach(([key, value]) => {
            if (value?.[1]?.trim()) {
              payload[key] = [value[1]];
            }
          });

          const blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
          navigator.sendBeacon(
            `${import.meta.env.VITE_BASE_URL}/upload/${domain}/${userId}?token=${token}`,
            blob
          );
        }
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [buildDraft, draftKey, userId, domain]);

  useEffect(() => {
    if (!sessionStorage.getItem("tabId")) {
      sessionStorage.setItem("tabId", Math.random().toString(36).substring(7));
    }

    try {
      broadcastChannelRef.current = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
      
      broadcastChannelRef.current.onmessage = (event) => {
        const { type, draftKey: msgDraftKey, draft, tabId } = event.data;
        const myTabId = sessionStorage.getItem("tabId");

        if (type === "DRAFT_UPDATE" && msgDraftKey === draftKey && tabId !== myTabId) {
          if (draft.version > versionRef.current) {
            if (onConflict) {
              onConflict(buildDraft(), draft);
            } else {
              setFormData(draft.formData);
              setSubdomain(draft.subdomain);
              versionRef.current = draft.version;
            }
          }
        }
      };
    } catch (err) {
      console.warn("BroadcastChannel not supported:", err);
    }

    return () => {
      broadcastChannelRef.current?.close();
    };
  }, [draftKey, onConflict, buildDraft]);

  return {
    formData,
    subdomain,
    setFormData,
    setSubdomain,
    isDraftLoaded,
    isSyncing,
    isOffline,
    lastSaved,
    savingFields,
    setSavingFields,
    clearDraft,
    forceSave,
    showResumePrompt,
    resumeDraft,
    discardDraft,
  };
};

export const DraftResumeModal = ({
  show,
  onResume,
  onDiscard,
  lastSaved,
}: {
  show: boolean;
  onResume: () => void;
  onDiscard: () => void;
  lastSaved?: number;
}) => {
  if (!show) return null;

  const timeAgo = lastSaved 
    ? new Date(lastSaved).toLocaleString() 
    : "recently";

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80">
      <div 
        className="nes-container is-dark is-rounded p-6 max-w-md mx-4"
        style={{ fontFamily: "'Press Start 2P', cursive" }}
      >
        <h3 className="text-prime text-sm mb-4">📝 Draft Found!</h3>
        <p className="text-white text-xs mb-2">
          You have an unsaved draft from:
        </p>
        <p className="text-gray-400 text-[10px] mb-4">{timeAgo}</p>
        <p className="text-white text-xs mb-6">
          Would you like to resume where you left off?
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={onResume}
            className="nes-btn is-primary text-[10px]"
          >
            Resume
          </button>
          <button
            onClick={onDiscard}
            className="nes-btn is-error text-[10px]"
          >
            Discard
          </button>
        </div>
      </div>
    </div>
  );
};

export const DraftStatusIndicator = ({
  isSyncing,
  isOffline,
  lastSaved,
}: {
  isSyncing: boolean;
  isOffline: boolean;
  lastSaved: number | null;
}) => {
  if (isOffline) {
    return (
      <span className="text-yellow-500 text-[8px] flex items-center gap-1">
        <span className="w-2 h-2 bg-yellow-500 rounded-full" />
        Offline - Saving locally
      </span>
    );
  }

  if (isSyncing) {
    return (
      <span className="text-blue-400 text-[8px] flex items-center gap-1">
        <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
        Syncing...
      </span>
    );
  }

  if (lastSaved) {
    return (
      <span className="text-green-500 text-[8px] flex items-center gap-1">
        <span className="w-2 h-2 bg-green-500 rounded-full" />
        Saved
      </span>
    );
  }

  return null;
};

export default useDraftSystem;
