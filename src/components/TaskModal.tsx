import React, { useEffect } from "react";

interface Task {
  label: string;
  description: string;
  title: string;
  resources?: string[];
  for: string;
}

export default function TaskModal({
  task,
  onClose,
}: {
  task: Task;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="max-w-5xl w-[98%] md:w-[90%] lg:w-[75%] z-10">
        <div className="nes-container is-dark with-title is-rounded p-1 overflow-visible h-auto text-[11px]">
          <p className="title text-center w-full text-xs">{task.title}</p>
          <div className="text-left leading-4">
            <p>{task.description}</p>
            {task.resources && task.resources.length > 0 && (
              <div className="mt-4">
                <strong>Resources:</strong>
                <ul className="list-inside list-disc">
                  {task.resources.map((r, i) => (
                    <li key={i}>
                      <a href={r} target="_blank" rel="noreferrer" className="text-blue-400">
                        Resource {i + 1}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="mt-4 flex justify-end">
            <button className="nes-btn" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
