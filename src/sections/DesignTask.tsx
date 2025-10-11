import { useEffect, useState } from "react";

interface Task {
  label: string;
  description: string;
  title: string;
  for: string;
  requirements?: string;
  resources?: string[];
}

interface Props {
  selectedSubDomain: string;
  setSelectedSubDomain: React.Dispatch<React.SetStateAction<string>>;
}

const DesignTask = ({ selectedSubDomain, setSelectedSubDomain }: Props) => {
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);

  useEffect(() => {
    const filteredTask = designTaskData.filter(
      (task) => task.label === selectedSubDomain
    );
    if (filteredTask.length > 0) {
      setFilteredTasks(filteredTask);
    }
  }, [selectedSubDomain]);

  return (
    <div
      className={`w-full h-full overflow-y-auto -task-container ${
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
            3D
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
              className="nes-container is-dark with-title dark-container-nes"
              key={index}
            >
              <p className="title">{task.title}</p>
              <p className="text-xs text-left leading-4 desc-task">
                {task.description}
              </p>
              {task.resources && task.resources.length > 0 && (
                <div className="flex justify-between flex-col md:flex-row">
                  <span className="md:text-sm text-xs">Resources:</span>
                  <span className="flex flex-col md:text-sm text-xs md:flex-row">
                    {task.resources.map((resource, index) => (
                      <a href={resource} target="_blank" key={index} rel="noopener noreferrer">
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
    <div
      className="bg-black p-4 min-w-[40vw] min-h-[30vh] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 nes-container is-dark is-rounded --submit-container"
      style={{ position: "absolute" }}
    >
      <form method="">
        <p className="title text-xl">Submit Task</p>
        <input
          type="text"
          id="dark_field"
          className="nes-input is-dark"
          placeholder="Github Repository Link"
          name={`${task}-github`}
          required
        />
        <input
          type="text"
          id="dark_field"
          className="nes-input is-dark"
          placeholder="Demo Link"
          name={`${task}-demo`}
        />
        <menu className="dialog-menu mt-4">
          <button
            className="nes-btn"
            type="button"
            onClick={() => setShowModal(false)}
          >
            Cancel
          </button>
          <button className="nes-btn is-error" type="submit">
            Submit
          </button>
        </menu>
      </form>
    </div>
  );
}

const designTaskData: Task[] = [
  {
    label: "UI/UX",
    title: "Book-Tracking App UI/UX Design",
    description:
      "Design the UI/UX for a new book-tracking app that motivates users to discover their own style and interests.",
    for: "senior",
    requirements:
      "Create a wireframe or prototype for key screens (e.g. dashboard, progress tracker, notifications). Implement features that encourage user engagement (e.g., streaks, reminders, social sharing). Ensure a visually appealing and user-friendly interface.",
    resources: [],
  },
  {
    label: "UI/UX",
    title: "Personalized Learning Platform UI/UX Design",
    description:
      "Design a UI/UX experience for a personalized learning platform that adapts to users' skill levels and interests in real time.",
    for: "junior",
    requirements:
      "Create a high-fidelity prototype for core screens, including dashboard, course progress, AI-powered recommendations, and interactive lesson modules. Implement dynamic UI elements that adapt based on user performance (e.g., difficulty adjustments, personalized content suggestions). Integrate gamification elements such as XP points, badges, and learning challenges to increase engagement. Ensure a smooth onboarding flow that tailors the experience based on user preferences and prior knowledge. Optimize for both mobile and desktop experiences with a responsive design.",
    resources: [],
  },
  {
    label: "UI/UX",
    title: "Amazon UI Redesign in Spotify Style",
    description:
      "Redesign Amazon’s user interface in the style of Spotify while maintaining both identities.",
    for: "senior",
    requirements:
      "New design must maintain its identity from both of its predecessors. Must show functionality, even with basic prototyping. BONUS POINTS if a new, unique logo is made.",
    resources: [],
  },
  {
    label: "UI/UX",
    title: "LinkedIn UI Redesign with TikTok Elements",
    description:
      "Reimagine LinkedIn’s user interface with the aesthetics and user flow of TikTok while maintaining its professional identity.",
    for: "junior",
    requirements:
      "The redesign should blend LinkedIn’s professional networking features with TikTok’s visually engaging, swipe-based interface. Create key screens, including a vertical feed for content, an intuitive job search page, and a reimagined profile layout. Implement interactive features such as quick reactions, short video resumes, and AI-powered networking suggestions. The prototype should demonstrate fluid navigation, content discovery, and engagement mechanics. BONUS POINTS if you design a fresh, modernized LinkedIn logo that reflects this new dynamic experience.",
    resources: [],
  },
  {
    label: "poster",
    title: "Graphic Design",
    for:"junior",
    description:
      "Recreate a past event poster or a personalized poster that reflects your identity and interests.",
    resources: [],
  },
  {
    label: "3d",
    title: "3D",
    for:"junior",
    description: "Recreate the following 2D image to a 3D model.",
    resources: [
      "https://drive.google.com/file/d/1GeoLTRphTOrNCvwJDFMstL2hDUocp76L/view?usp=sharing",
    ],
  },
];
