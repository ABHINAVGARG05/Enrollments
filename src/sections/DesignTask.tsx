import { useEffect, useLayoutEffect, useState } from "react";
import TaskModal from "../components/TaskModal";
import secureLocalStorage from "react-secure-storage";
interface Task {
  label: string;
  description: string;
  title: string;
  resources: string[];
  for: string;
}

interface Props {
  selectedSubDomain: string;
  setSelectedSubDomain: React.Dispatch<React.SetStateAction<string>>;
}
// const DesignTask = ({ selectedSubDomain, setSelectedSubDomain }: Props) => {
//   const [filteredTasks, setFilteredTask] = useState<Task[]>([]);
//   useEffect(() => {
//     const filteredTask = designTaskData.filter(
//       (task) => task.label === selectedSubDomain
//     );
//     if (filteredTask) {
//       setFilteredTask(filteredTask);
//     }
//   }, [selectedSubDomain]);
const DesignTask = ({ selectedSubDomain, setSelectedSubDomain }: Props) => {
  const [filteredTasks, setFilteredTask] = useState<Task[]>([]);
  const [isSC, setIsSC] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  // const [showModal, setShowModal] = useState(false);
  // const [taskState, setTaskState] = useState("");
  useEffect(() => {
    // Based on the subdomain we are filtering the task
    const filteredTask = designTaskData.filter(
      (task) =>
        task.label === selectedSubDomain &&
        (isSC === true ? task.for === "senior" : task.for === "junior")
    );
    //console.log("hello",isSC)
    if (filteredTask) {
      setFilteredTask(filteredTask);
    }
  }, [selectedSubDomain, isSC]);
  useLayoutEffect(() => {
    try {
      const userDetailsstore = secureLocalStorage.getItem("userDetails");
      if (!userDetailsstore || typeof userDetailsstore !== "string") {
        setIsSC(false);
        return;
      }
      const userDetails = JSON.parse(userDetailsstore);
      setIsSC(Boolean(userDetails?.data?.isSC));
    } catch {
      setIsSC(false);
    }
  }, []);

  return (
    <div
      className={`w-full h-full overflow-y-hidden -task-container ${
        selectedSubDomain === "" ? "flex items-center" : ""
      }`}
    >
      {selectedSubDomain === "" && (
        <div className="flex justify-center flex-wrap w-full">
          <button
            type="button"
            onClick={() => setSelectedSubDomain("poster")}
            className="nes-btn is-error nes-btn-task w-[47%] md:w-[22%] aspect-[2] custom-nes-error text-xs"
          >
            Graphic Design
          </button>
          <button
            type="button"
            onClick={() => setSelectedSubDomain("ui")}
            className="nes-btn is-error nes-btn-task w-[47%] md:w-[22%] aspect-[2] custom-nes-error text-xs"
          >
            UI/UX
          </button>
          <button
            type="button"
            onClick={() => setSelectedSubDomain("3d")}
            className="nes-btn is-error w-[47%] md:w-[22%] aspect-[2] custom-nes-error text-xs"
          >
            3D Modelling
          </button>
          <button
            type="button"
            onClick={() => setSelectedSubDomain("video")}
            className="nes-btn is-error w-[100%] min-w-fit h-fit lg:w-[22%] md:aspect-[2] custom-nes-error text-xs"
          >
            Video Editing / <br /> Photography
          </button>
        </div>
      )}

      {selectedSubDomain !== "" && (
        <div className="w-full mt-8 h-full flex flex-col gap-8 md:gap-4">
          {filteredTasks.map((task, index) => (
            <div
              className="nes-container is-dark with-title dark-container-nes cursor-pointer"
              key={index}
              onClick={() => {
                setActiveTask(task);
                setShowModal(true);
              }}
            >
              <p
                className={`title ${
                  task.label === "3d" || task.label === "video"
                    ? "text-center w-full"
                    : ""
                }`}
              >
                {task.title}
              </p>
              {task.resources && task.resources.length > 0 && (
                <div className="flex justify-between flex-col md:flex-row">
                  <span className="md:text-sm text-xs">Resources:</span>
                  <span className="flex flex-col md:text-sm text-xs md:flex-row">
                    {task.resources.map((resource, index) => (
                      <a
                        href={resource}
                        target="_blank"
                        key={index}
                        rel="noopener noreferrer"
                      >
                        Resource {index + 1} &nbsp;
                      </a>
                    ))}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {showModal && activeTask && (
        <TaskModal
          task={activeTask}
          onClose={() => {
            setShowModal(false);
            setActiveTask(null);
          }}
        />
      )}
    </div>
  );
};

export default DesignTask;

function Modal({
  task,
  setShowModal,
}: {
  task: string;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <div className="max-w-5xl w-[98%] md:w-[90%] lg:w-[75%] z-50 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 nes-container is-dark is-rounded p-1 text-[11px]">
      <form method="">
        <p className="title text-sm">Submit Task</p>
        <input
          type="text"
          id="dark_field"
          className="nes-input is-dark text-xs"
          placeholder="Github Repository Link"
          name={`${task}-github`}
          required
        />
        <input
          type="text"
          id="dark_field"
          className="nes-input is-dark text-xs"
          placeholder="Demo Link"
          name={`${task}-demo`}
        />
        <menu className="dialog-menu mt-3">
          <button
            className="nes-btn text-xs"
            type="button"
            onClick={() => setShowModal(false)}
          >
            Cancel
          </button>
          <button className="nes-btn is-error text-xs" type="submit">
            Submit
          </button>
        </menu>
      </form>
    </div>
  );
}

const designTaskData: Task[] = [
  {
    label: "ui",
    title:
      "Designing a Personalized, Adaptive Learning Experience Through UI/UX",
    description:
      "Design the UI/UX for a new book-tracking app that motivates users to discover their own style and interests. Create a wireframe or prototype for key screens (e.g., dashboard, progress tracker, notifications). Implement features that encourage user engagement (e.g., streaks, reminders, social sharing). Ensure a visually appealing and user-friendly interface.",
    resources: [],
    for: "senior",
  },
  {
    label: "ui",
    title:
      "Designing a Personalized, Adaptive Learning Experience Through UI/UX",
    description:
      "Design a UI/UX experience for a personalized learning platform that adapts to users' skill levels and interests in real time. Create a high-fidelity prototype for core screens, including dashboard, course progress, AI-powered recommendations, and interactive lesson modules. Implement dynamic UI elements that adapt based on user performance (e.g., difficulty adjustments, personalized content suggestions). Integrate gamification elements such as XP points, badges, and learning challenges to increase engagement. Ensure a smooth onboarding flow that tailors the experience based on user preferences and prior knowledge. Optimize for both mobile and desktop experiences with a responsive design.",
    resources: [],
    for: "junior",
  },
  {
    label: "ui",
    title: "UI/UX",
    description:
      "Redesign Amazon’s user interface in the style of Spotify. New design must maintain its identity from both of its predecessors. Must show functionality, even with basic prototyping. BONUS POINTS if a new, unique logo is made.",
    resources: [],
    for: "senior",
  },
  {
    label: "ui",
    title:
      "LinkedIn Reimagined: A Swipe-First Professional Networking Experience",
    description:
      "Reimagine LinkedIn’s user interface with the aesthetics and user flow of TikTok while maintaining its core professional identity. The redesign should blend LinkedIn’s professional networking features with TikTok’s visually engaging, swipe-based interface. Create key screens, including a vertical feed for content, an intuitive job search page, and a reimagined profile layout. Implement interactive features such as quick reactions, short video resumes, and AI-powered networking suggestions. The prototype should demonstrate fluid navigation, content discovery, and engagement mechanics. BONUS POINTS if you design a fresh, modernized LinkedIn logo that reflects this new dynamic experience.",
    resources: [],
    for: "junior",
  },
  {
    label: "video",
    title: "Video Editing Task 1",
    description:
      "Make a jitter-lapse video of anything that the VIT campus has to offer. Minimum length of video has to be 15-20 seconds. Music choice will be taken into consideration.",
    resources: [],
    for: "junior",
  },
  {
    label: "video",
    title: "Video Editing Task 2",
    description:
      "Create a reel using any trending idea for a fictional event called Innovator Of The Year, which is a crossover of a hackathon and a treasure hunt. Engaging Storyline & Hook – Highlight the unique hackathon + treasure hunt crossover with a fast-paced, exciting intro. Dynamic Visuals & Audio – Use smooth transitions, trending audio, and text overlays to keep the audience engaged. Clear CTA & Branding – Include the event name, date, and sign-up details with a strong call to action.",
    resources: [],
    for: "senior",
  },
  {
    label: "video",
    title: "Video Editing Task 2",
    description:
      "Create a stop-motion promotional video showcasing a day in the life of a VIT student, capturing the energy and diversity of campus life. The video must be at least 20–30 seconds long and tell a cohesive story (e.g., morning classes, clubs, events, nightlife). Use smooth stop-motion animation with creative transitions between scenes. Music selection should enhance the storytelling and complement the fast-paced stop-motion style. BONUS POINTS for integrating motion graphics or animated text overlays to highlight key moments.",
    resources: [],
    for: "senior",
  },
  {
    label: "video",
    title: "Video Editing Task 2",
    description:
      "Produce a cinematic teaser trailer for a fictional competition, Innovator Royale, which blends a tech showdown with an escape-room-style challenge. The teaser should be 30–45 seconds long, building suspense and excitement. Incorporate high-energy editing, including fast cuts, dramatic music, and glitch effects to emphasize the high-stakes nature of the event. Use voiceover or impactful text animations to tease the competition’s mechanics and prizes. BONUS POINTS for including a cinematic logo animation for 'Innovator Royale' at the end.",
    resources: [],
    for: "junior",
  },

  {
    label: "poster",
    title: "Reimagining Identity and Events Through Graphic Design",
    description:
      "Your task is to recreate either a past event poster or a personalized poster that reflects your identity and interests. For the past event poster, choose any event from our archive, such as Gravitas or Riviera, and reimagine its promotional material with fresh creativity and design. Alternatively, craft a personalized poster that showcases who you are, including your passions, skills, and aspirations. Ensure that your poster design aligns with the organization's branding guidelines while incorporating innovative elements to captivate the audience's attention. Provide a brief rationale for your design choices and any inspiration sources utilized. Be prepared to present and discuss your poster during the evaluation process.",
    resources: [],
    for: "junior",
  },
  {
    label: "poster",
    title: "Reimagining Identity and Events Through Graphic Design",
    description:
      "Your task is to recreate either a past event poster or a personalized poster that reflects your identity and interests. For the past event poster, choose any event from our archive, such as Gravitas or Riviera, and reimagine its promotional material with fresh creativity and design. Alternatively, craft a personalized poster that showcases who you are, including your passions, skills, and aspirations. Ensure that your poster design aligns with the organization's branding guidelines while incorporating innovative elements to captivate the audience's attention. Provide a brief rationale for your design choices and any inspiration sources utilized. Be prepared to present and discuss your poster during the evaluation process.",
    resources: [],
    for: "senior",
  },
  {
    label: "3d",
    title: "3D Modelling",
    description: "Recreate the following 2D image to a 3D model.",
    resources: [
      "https://drive.google.com/file/d/1GeoLTRphTOrNCvwJDFMstL2hDUocp76L/view?usp=sharing",
    ],
    for: "junior",
  },
  {
    label: "3d",
    title: "3D Modelling",
    description: "Recreate the following 2D image to a 3D model.",
    resources: [
      "https://drive.google.com/file/d/1GeoLTRphTOrNCvwJDFMstL2hDUocp76L/view?usp=sharing",
    ],
    for: "senior",
  },
];
