import React, { useRef, useEffect, useState } from "react";
import BoundingBox from "../components/BoundingBox";
import Navbar from "../components/Navbar";

interface EventItem {
  year: string;
  title: string;
  desc: string;
  status: "completed" | "loading";
}

const events: EventItem[] = [
  {
    year: "year",
    title: "event name",
    desc: "description",
    status: "completed",
  },
  {
    year: "year",
    title: "event name",
    desc: "description",
    status: "completed",
  },
  {
    year: "year",
    title: "event name",
    desc: "description",
    status: "completed",
  },
  {
    year: "year",
    title: "event name",
    desc: "description",
    status: "completed",
  },
  {
    year: "2025",
    title: "Future Ready",
    desc: "[Status: Downloading...]",
    status: "loading",
  },
];

const fullDescription =
  "Mozilla Firefox Club - VIT has been a beacon of innovation within VIT's student developer community for the last 10 years, boasting a dynamic ensemble of over 150 dedicated core and board members. Moreover, our influential presence extends beyond borders, with a robust social media footprint across various open-source communities.";

const About: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let index = 0;
    let timer: any;

    const startDelay = setTimeout(() => {
      timer = setInterval(() => {
        if (index < fullDescription.length) {
          setDisplayedText((prev) => prev + fullDescription.charAt(index));
          index++;
        } else {
          clearInterval(timer);
        }
      }, 20);
    }, 1200);

    return () => {
      clearTimeout(startDelay);
      if (timer) clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    if (scrollContainerRef.current) {
      const el = scrollContainerRef.current;
      const onWheel = (e: WheelEvent) => {
        if (e.deltaY === 0) return;
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      };
      el.addEventListener("wheel", onWheel, { passive: false });
      return () => el.removeEventListener("wheel", onWheel);
    }
  }, []);

  return (
    <div className="w-full h-screen flex flex-row overflow-hidden bg-[#0a0a0a] font-mono relative">
      {/* NAVBAR */}
      <div className="navbar-fix z-50 shrink-0 ml-2 h-full flex items-center justify-center">
        <Navbar />
      </div>

      {/* CRT OVERLAY */}
      <div className="pointer-events-none absolute inset-0 z-40 overflow-hidden h-full w-full">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,6px_100%] pointer-events-none"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_50%,rgba(0,0,0,0.4)_100%)] pointer-events-none"></div>
      </div>

      <style>{`
        .retro-scrollbar::-webkit-scrollbar { height: 8px; width: 8px; }
        .retro-scrollbar::-webkit-scrollbar-track { background: #333; }
        .retro-scrollbar::-webkit-scrollbar-thumb { background-color: #ff9500; border: 2px solid black; }
        .text-glow { text-shadow: 0 0 4px rgba(255, 149, 0, 0.6); }
        .cursor-blink { animation: blink 1s step-end infinite; }
        @keyframes blink { 50% { opacity: 0; } }

        .navbar-fix > * { padding-left: 12px !important; }

        /* DOUBLE GLITCH ANIMATION */
        @keyframes double-glitch {
          0% { opacity: 0; transform: scale(0.9) skewX(20deg); filter: hue-rotate(90deg); }
          10% { opacity: 1; transform: scale(1.02) skewX(-20deg); }
          20% { transform: scale(0.98) skewX(10deg); filter: invert(1); }
          30% { transform: scale(1) skewX(0deg); filter: none; }
          45% { transform: scale(1) skewX(0deg); }
          50% { transform: scale(1.05) skewX(-15deg); filter: hue-rotate(-90deg); }
          60% { transform: scale(0.95) skewX(15deg); filter: brightness(1.5); }
          70% { transform: scale(1.02) skewX(-5deg); }
          80% { transform: scale(1) skewX(5deg); filter: none; }
          100% { transform: scale(1) skewX(0deg); opacity: 1; }
        }
        .animate-glitch {
          animation: double-glitch 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
        }
      `}</style>

      {/* CONTENT WRAPPER */}
      <div className="flex-1 h-full flex items-center justify-center p-6 min-w-0 z-10 relative">
        {/* RESIZED WINDOW + GLITCH ANIMATION */}
        <BoundingBox className="relative w-[95%] max-w-[1100px] h-[90%] max-h-[800px] flex flex-col items-center justify-center animate-glitch">
          <div className="w-full h-full flex flex-col border-2 border-gray-500 bg-black shadow-[8px_8px_0px_rgba(50,50,50,0.5)] overflow-hidden">
            {/* Title Bar */}
            <div className="w-full bg-[#C0C0C0] border-b-2 border-gray-500 p-1 flex justify-between items-center select-none shrink-0">
              <div className="flex items-center gap-2 pl-2">
                <span className="text-[#ff9500] font-bold">🦊</span>
                <span className="text-black font-bold text-xs tracking-tight">
                  Mozilla Firefox - About.exe
                </span>
              </div>
              <div className="flex gap-1">
                <div className="w-4 h-4 bg-[#C0C0C0] border-t-2 border-l-2 border-white border-b-2 border-r-2 border-gray-700 text-black text-[10px] flex items-center justify-center font-bold shadow-sm cursor-pointer">
                  _
                </div>
                <div className="w-4 h-4 bg-[#C0C0C0] border-t-2 border-l-2 border-white border-b-2 border-r-2 border-gray-700 text-black text-[10px] flex items-center justify-center font-bold shadow-sm cursor-pointer">
                  □
                </div>
                <div className="w-4 h-4 bg-[#C0C0C0] border-t-2 border-l-2 border-white border-b-2 border-r-2 border-gray-700 text-black text-[10px] flex items-center justify-center font-bold shadow-sm cursor-pointer">
                  X
                </div>
              </div>
            </div>

            {/* Address Bar */}
            <div className="w-full bg-[#C0C0C0] p-1 pl-2 pr-2 border-b-2 border-gray-500 flex gap-2 items-center text-black text-xs font-bold shrink-0">
              <span>Address:</span>
              <div className="bg-white border-2 border-gray-600 border-r-white border-b-white inset shadow-inner w-full px-2 py-1 font-mono text-xs truncate">
                moz://about-club/history
              </div>
            </div>

            {/* Main Content Area */}
            <div className="w-full h-full overflow-y-auto overflow-x-hidden p-6 md:p-8 bg-black text-white retro-scrollbar">
              <div className="flex flex-col items-center">
                <h1
                  className="text-[1.5rem] md:text-[2.2rem] text-prime mb-6 text-glow font-bold tracking-wider text-center"
                  style={{ fontFamily: '"Courier New", monospace' }}
                >
                  MOZILLA FIREFOX CLUB
                </h1>

                {/* Typewriter Description */}
                <div className="w-full h-fit border border-gray-700 bg-[#111] p-4 text-justify md:text-center text-xs md:text-sm text-green-400 font-mono mb-2 shadow-inner min-h-[100px]">
                  <p>
                    {displayedText}
                    <span className="cursor-blink inline-block w-2 h-4 bg-green-400 ml-1 align-middle"></span>
                  </p>
                </div>

                {/* Timeline */}
                <div className="w-full mb-4">
                  <div className="flex justify-between text-xs text-gray-400 mb-0 px-2 font-mono">
                    <span>Downloading History...</span>
                    <span>99% Complete</span>
                  </div>

                  <div
                    ref={scrollContainerRef}
                    className="retro-scrollbar flex items-start overflow-x-auto w-full px-2 pt-24 pb-6"
                  >
                    <div className="flex items-start min-w-max px-8">
                      {events.map((item, index) => (
                        <div key={index} className="flex">
                          <div className="flex flex-col items-center w-[140px] group relative">
                            {/* Tooltip (COMPACT) */}
                            <div className="absolute bottom-[130%] mb-2 hidden group-hover:block z-50 w-40 transition-all duration-100 origin-bottom scale-0 group-hover:scale-100">
                              <div className="bg-[#C0C0C0] border-t-2 border-l-2 border-white border-b-2 border-r-2 border-black pt-[2px] px-[2px] pb-0 text-center shadow-[4px_4px_0px_rgba(0,0,0,0.5)]">
                                <div className="bg-blue-900 text-white text-[10px] font-bold px-1 text-left mb-[2px]">
                                  Info.txt
                                </div>
                                <p className="text-black font-mono text-[10px] leading-none p-[2px] bg-white border border-gray-400 text-left block">
                                  {item.desc}
                                </p>
                              </div>
                            </div>

                            <span className="text-gray-400 font-bold mb-2 font-mono text-xs">
                              {item.year}
                            </span>

                            {/* Node */}
                            {item.status === "completed" ? (
                              <div className="w-5 h-5 bg-green-500 border-2 border-green-300 shadow-[0_0_10px_rgba(0,255,0,0.5)] mb-3 cursor-pointer group-hover:bg-white group-hover:border-green-500 transition-colors"></div>
                            ) : (
                              <div className="w-5 h-5 bg-orange-500 border-2 border-orange-300 animate-pulse mb-3 cursor-wait"></div>
                            )}

                            <div className="text-center px-1">
                              <h3
                                className={`font-bold font-mono text-[10px] uppercase leading-tight mb-1 ${
                                  item.status === "completed"
                                    ? "text-green-500"
                                    : "text-orange-500"
                                }`}
                              >
                                {item.title}
                              </h3>
                            </div>
                          </div>

                          {/* Connector */}
                          {index !== events.length - 1 && (
                            <div className="mt-[30px] w-[40px] h-[4px] bg-[#333] mx-1 relative top-[-6px] border border-gray-600">
                              {item.status === "completed" && (
                                <div className="h-full w-full bg-green-600"></div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Social Icons */}
                <section className="icon-list flex gap-6 mt-2 mb-2 w-full justify-center">
                  <a
                    href="https://www.instagram.com/mfc_vit"
                    className="hover:scale-110 transition-transform"
                  >
                    <i className="nes-icon instagram is-medium"></i>
                  </a>
                  <a
                    href="mailto:mozillafirefox@vit.ac.in"
                    className="hover:scale-110 transition-transform"
                  >
                    <i className="nes-icon gmail is-medium"></i>
                  </a>
                  <a
                    href="https://www.linkedin.com/company/mfcvit?originalSubdomain=in"
                    className="hover:scale-110 transition-transform"
                  >
                    <i className="nes-icon linkedin is-medium"></i>
                  </a>
                </section>
              </div>
            </div>

            {/* Status Bar */}
            <div className="w-full bg-[#C0C0C0] border-t-2 border-gray-500 p-1 flex justify-between items-center text-[10px] text-black shrink-0">
              <span>Done</span>
              <div className="flex gap-2 pr-2">
                <span className="border border-gray-500 px-1 bg-white">
                  INS
                </span>
                <span className="border border-gray-500 px-1 bg-white">
                  CAP
                </span>
              </div>
            </div>
          </div>
        </BoundingBox>
      </div>
    </div>
  );
};

export default About;
