import { useEffect, useState } from "react";
interface Task {
  label: string;
  description: string;
  title: string;
  resources: string[];
}
interface Props {
  selectedSubDomain: string;
  setSelectedSubDomain: React.Dispatch<React.SetStateAction<string>>;
}
const DesignTask = ({ selectedSubDomain, setSelectedSubDomain }: Props) => {
  const [filteredTasks, setFilteredTask] = useState<Task[]>([]);
  useEffect(() => {
    const filteredTask = designTaskData.filter(
      (task) => task.label === selectedSubDomain
    );
    if (filteredTask) {
      setFilteredTask(filteredTask);
    }
  }, [selectedSubDomain]);

  return (
    <div
      className={`w-full h-full overflow-y-scroll -task-container ${
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
            className="nes-btn is-error  w-[47%] md:w-[22%] aspect-[2] custom-nes-error text-xs"
          >
            3D
          </button>
          <button
            type="button"
            onClick={() => setSelectedSubDomain("video")}
            className="nes-btn is-error  w-[100%] min-w-fit h-fit lg:w-[22%] md:aspect-[2] custom-nes-error text-xs"
          >
            Videoediting/ <br />
            Photography
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
              <p className="title ">{task.title}</p>
              <p className="text-xs text-left leading-4 desc-task">
                {task.description}
              </p>
              {task.resources.length > 0 && (
                <div className="flex justify-between flex-col md:flex-row">
                  <span className="md:text-sm text-xs">Resources:</span>
                  <span className="flex flex-col md:text-sm text-xs md:flex-row">
                    {task.resources.map((resource, index) => (
                      <a href={resource} target="_blank" key={index}>
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
      {/* {showModal && <Modal task={taskState} setShowModal={setShowModal} />} */}
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
          <button className="nes-btn is-error" type="submit" onClick={() => {}}>
            Submit
          </button>
        </menu>
      </form>
    </div>
  );
}
const designTaskData = [
  {
    label: "video",
    title: "Videoediting/Photography",
    description:
      "Create a 60-second reel highlighting MFC (Mozilla Firefox Club) events, drawing inspiration from past successes like Gravitas, Riviera, or any other relevant events. Utilize background music, templates, and scripting as needed to craft a compelling narrative. Be sure to capture the essence and excitement of these events while showcasing the diverse range of activities and experiences they offer. Instruction : Download any reel from our official Insta handle, and add motion text, background music, stock videos to recreate it.",
    resources: [
      "https://www.instagram.com/mfc_vit?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
    ],
  },
  {
    label: "ui",
    title: "UI/UX",
    description:
      "Your mission is to overhaul the MFC website by designing and prototyping UI/UX modifications for an enhanced user experience. Referencing the current website (link provided below), identify areas for improvement and implement changes to streamline navigation, improve visual appeal, and optimize functionality. Consider factors like responsiveness, accessibility, and branding consistency throughout the redesign. Additionally, provide detailed documentation outlining your design rationale, wireframes, and interactive prototypes to guide the development process effectively.",
    resources: ["https://www.mfcvit.in/"],
  },
  {
    label: "poster",
    title: "Graphic Design",
    description:
      "Your task is to recreate either a past event poster or a personalized poster that reflects your identity and interests. For the past event poster, choose any event from our archive, such as Gravitas or Riviera, and reimagine its promotional material with fresh creativity and design. Alternatively, craft a personalized poster that showcases who you are, including your passions, skills, and aspirations. Ensure that your poster design aligns with the organization's branding guidelines while incorporating innovative elements to captivate the audience's attention. Provide a brief rationale for your design choices and any inspiration sources utilized. Be prepared to present and discuss your poster during the evaluation process.",
    resources: [],
  },

  {
    label: "3d",
    title: "3D",
    description: "Recreate the following 2D image to a 3D model.",
    resources: [
      "https://drive.google.com/file/d/1GeoLTRphTOrNCvwJDFMstL2hDUocp76L/view?usp=sharing",
    ],
  },
];
