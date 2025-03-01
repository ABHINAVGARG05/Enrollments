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
const ManagementTask = ({ selectedSubDomain, setSelectedSubDomain }: Props) => {
  const [filteredTasks, setFilteredTask] = useState<Task[]>([]);
  // const [showModal, setShowModal] = useState(false);
  // const [taskState, setTaskState] = useState("");
  useEffect(() => {
    // Based on the sub-domain we are filtering the task
    const filteredTask = managementTaskData.filter(
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
            onClick={() => setSelectedSubDomain("outreach")}
            className="nes-btn is-error nes-btn-task w-[47%] md:w-[22%] aspect-[2] custom-nes-error text-xs"
          >
            Outreach
          </button>

          <button
            type="button"
            onClick={() => setSelectedSubDomain("general")}
            className="nes-btn is-error nes-btn-task w-[47%] md:w-[22%] aspect-[2] custom-nes-error text-xs"
          >
            General Ops.
          </button>
          
          <button
            type="button"
            onClick={() => setSelectedSubDomain("publicity")}
            className="nes-btn is-error nes-btn-task w-[47%] md:w-[22%] aspect-[2] custom-nes-error text-xs"
          >
            Publicity
          </button>

          <button
            type="button"
            onClick={() => setSelectedSubDomain("editorial")}
            className="nes-btn is-error nes-btn-task w-[47%] md:w-[22%] aspect-[2] custom-nes-error text-xs"
          >
            Editorial
          </button>
        </div>
      )}

      {selectedSubDomain !== "" && (
        <div className="w-full mt-8 h-full flex flex-col gap-4">
          {filteredTasks.map((task, index) => (
            <div
              className="nes-container is-dark with-title dark-container-nes"
              key={index}
            >
              <p className="title ">{task.title}</p>
              <p className="text-xs text-left leading-4 desc-task">
                {task.description}
              </p>

              {/* <button
                type="button"
                className="nes-btn is-error  custom-nes-error text-xs md:text-base"
                onClick={() => {
                  setShowModal(true);
                  setTaskState(task.title);
                }}
              >
                Submit Task
              </button> */}
            </div>
          ))}
        </div>
      )}
      {/* {showModal && <Modal task={taskState} setShowModal={setShowModal} />} */}
    </div>
  );
};

export default ManagementTask;
// function Modal({
//   task,
//   setShowModal,
// }: {
//   task: string;
//   setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
// }) {
//   return (
//     <div
//       className="bg-black p-4 min-w-[90vw] md:min-w-[50vw] min-h-[30vh] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 nes-container is-dark is-rounded --submit-container"
//       style={{ position: "absolute" }}
//     >
//       <form method="">
//         <p className="title text-xl">Submit Task</p>
//         <textarea
//           id="textarea_field"
//           className="nes-textarea is-dark min-h-[20rem] md:min-h-[10rem] text-xs md:text-sm max-h-[25rem] md:max-h-[20rem]"
//           name={`${task}`}
//         ></textarea>
//         <menu className="dialog-menu mt-4">
//           <button
//             className="nes-btn text-xs md:text-base"
//             type="button"
//             onClick={() => setShowModal(false)}
//           >
//             Cancel
//           </button>
//           <button
//             className="nes-btn is-error text-xs md:text-base"
//             type="submit"
//             onClick={() => {}}
//           >
//             Submit
//           </button>
//         </menu>
//       </form>
//     </div>
//   );
// }
const managementTaskData = [
  {
    label: "general",
    title: "General Ops.",
    for: "junior",
    description:
      "Imagine you are the coordinator of an event, how you will plan the event? Write the respective work flow of the event and paste the Google Drive link of the document.",
    resources: [],
  },
  {
    label: "outreach",
    title: "Outreach",
    for: "junior",
    description:
      "Draft a mail to the respective speaker (let's say Mr. Akshat Jha) for the speaker session that you are planning for your event. Paste the respective google drive link of the document.",
    resources: [],
  },
  {
    label: "editorial",
    title: "Editorial",
    for: "junior",
    description:
      "Frame a message to be sent to MFC official groups for a event – InnovationX which is basically a hackathon. Also, frame the description for the respective event. Paste the respective Google Drive link of the document.",
    resources: [],
  },
  {
    label: "publicity",
    title: "Publicity",
    for: "junior",
    description:
      "Increase the followers of Mozilla Firefox Club social media handles (like Instagram, LinkedIn, etc.). Upload the respective document containing the screenshot of when you started (count of initial followers with time) and the screenshot of when you ended (count of latest followers with time). Paste the respective Google Drive link of the document.",
    resources: [],
  },
  {
    label: "finance",
    title: "Finance",
    for: "junior",
    description:
      "Prepare a presentation outlining your overall financial strategy and approach for managing expenses within the club. Paste the respective Google Drive link of the document.",
    resources: [],
  },
  // {
  //   label: "general",
  //   title: "General Ops.",
  //   for: "senior",
  //   description:
  //     "Imagine you are coordinator of a event,how you will plan the event. Write the respective work flow of the event and paste the google drive link of the document.",
  //   resources: [],
  // },
  // {
  //   label: "outreach",
  //   title: "Outreach",
  //   for: "senior",
  //   description:
  //     "Draft a mail to respective speaker (let say Mr. Akshat Jha) for the speaker session that you are planning for your event.Paste the respective google drive link of the document.",
  //   resources: [],
  // },
  // {
  //   label: "publicity",
  //   title: "Publicity",
  //   for: "senior",
  //   description:
  //     "Increase the followers of Mozilla Firefox Club social media handles (like Instagram, LinkedIn, etc.). Upload the respective document containing the screenshot of when you started (count of initial followers with time) and the screenshot of when you ended (count of latest followers with time). Paste the respective Google Drive link of the document.",
  //   resources: [],
  // },
  // {
  //   label: "editorial",
  //   title: "Editorial",
  //   for: "senior",
  //   description:
  //     "Frame a message to be sent to MFC official groups for a event - InnovationX which is basically a hackathon.Also, frame the description for the respective event.Paste the respective google drive link of the document.",
  //   resources: [],
  // },
  // {
  //   label: "finance",
  //   title: "Finance",
  //   for: "senior",
  //   description:
  //     "prepare a presentation outlining your overall financial strategy and approach for managing expenses within the club. Paste the respective Google drive link of the document.",
  //   resources: [],
  // },
];
