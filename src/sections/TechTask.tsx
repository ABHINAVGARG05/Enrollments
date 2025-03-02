import { useEffect, useLayoutEffect, useState } from "react";
import secureLocalStorage from "react-secure-storage";
interface Task {
  label: string;
  description: string;
  title: string;
  resources?: string[];
}
interface Props {
  selectedSubDomain: string;
  setSelectedSubDomain: React.Dispatch<React.SetStateAction<string>>;
}
const TechTask = ({ selectedSubDomain, setSelectedSubDomain }: Props) => {
  const [filteredTasks, setFilteredTask] = useState<Task[]>([]);
  const [isSC, setIsSC] = useState(false);
  // const [showModal, setShowModal] = useState(false);
  // const [taskState, setTaskState] = useState("");
  useEffect(() => {
    // Based on the sub-domain we are filtering the task
    const filteredTask = techTaskData.filter(
      (task) =>
        task.label === selectedSubDomain &&
        (isSC === true ? task.for === "senior" : task.for === "junior")
    );
    if (filteredTask) {
      setFilteredTask(filteredTask);
    }
  }, [selectedSubDomain, isSC]);

  // useEffect(() => {
  //   const isSenior = secureLocalStorage.getItem("isSC");
  //   setIsSC();
  // }, [isSC]);

  useLayoutEffect(() => {
    const userDetailsstore = secureLocalStorage.getItem(
      "userDetails"
    ) as string;
    if (userDetailsstore) {
      const userDetails = JSON.parse(userDetailsstore);
      setIsSC(userDetails.isSC);
    }
  }, []);
  // console.log(isSC);

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
            onClick={() => setSelectedSubDomain("frontend")}
            className="nes-btn nes-btn-task is-error w-[47%] md:w-[22%] aspect-[2] custom-nes-error text-xs"
          >
            Frontend
          </button>
          <button
            type="button"
            onClick={() => setSelectedSubDomain("backend")}
            className="nes-btn is-error nes-btn-task  w-[47%] md:w-[22%] aspect-[2] custom-nes-error text-xs"
          >
            Backend
          </button>
          <button
            type="button"
            onClick={() => setSelectedSubDomain("cybersec")}
            className="nes-btn is-error nes-btn-task  w-[47%] md:w-[22%] aspect-[2] custom-nes-error text-xs"
          >
            Cyber Security
          </button>
          <button
            type="button"
            onClick={() => setSelectedSubDomain("app")}
            className="nes-btn is-error  nes-btn-task w-[47%] md:w-[22%] aspect-[2] custom-nes-error text-xs"
          >
            App Dev
          </button>
          <button
            type="button"
            onClick={() => setSelectedSubDomain("ai/ml")}
            className="nes-btn is-error nes-btn-task w-[47%] md:w-[22%] aspect-[2] custom-nes-error text-xs"
          >
            AI/ML
          </button>


          {!isSC && (
            <button
              type="button"
              onClick={() => setSelectedSubDomain("cp")}
              className="nes-btn is-error nes-btn-task w-[47%] md:w-[22%] aspect-[2] custom-nes-error text-xs"
            >
              CP
            </button>
          )}
        </div>
      )}

      {selectedSubDomain !== "" && (
        <div className="w-full mt-8 h-full flex flex-col gap-8 md:gap-4">
          {filteredTasks.map((task, index) => (
            <div
              className="nes-container is-dark with-title  dark-container-nes"
              key={index}
            >
              <p className="title">{task.title}</p>
              <p className="text-xs md:text-sm text-left leading-4 desc-task">
                {task.description}
              </p>
              {task.resources && task.resources.length > 0 && (
                <div className="flex justify-between flex-col md:flex-row">
                  <span className="md:text-sm text-xs">Resources:</span>
                  <span className="flex flex-col md:text-sm text-xs md:flex-row">
                    {task.resources &&
                      task.resources.map((resource, index) => (
                        <a href={resource} target="_blank" key={index}>
                          Resource {index + 1} &nbsp;
                        </a>
                      ))}
                  </span>
                </div>
              )}
              {/* <button
                type="button"
                className="nes-btn is-error  custom-nes-error"
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

export default TechTask;
// function Modal({
//   task,
//   setShowModal,
// }: {
//   task: string;
//   setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
// }) {
//   return (
//     <div
//       className="bg-black p-4 min-w-[40vw] min-h-[30vh] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 nes-container is-dark is-rounded --submit-container"
//       style={{ position: "absolute" }}
//     >
//       <form method="">
//         <p className="title text-xl">Submit Task</p>
//         <input
//           type="text"
//           id="dark_field"
//           className="nes-input is-dark"
//           placeholder="Github Repository Link"
//           name={`${task}-github`}
//           required
//         />
//         <input
//           type="text"
//           id="dark_field"
//           className="nes-input is-dark"
//           placeholder="Demo Link"
//           name={`${task}-demo`}
//         />
//         <menu className="dialog-menu mt-4">
//           <button
//             className="nes-btn"
//             type="button"
//             onClick={() => setShowModal(false)}
//           >
//             Cancel
//           </button>
//           <button className="nes-btn is-error" type="submit" onClick={() => {}}>
//             Submit
//           </button>
//         </menu>
//       </form>
//     </div>
//   );
// }
const techTaskData = [
  {
    "label": "backend",
    "title": "Blog Management API",
    "description": "Develop a Blog Management API that allows users to create, manage, and interact with blog posts. The backend can be implemented in any programming language and can use any database (SQL or NoSQL) for data storage. Core Features: Users can create a blog post with a title and content. Users can view all blog posts. Users can update a blog post. Users can delete a blog post. Users can add comments to a blog post. Bonus Points: Implement likes on blog posts. Add JWT Authentication to allow users to manage their own posts securely. Deploy the API on a cloud platform. Write a comprehensive README with API documentation, including request and response examples. Use Go for the backend. Use an SQL database.",
    "for": "junior"
  },
  {
    "label": "backend",
    "title": "To-Do List API",
    "description": "Develop a To-Do List API that allows users to create, manage, and track their tasks. The backend can be implemented in any programming language and can use any database (SQL or NoSQL) for data storage. Core Features: Users can create a task with a title and description. Users can view all their tasks. Users can update a task's title, description, or completion status. Users can delete a task. Bonus Points: Implement due dates for tasks and allow sorting by due date. Add categories or tags to tasks for better organization. Implement JWT Authentication so users can manage their own tasks. Deploy the API on a cloud platform. Use Go for the backend and an SQL database for storage. Write a README with API documentation.",
    "for": "junior"
  },
  {
    "label": "backend",
    "title": "Advanced Event Management API",
    "description": "Develop an Advanced Event Management API that allows users to create, manage, and track events, including attendee management, ticketing, and role-based permissions. The backend can be implemented in any programming language and can use any database (SQL or NoSQL) for data storage. Core Features: Users can create an event with a title, description, date, location, and event type (public/private). Users can view all public events and only their own private events. Users can update or delete their own events. Users can register for an event and receive a QR code ticket for entry. Event organizers can track attendance using QR code scanning. Implement role-based access control (RBAC): Organizer: Can create, update, and manage event details & attendees. Attendee: Can register for events and view details. Write a comprehensive README with API documentation, including request/response examples. Bonus Points: Implement ticket pricing with different tiers (e.g., Regular, VIP). Add real-time notifications for event updates using WebSockets. Implement search and filtering (e.g., by date, location, event type). Deploy the API on a cloud platform with auto-scaling. Use Go for the backend and an SQL database for storage.",
    "for": "senior"
  },
  {
    "label": "backend",
    "title": "Advanced Multi-Tenant Inventory Management API",
    "description": "Develop an Advanced Multi-Tenant Inventory Management API that allows businesses to manage their inventory, track stock levels, handle orders, and manage suppliers efficiently. The backend can be implemented in any programming language and can use any database (SQL or NoSQL) for data storage. Core Features: Multi-Tenant System: Each business has its own separate inventory and users. Product Management: Businesses can add, update, and delete products, including batch tracking and expiry dates. Stock Management: Businesses can track stock levels across multiple warehouses/locations and receive low-stock alerts. Order Management: Businesses can place and manage customer orders, update order status (Pending, Shipped, Delivered, Canceled). Businesses can track order fulfillment, ensuring stock availability before confirming orders. Supplier Management: Businesses can add and manage suppliers, track incoming stock, and create purchase orders. Role-Based Access Control (RBAC): Admin: Can manage all products, orders, warehouses, and users within their business. Employee: Can manage stock levels but cannot delete products. Warehouse Manager: Can update stock across warehouses but cannot handle orders. Sales and Stock Reports: Generate reports for sales trends, stock usage, and purchase orders. Write a README with API documentation and sample request/response examples. Bonus Points: RESTful API with Pagination & Filtering: Support query-based filtering (e.g., by product category, stock status). Supplier and Purchase Order Tracking: Businesses can view incoming stock shipments from suppliers. Deploy the API on a cloud platform with auto-scaling. Use Go for the backend and an SQL database for structured data storage.",
    "for": "senior"
  },
  {
    "label": "ai/ml",
    "title": "Rental Price Prediction Model",
    "description": "Perform data visualization and generate key insights from the given dataset. Then, build a machine learning model to predict rental prices based on various features such as location, property size, number of bedrooms, and amenities. Requirements: Conduct Exploratory Data Analysis (EDA) to identify trends, correlations, and anomalies. Visualize rental price distribution, correlations between price and key features, and geographic rent variations. Preprocess the dataset (handle missing values, normalize data, encode categorical variables). Train and evaluate a machine learning model for rent prediction. Interpret model results and provide actionable insights based on the findings.",
    "resources": [
      "https://drive.google.com/file/d/193NnzSRruE3uZvkvT4XaUDNI_oVHbA_I/view?usp=drive_link",
      "https://drive.google.com/file/d/1XNK7ZL-5a4enlcubVoro0VYZ0QgZb42X/view?usp=drive_link"
    ],
    "for": "junior"
  },
  {
    "label": "ai/ml",
    "title": "Sequential Image Classification Model",
    "description": "Develop a Sequential Machine Learning Model that can identify and categorize images into predefined classes.",
    "for": "junior"
  },
  {
    "label": "ai/ml",
    "title": "CIFAR-10 Neural Network from Scratch",
    "description": "Build a machine learning model from scratch to train on the CIFAR-10 dataset using only NumPy, Pandas, and other basic libraries (without TensorFlow or PyTorch). The model should be a fully connected neural network that can classify images into 10 categories.",
    "for": "senior"
  },
  {
    "label": "ai/ml",
    "title": "Advanced Spam Detection Model",
    "description": "Build an advanced Spam Detection Model for Messages, using Natural Language Processing (NLP) techniques and an Advanced Deep Learning-based approach.",
    "for": "senior"
  },
  {
    "label": "frontend",
    "title": "Responsive Portfolio Website",
    "description": "Build a personal portfolio website that demonstrates responsiveness, user interaction, and creative design. Mandatory Requirements: Header & Navigation, About Section, Projects Section, Contact Section, Footer, Styling & Color Constraints, Hidden Validator, and Documentation. The website must include custom CSS animations, real-time form validation, and be fully responsive. Bonus Challenges: Implement a 'Back to Top' button with custom animation, add dark mode toggle, display a live clock that shows your local time zone using JavaScript.",
    "for": "junior"
  },
  {
    "label": "frontend",
    "title": "Interactive To-Do List",
    "description": "Create a dynamic to-do list application that integrates custom input behaviors, sorting, and personalized motivational messages. Mandatory Requirements: Task Addition with autocomplete for recurring tasks, Task Display with custom styling based on priority, Interactivity for marking tasks as completed, Custom Sorting Logic, Local Storage Checksum, and Documentation. Bonus Challenges: Persist tasks in localStorage, add filters to switch between 'All,' 'Active,' and 'Completed' tasks, implement a custom notification for overdue tasks.",
    "for": "junior"
  },
  {
    "label": "frontend",
    "title": "Weather Dashboard with API Integration",
    "description": "Develop a weather dashboard using a JavaScript framework of your choice. This dashboard must integrate with at least two niche weather APIs, provide a multifaceted view of weather information, and incorporate personalized features. Mandatory Requirements: City Weather Search, Dynamic Visualization, Forecast Cards, Error Handling, Weather Journal, Temperature Unit Toggle, API Key Obfuscation, and Documentation. Bonus Challenges: Add geolocation support with an animated UI element, implement a 'Favorites' list with drag-and-drop reordering, provide an 'Export to PDF' button that exports the weather journal, optimize performance using memoization or debouncing.",
    "for": "senior"
  },
  {
    "label": "frontend",
    "title": "E-Commerce Product Listing Page",
    "description": "Create an e-commerce product listing page using a JavaScript framework of your choice. The page should dynamically fetch product data, allow interaction through filtering and sorting, and include personalized features that simulate a modern shopping experience. Mandatory Requirements: Product Listing with image carousel, Filtering & Sorting with debounced input, 'Recommended for You' Section, Wishlist Feature, Pagination/Infinite Scroll & Price Range Filter, and Documentation. Bonus Challenges: Implement a fully functioning shopping cart with quantity controls and real-time total calculation, enhance accessibility and add smooth hover animations for product cards.",
    "for": "senior"
  }, 
  {
    "label": "cybersec",
    "title": "Capture the Flag (CTF) Challenge",
    "description": "Solve cybersecurity challenges in cryptography, web vulnerabilities, and reverse engineering to find hidden flags. Using platforms like PicoCTF or local setups, they should know about SQL injection, XSS, and encryption basics.",
    "for": "senior"
  },
  {
    "label": "cybersec",
    "title": "Capture the Flag (CTF) Challenge",
    "description": "Solve cybersecurity challenges in cryptography, web vulnerabilities, and reverse engineering to find hidden flags. Using platforms like PicoCTF or local setups, they should know about SQL injection, XSS, and encryption basics.",
    "for": "junior"
  },
  {
    "label": "cybersec",
    "title": "Simulated Cyber Attack & Defense",
    "description": "Your system is under attack! Identify vulnerabilities in your own machine using Nmap, Wireshark, and OWASP ZAP. Simulate an attack like a MITM (Man-in-the-Middle), SQL injection, or XSS, document your findings, and secure your system against exploitation. Submit a detailed report with attack steps, detection, and mitigation strategies.",
    "for": "senior"
  },
  {
    "label": "cybersec",
    "title": "Simulated Cyber Attack & Defense",
    "description": "Your system is under attack! Identify vulnerabilities in your own machine using Nmap, Wireshark, and OWASP ZAP. Simulate an attack like a MITM (Man-in-the-Middle), SQL injection, or XSS, document your findings, and secure your system against exploitation. Submit a detailed report with attack steps, detection, and mitigation strategies.",
    "for": "junior"
  },
  {
    "label": "app",
    "title": "The Curious Case of the Lost Journal",
    "description": "Build a Flutter mystery adventure where users explore locations, collect clues, and make decisions leading to multiple endings. Implement state management, custom navigation, an inventory system, and dialogues. Bonus: animations, local storage, a mini-game, and dark mode. Tests logic, UI, and state handling. ",
    "for": "junior"
  },
  {
    "label": "app",
    "title": "The Curious Case of the Lost Journal",
    "description": "Build a Flutter mystery adventure where users explore locations, collect clues, and make decisions leading to multiple endings. Implement state management, custom navigation, an inventory system, and dialogues. Bonus: animations, local storage, a mini-game, and dark mode. Tests logic, UI, and state handling. ",
    "for": "senior"
  },
  {
    "label": "app",
    "title": "Glitch in the System",
    "description":
      "Build a Flutter sci-fi adventure where users play as a hacker trapped in a virtual world. They must navigate a corrupted system, solve logic-based puzzles, and bypass security layers to escape. Implement state management, branching paths, hacking-themed UI, and interactive terminals. Bonus: glitch effects, encryption puzzles, and adaptive soundscapes.",

    "for": "junior",
  },
  {
    "label": "app",
    "title": "Glitch in the System",
    "description":
      "Build a Flutter sci-fi adventure where users play as a hacker trapped in a virtual world. They must navigate a corrupted system, solve logic-based puzzles, and bypass security layers to escape. Implement state management, branching paths, hacking-themed UI, and interactive terminals. Bonus: glitch effects, encryption puzzles, and adaptive soundscapes.",

    "for": "senior",
  },

  {
    "label": "cp",
    "title": "Task: Implement a Simple Sorting Algorithm and Compare Performance",
    "description":
      "Description: Create a program that implements a basic sorting algorithm (e.g., Bubble Sort, Selection Sort, Insertion Sort) and compare its performance with other sorting algorithms using time complexity analysis.",
    "for": "junior",
  },

  {
    "label": "cp",
    "title":
      "Task: Develop a Basic Library Management System with CRUD Operations",
    "description":
      "Description: Build a simple command-line based library management system that allows users to manage books and members using basic CRUD (Create, Read, Update, Delete) operations directly within the application.",
    "for": "junior",
  },
];