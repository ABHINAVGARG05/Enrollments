import { useEffect, useState } from "react";
import TaskModal from "../components/TaskModal";

interface Task {
  domain: string;
  subdomain: string;
  title: string;
  for: string;
  question: string;
}

interface Props {
  selectedSubDomain: string;
  setSelectedSubDomain: React.Dispatch<React.SetStateAction<string>>;
}

const ManagementTask = ({ selectedSubDomain, setSelectedSubDomain }: Props) => {
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  useEffect(() => {
    if (!selectedSubDomain) return setFilteredTasks([]);

    const tasks = managementTaskData.filter(
      (task) =>
        task.subdomain.toLowerCase() === selectedSubDomain.toLowerCase()
    );

    setFilteredTasks(tasks);
  }, [selectedSubDomain]);

  return (
    <div
      className={`w-full h-full overflow-y-hidden ${
        selectedSubDomain === "" ? "flex items-center" : ""
      }`}
    >
      {/* Subdomain buttons */}
      {selectedSubDomain === "" && (
        <div className="flex justify-center flex-wrap w-full gap-2 md:gap-3">
          {[
            { key: "Outreach", label: "Outreach" },
            { key: "General Ops", label: "General Ops" },
            { key: "Publicity", label: "Publicity" },
            { key: "Events", label: "Events" },
            { key: "Events", label: "Events" },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setSelectedSubDomain(item.key)}
              className="nes-btn is-error w-[47%] md:w-[22%] py-3 md:py-4 custom-nes-error text-xs hover:scale-105 transition-transform duration-200"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}

      {/* Task cards */}
      {selectedSubDomain !== "" && (
        <div className="task-list-container">
          <div className="task-list-header">
            <span className="task-list-count">
              {filteredTasks.length} Tasks Available
            </span>
          </div>

          <div className="task-list-grid">
            {filteredTasks.map((task, index) => (
              <div
                key={`mgmt-task-${index}`}
                className="task-item"
                onClick={() => {
                  setActiveTask(task);
                  setShowModal(true);
                }}
                style={{ animationDelay: `${index * 0.08}s` }}
              >
                <div className="task-item-header">
                  <span className="task-item-number">
                    Task {index + 1}
                  </span>
                  <span className="task-item-badge">
                    {task.for === "senior" ? "SC" : "Jr"}
                  </span>
                </div>

                <h3 className="task-item-title">
                  {task.title}
                </h3>

                <div className="task-item-footer">
                  <span className="task-item-cta">
                    View Details →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && activeTask && (
        <TaskModal
          task={{
            title: activeTask.title,
            description: activeTask.question,
            resources: [],
            label: activeTask.subdomain,
            for: activeTask.for,
          }}
          onClose={() => {
            setShowModal(false);
            setActiveTask(null);
          }}
        />
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
//       className="max-w-5xl w-[98%] md:w-[90%] lg:w-[75%] z-50 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 nes-container is-dark is-rounded p-1 text-[11px]"
//     >
//       <form method="">
//         <p className="title text-sm">Submit Task</p>
//         <textarea
//           id="textarea_field"
//           className="nes-textarea is-dark text-xs min-h-[6rem] max-h-[12rem] w-full"
//           name={`${task}`}
//         ></textarea>
//         <menu className="dialog-menu mt-3">
//           <button
//             className="nes-btn text-xs"
//             type="button"
//             onClick={() => setShowModal(false)}
//           >
//             Cancel
//           </button>
//           <button
//             className="nes-btn is-error text-xs"
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
    "subdomain": "Outreach",
    "title": "Securing Sponsorship",
    "for": "junior",
    "question": "During a sponsorship outreach discussion, a global company’s representative expresses hesitation, stating that collaborations with student clubs don’t create substantial value and are generally considered low-impact for corporate objectives. Without relying on participation numbers, event statistics, or previous achievements, how would you strategically reframe the conversation to highlight meaningful, long-term value for the company—positioning the partnership as an investment in innovation and future talent rather than a charitable contribution? "
  },
  {
    "domain": "management",
    "subdomain": "Outreach",
    "title": "Club Collaboration",
    "for": "senior",
    "question": "Another reputed student club invites collaboration, but historically both clubs appeal to very different audiences. You sense a unique opportunity but worry the collaboration may dilute your club identity. How would you design a partnership that preserves distinct identities while building a shared experience? "
  },
  {
    "domain": "management",
    "subdomain": "Events",
    "title": "Blueprint an Event",
    "for": "junior",
    "question": "Design a high-engagement tech event that does not follow standard formats like hackathons or workshops.\n\nBase Requirements: 1) Structure: 2–4 clear segments, each with a defined goal and target audience.\n2) Innovation: Use at least one of the following to drive immersion — storytelling, gamification, or social media interaction.\n\nDeliverables: 1) Event concept and theme (2–3 sentences).\n2) Segment-wise flow with approximate time durations.\n3) Specific engagement tactics used in each segment."
  },
  {
    "domain": "management",
    "subdomain": "Events",
    "title": "Design the Journey",
    "for": "senior",
    "question": "Create a 3-stage gamified participant experience that transitions from puzzle-based icebreaking to skill challenges and final rewards.\n\nBase Requirements: 1) Progressive Structure: A linear 3-level flow (Puzzle → Skill → Reward).\n2) Engagement Mechanics: Integrated gamification at every stage to drive participation.\n\nDeliverables : 1) Level 1: Puzzle or icebreaker design.\n2) Level 2: Hands-on skill challenge or activity details.\n3) Level 3: Reward and recognition system."
  },
  {
    "domain": "management",
    "subdomain": "Events",
    "title": "When Things Go Live",
    "for": "senior",
    "question": "You are leading an offline tech event scheduled for 200+ participants. One day before the event, the venue becomes unavailable.\n\nRequirements: 1) Propose a revised event plan that preserves participant value and engagement.\n2) Clearly justify any changes made to format, scale, or delivery mode.\n\nDeliverables: 1) Revised event structure (online / hybrid / alternate venue).\n2) 2. Communication strategy for participants and team.\n3) Key risks and how you would mitigate them."
  },
  {
    "domain": "management",
    "subdomain": "General Ops",
    "title": "Vexing Venue",
    "for": "junior",
    "question": "While setting up a large event, the administration suddenly asks your team to vacate the venue due to an emergency. The only available alternative has limited seating and different technical requirements. Volunteers, equipment, and participants are already split across locations, and guests are about to arrive. How would you quickly redeploy volunteers, redirect participants, manage technical arrangements, and communicate the venue change calmly so the event continues smoothly without affecting audience experience or professionalism?"
  },
  {
    "domain": "management",
    "subdomain": "General Ops",
    "title": "OD Overload",
    "for": "senior",
    "question": "Participants were promised On-Duty permission, but sudden delays in approval now risk them being marked absent or even debarred from exams. Students are anxious, faculty are upset, and approvals are out of your control. As the on-ground coordinator, how would you reassure participants, coordinate with authorities, and protect both the event’s credibility and students’ academic safety? "
  },
  {
    "domain": "management",
    "subdomain": "General Ops",
    "title": "Speaker Setback",
    "for": "junior",
    "question": "Before a pre-Gravitas workshop, the invited expert informs you he can only speak for 20 minutes instead of delivering the promised 2-hour hands-on session. This risks disappointing participants who expected practical learning. How would you redesign the session on the spot, manage expectations without revealing internal issues, and still ensure meaningful takeaways for the audience?"
  },
  {
    "domain": "management",
    "subdomain": "Publicity",
    "title": "Fixing Flagship",
    "for": "junior",
    "question": "Your flagship event is announced, but your first Instagram post receives extremely low engagement and barely reaches any non-club audience. The event deadline is close and you cannot rely on paid promotions. How would you identify the reason for low visibility, and redesign the publicity strategy in the next 48 hours to revive attention without sounding desperate? "
  },
  {
    "domain": "management",
    "subdomain": "Publicity",
    "title": "Rivalry Rebranding",
    "for": "junior",
    "question": "Just 24 hours before the event, a different college club suddenly posts about another event on the same day and your audience starts shifting interest. How would you reposition your publicity messaging and campaign so your event does not lose relevance or visibility despite competition? "
  },
  {
    "domain": "management",
    "subdomain": "Publicity",
    "title": "Pivoting Perception",
    "for": "senior",
    "question": "During Gravitas, one of your major events faced technical issues and eventually failed to deliver the promised experience. Many students expressed disappointment on social media and the club is now being perceived as unreliable. As the Publicity lead, how would you strategically rebuild credibility, regain trust, and reshape public perception— without sounding defensive or apologetic and while preparing the audience to attend future MFC events?"
  }
];
