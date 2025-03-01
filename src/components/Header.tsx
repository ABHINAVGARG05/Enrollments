import React from "react";

interface Tab {
  id: number;
  label: string;
  description: string;
  disabled?: boolean;
}

interface HeaderProps {
  tabIndex: number;
  setTabIndex: (index: number) => void;
}

const tabs: Tab[] = [
  { id: 0, label: "1", description: "Complete Profile" },
  { id: 1, label: "2", description: "Tasks" },
  { id: 2, label: "3", description: "Task Submission", disabled: false },
  { id: 3, label: "4", description: "Application Status" },
];

const Header = ({ tabIndex, setTabIndex }: HeaderProps) => {
  const handleKeyPress = (event: React.KeyboardEvent, tabId: number, isDisabled: boolean | undefined) => {
    if (!isDisabled && (event.key === "Enter" || event.key === " ")) {
      setTabIndex(tabId);
    }
  };

  return (
    <div className="w-full flex justify-between md:justify-around relative h-[3rem] md:h-[5rem]">

      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`nes-btn btn-header ${tabIndex === tab.id ? "is-success" : ""} ${tab.disabled ? "opacity-50 cursor-not-allowed" : ""
            }`}
          onClick={() => !tab.disabled && setTabIndex(tab.id)}
          // onKeyDown={(event) => handleKeyPress(event, tab.id, tab.disabled)}
          disabled={tab.disabled}
          aria-selected={tabIndex === tab.id} 
          role="tab"
        >
          <span className="text-xl">{tab.label}</span>
          <p className="text-xs hidden lg:block">
            {tab.description.includes(" ") ? tab.description.split(" ").map((word, index) => (
              <React.Fragment key={index}>
                {word}
                {index < tab.description.split(" ").length - 1 && <br />}
              </React.Fragment>
            )) : tab.description}
          </p>
        </button>
      ))}
    </div>
  );
};

export default Header;