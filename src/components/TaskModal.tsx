import { useEffect, useState, useCallback } from "react";

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
  const [isVisible, setIsVisible] = useState(false);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    setTimeout(onClose, 200);
  }, [onClose]);

  useEffect(() => {
    requestAnimationFrame(() => setIsVisible(true));
    
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [handleClose]);

  return (
    <div 
      className={`fixed inset-0 z-[9999] transition-opacity duration-200 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Fullscreen Blur Backdrop */}
      <div
        className="absolute inset-0 bg-black/85 backdrop-blur-md"
        onClick={handleClose}
      />
      
      {/* Fullscreen NES Container */}
      <div 
        className={`absolute inset-0 flex flex-col p-3 md:p-6 transition-transform duration-200 ${
          isVisible ? "scale-100" : "scale-95"
        }`}
      >
        {/* NES Style Modal Box */}
        <div className="flex-1 flex flex-col bg-[#0e0e0e] border-4 border-[#fc7a00] overflow-hidden" style={{ imageRendering: 'pixelated' }}>
          
          {/* Header */}
          <div className="flex-shrink-0 bg-[#fc7a00] px-3 md:px-6 py-3 md:py-4 flex items-center justify-between border-b-4 border-black">
            <div className="flex items-center gap-2 md:gap-4 min-w-0">
              <span className="text-lg md:text-2xl">📋</span>
              <div className="min-w-0">
                <h1 className="text-black font-bold text-xs md:text-sm lg:text-base truncate" style={{ fontFamily: "'Press Start 2P', cursive" }}>
                  {task.title.length > 30 ? task.title.substring(0, 30) + '...' : task.title}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-2 py-0.5 bg-black text-[#fc7a00] text-[8px] md:text-[10px] uppercase" style={{ fontFamily: "'Press Start 2P', cursive" }}>
                    {task.label}
                  </span>
                  <span className="px-2 py-0.5 bg-black text-[#fc7a00] text-[8px] md:text-[10px] uppercase" style={{ fontFamily: "'Press Start 2P', cursive" }}>
                    {task.for === "senior" ? "SC" : "JR"}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-black text-[#fc7a00] border-2 border-black hover:bg-[#1a1a1a] transition-colors flex-shrink-0"
              aria-label="Close modal"
              style={{ fontFamily: "'Press Start 2P', cursive" }}
            >
              X
            </button>
          </div>
          
          {/* Main Content Area - Scrollable */}
          <div className="flex-1 custom-scroll overflow-y-auto p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
              {/* Description Section */}
              <div className="mb-6 md:mb-10">
                <h2 
                  className="text-[#fc7a00] text-[10px] md:text-xs mb-4 uppercase"
                  style={{ fontFamily: "'Press Start 2P', cursive" }}
                >
                  &gt; TASK DESCRIPTION
                </h2>
                <div className="bg-black border-4 border-[#333] p-4 md:p-6">
                  <p className="text-gray-300 text-xs md:text-sm leading-relaxed md:leading-loose whitespace-pre-wrap">
                    {task.description}
                  </p>
                </div>
              </div>
              
              {/* Resources Section */}
              {task.resources && task.resources.length > 0 && (
                <div>
                  <h2 
                    className="text-[#fc7a00] text-[10px] md:text-xs mb-4 uppercase"
                    style={{ fontFamily: "'Press Start 2P', cursive" }}
                  >
                    &gt; RESOURCES [{task.resources.length}]
                  </h2>
                  <div className="flex flex-col gap-3">
                    {task.resources.map((resource, index) => (
                      <a
                        key={index}
                        href={resource}
                        target="_blank"
                        rel="noreferrer"
                        className="group flex items-center gap-3 p-3 md:p-4 bg-black border-4 border-[#333] hover:border-[#fc7a00] transition-colors"
                      >
                        <div className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-[#fc7a00] flex-shrink-0">
                          <span className="text-black text-lg">🔗</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div 
                            className="text-white text-[10px] md:text-xs group-hover:text-[#fc7a00] transition-colors"
                            style={{ fontFamily: "'Press Start 2P', cursive" }}
                          >
                            LINK {index + 1}
                          </div>
                          <div className="text-gray-500 text-[10px] md:text-xs truncate mt-1">
                            {resource}
                          </div>
                        </div>
                        <span className="text-[#333] group-hover:text-[#fc7a00] text-lg transition-colors flex-shrink-0">
                          &gt;
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Footer */}
          <div className="flex-shrink-0 bg-black border-t-4 border-[#333] px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
            <p className="text-gray-600 text-[8px] md:text-[10px]" style={{ fontFamily: "'Press Start 2P', cursive" }}>
              [ESC] CLOSE
            </p>
            <button
              onClick={handleClose}
              className="nes-btn is-error custom-nes-error text-[10px] md:text-xs px-4 py-2 hover:scale-105 transition-transform"
            >
              CLOSE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
