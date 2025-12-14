import { useState } from "react";
import "../components/Calendar.css";

interface CalendarProps {
  selectDate: (date: number) => void;
}

// 🔥 Change this anytime
const ALLOWED_DATES = [10, 11, 12, 13];

const Calendar: React.FC<CalendarProps> = ({ selectDate }) => {
  const [selectedDate, setSelectedDate] = useState<number | null>(null);

  const handleSelect = (date: number) => {
    if (!ALLOWED_DATES.includes(date)) return;

    setSelectedDate(date);
    selectDate(date);
  };

  const renderDate = (date: number) => {
    const isAllowed = ALLOWED_DATES.includes(date);
    const isSelected = selectedDate === date;

    return (
      <li key={date}>
        <span
          onClick={() => handleSelect(date)}
          className={`date ${
            isAllowed ? "clickable" : "deactive"
          } ${isSelected ? "selected" : ""}`}
        >
          {date}
        </span>
      </li>
    );
  };

  return (
    <>
      <div className="month">
        <ul>
          <li>January</li>
        </ul>
      </div>

      <ul className="weekdays">
        <li>Mo</li>
        <li>Tu</li>
        <li>We</li>
        <li>Th</li>
        <li>Fr</li>
        <li>Sa</li>
        <li>Su</li>
      </ul>

      <ul className="days">
        <li><span className="deactive">28</span></li>
        <li><span className="deactive">29</span></li>
        <li><span className="deactive">30</span></li>
        <li><span className="deactive">31</span></li>

        {Array.from({ length: 31 }, (_, i) => i + 1).map(renderDate)}
      </ul>
    </>
  );
};

export default Calendar;
