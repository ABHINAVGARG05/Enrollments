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
  profileLocked?: boolean; // when true, the profile tab (id:0) is disabled
}

const tabs: Tab[] = [
  { id: 0, label: "1", description: "Complete Profile" },
  { id: 1, label: "2", description: "Tasks" },
  { id: 2, label: "3", description: "Task Submission", disabled: false },
  { id: 3, label: "4", description: "Application Status" },
];

const Header = ({ tabIndex, setTabIndex, profileLocked = false }: HeaderProps) => {
  const handleKeyPress = (event: React.KeyboardEvent, tabId: number, isDisabled: boolean | undefined) => {
    if (!isDisabled && (event.key === "Enter" || event.key === " ")) {
      setTabIndex(tabId);
    }
  };

  return (
    <div className="w-full flex justify-between md:justify-around relative h-[3rem] md:h-[5rem]">

      {tabs.map((tab) => {
        const isDisabled = tab.disabled || (profileLocked && tab.id === 0);
        return (
        <button
          key={tab.id}
          className={`nes-btn btn-header ${tabIndex === tab.id ? "is-success" : ""} ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
          onClick={() => !isDisabled && setTabIndex(tab.id)}
          onKeyDown={(event) => handleKeyPress(event, tab.id, isDisabled)}
          disabled={isDisabled}
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
        );
      })}
    </div>
  );
};

export default Header;