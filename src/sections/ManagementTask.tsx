import { useEffect, useState } from "react";

interface Task {
  domain: string;
  subdomain: string;
  label: number;
  for: string;
  question: string;
}

interface Props {
  selectedSubDomain: string;
  setSelectedSubDomain: React.Dispatch<React.SetStateAction<string>>;
}


const ManagementTask = ({ selectedSubDomain, setSelectedSubDomain }: Props) => {
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  
  useEffect(() => {
    // Map the string subdomain to the correct filter criteria
    const getFilteredTasks = () => {
      if (!selectedSubDomain) return [];
      
      return managementTaskData.filter(
        (task) => task.subdomain.toLowerCase() === selectedSubDomain.toLowerCase()
      );
    };
    
    const filteredTask = getFilteredTasks();
    setFilteredTasks(filteredTask);
  }, [selectedSubDomain]);

  return (
    <div
      className={`w-full h-full overflow-y-scroll task-container ${
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
            onClick={() => setSelectedSubDomain("generaloperations")}
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
              key={`task-${task.label}-${index}`}
            >
              <p className="text-xs text-left leading-4 desc-task">
                {task.question}
              </p>
            </div>
          ))}
        </div>
      )}
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
    "domain": "management",
    "subdomain": "outreach",
    "label": 1,
    "for": "junior",
    "question": "In a brief but critical encounter with a distinguished speaker or potential collaborator, you must effectively convey your organization's mission, key achievements, and unique value proposition. How would you structure a compelling and concise introduction that captures their interest? Additionally, when proposing a joint initiative to another organization, what strategic considerations and value-driven arguments would you emphasize to secure their collaboration?"
  },
  {
    "domain": "management",
    "subdomain": "outreach",
    "label": 2,
    "for": "junior",
    "question": "Moments before a high-profile event, the keynote speaker cancels due to unforeseen circumstances, creating a potential credibility risk for the organization. How would you implement an immediate contingency plan to sustain audience engagement and uphold the event's professionalism? Beyond immediate crisis resolution, what long-term strategies would you establish to fortify the organization's reputation and mitigate reputational risks associated with unforeseen disruptions?"
  },
  {
    "domain": "management",
    "subdomain": "outreach",
    "label": 3,
    "for": "junior",
    "question": "A potential sponsor, initially expressing interest in funding an event, hesitates at the final stage, seeking a more concrete justification for their return on investment (ROI). How would you construct a data-driven and persuasive case to secure their financial commitment? In a separate scenario, a major sponsor unexpectedly withdraws days before the event, creating a significant financial shortfall. What strategies would you employ to secure alternative funding sources or implement budgetary adjustments without compromising the event's quality or objectives?"
  },
  {
    "domain": "management",
    "subdomain": "outreach",
    "label": 4,
    "for": "junior",
    "question": "How do you handle sponsorship negotiations when a potential sponsor requests exclusivity within a specific category, and how do you balance their demands while ensuring the financial sustainability and diversity of event sponsorships?"
  },
  {
    "domain": "management",
    "subdomain": "editorial",
    "label": 5,
    "for": "junior",
    "question": "Compose a compelling, well-structured blog on a topic of your choice, ensuring clarity, depth, and sustained reader engagement. Justify your topic selection by articulating its relevance, significance, and potential impact. How would you maintain a balance between informative content and narrative appeal to captivate a diverse audience?"
  },
  {
    "domain": "management",
    "subdomain": "editorial",
    "label": 6,
    "for": "junior",
    "question": "Draft a professional, engaging, and persuasive email invitation for a guest speaker session, ensuring the tone is both formal and compelling. How would you effectively communicate the value of the session, highlight the speaker's relevance to the audience, and encourage a positive response while maintaining professionalism?"
  },
  {
    "domain": "management",
    "subdomain": "editorial",
    "label": 7,
    "for": "junior",
    "question": "Develop a seamless and engaging anchoring script (within 400 words) for a themed college fest, where the hosts embody the role of 'Time Travelers,' guiding the audience through performances spanning different eras. How would you integrate historical and futuristic elements to create an immersive and coherent narrative while maintaining audience engagement and ensuring smooth event transitions?"
  },
  {
    "domain": "management",
    "subdomain": "editorial",
    "label": 8,
    "for": "junior",
    "question": "Write a well-researched and thought-provoking opinion piece on a contemporary issue, ensuring a structured presentation of arguments supported by credible evidence. How would you anticipate and address counterarguments to provide a nuanced and balanced perspective while reinforcing the strength of your stance?"
  },
  {
    "domain": "management",
    "subdomain": "generaloperations",
    "label": 9,
    "for": "junior",
    "question": "Outline a structured event flow for a 250-participant 36-hour coding hackathon, ensuring efficient logistical planning and seamless management. How would you coordinate venue setup, technical infrastructure, participant onboarding, judging processes, sponsor integration, and contingency measures to handle unforeseen challenges while maintaining a high-quality experience for all stakeholders?"
  },
  {
    "domain": "management",
    "subdomain": "generaloperations",
    "label": 10,
    "for": "junior",
    "question": "As an event coordinator, you are responsible for ensuring the smooth execution of an upcoming event. However, several team members within the club are consistently missing deadlines and failing to complete their assigned tasks, putting the overall timeline at risk. How would you assess the root cause of these inefficiencies, implement corrective measures to re-align responsibilities, and enforce accountability while maintaining team morale and ensuring the event stays on track?"
  },
  {
    "domain": "management",
    "subdomain": "generaloperations",
    "label": 11,
    "for": "junior",
    "question": "A misunderstanding between two student organizations escalated into a public dispute, with members engaging in pointed exchanges on a social media platform. As engagement surged, the conflict drew widespread attention, risking reputational damage. As a leader, how would you dissect the root cause, implement decisive measures to defuse tensions while upholding professionalism, and establish safeguards to prevent future conflicts?"
  },
  {
    "domain": "management",
    "subdomain": "generaloperations",
    "label": 12,
    "for": "junior",
    "question": "In a high-pressure event scenario, you realize that key operational decisions need to be made on the spot, but senior organizers are unavailable, and conflicting inputs from different team members create confusion. How would you approach decision-making in such a situation while ensuring clarity, accountability, and minimal disruption to the event?"
  },
  {
    "domain": "management",
    "subdomain": "publicity",
    "label": 13,
    "for": "junior",
    "question": "What are some innovative and visually engaging reel concepts that could effectively promote our club's events while maximizing audience reach and participation?"
  },
  {
    "domain": "management",
    "subdomain": "publicity",
    "label": 14,
    "for": "junior",
    "question": "How would you craft a compelling and strategic pitch that highlights our club's value, objectives, and impact to attract both potential recruits and event attendees?"
  },
  {
    "domain": "management",
    "subdomain": "publicity",
    "label": 15,
    "for": "junior",
    "question": "If two clubs are hosting events on the same day, what targeted promotional strategies would you implement to ensure our event gains maximum visibility and engagement?"
  },
  {
    "domain": "management",
    "subdomain": "publicity",
    "label": 16,
    "for": "junior",
    "question": "Suggest five unique and impactful Instagram content strategies—spanning reels, posts, and stories—that would strengthen our club's digital presence and engagement."
  }
];
