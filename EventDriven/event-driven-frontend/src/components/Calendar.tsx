import { useEffect, useState } from "react";
import Day from "./Day";
import "../styles/Calendar.css";

export interface DayObject {
  day: number;
  month: number;
  year: number;
  isCurrentMonth: boolean;
}

interface CalendarProps {
  communityName: string | null;
}

const Calendar: React.FC<CalendarProps> = ({ communityName }) => {
  const MONTH_NAMES: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const DAYS: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const [month, setMonth] = useState<number>(0);
  const [year, setYear] = useState<number>(0);
  const [selectedDate, setSelectedDate] = useState<DayObject | null>(null);

  const today = new Date();

  useEffect(() => {
    const today = new Date();
    setMonth(today.getMonth());
    setYear(today.getFullYear());
  }, []);

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();

  const generateCalendar = () => {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfWeek = new Date(year, month, 1).getDay();
    const weeks: DayObject[][] = [[]];
    let currentWeek = 0;

    const prevMonthDays = month === 0 ? getDaysInMonth(year - 1, 11) : getDaysInMonth(year, month - 1);
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;

    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      weeks[currentWeek].push({
        day: prevMonthDays - i,
        month: prevMonth,
        year: prevYear,
        isCurrentMonth: false,
      });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      if (weeks[currentWeek].length === 7) {
        currentWeek++;
        weeks[currentWeek] = [];
      }
      weeks[currentWeek].push({
        day,
        month,
        year,
        isCurrentMonth: true,
      });
    }

    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;

    const lastWeek = weeks[weeks.length - 1];
    const remainingEmptyDays = 7 - lastWeek.length;
    for (let i = 0; i < remainingEmptyDays; i++) {
      weeks[currentWeek].push({
        day: i + 1,
        month: nextMonth,
        year: nextYear,
        isCurrentMonth: false,
      });
    }

    while (weeks.length < 6) {
      currentWeek++;
      weeks[currentWeek] = [];
      for (let i = 0; i < 7; i++) {
        weeks[currentWeek].push({
          day: i + 1,
          month: nextMonth,
          year: nextYear,
          isCurrentMonth: false,
        });
      }
    }

    return weeks;
  };

  const handleDateClick = (day: DayObject) => {
    setSelectedDate(day);
    console.log(day);
  };

  const handleMonthChange = (increment: number) => {
    let newMonth = month + increment;
    let newYear = year;

    if (newMonth < 0) {
      newMonth = 11;
      newYear = year - 1;
    } else if (newMonth > 11) {
      newMonth = 0;
      newYear = year + 1;
    }

    setMonth(newMonth);
    setYear(newYear);
    setSelectedDate(null);
  };

  return (
    <div className="home-container">
      <div className="calendar">
        <div className="header">
          <div>
            <label>{communityName || 'Ime zajednice'}</label>
          </div>

          <div className="monthChangerDiv">
            <button onClick={() => handleMonthChange(-1)}>&lt;</button>
            <h2>{MONTH_NAMES[month]} {year}</h2>
            <button onClick={() => handleMonthChange(1)}>&gt;</button>
          </div>
        </div>
        <div className="days">
          {DAYS.map(day => (
            <div key={day} className="day-label">{day}</div>
          ))}
        </div>
        <div className="weeks">
          {generateCalendar().map((week, weekIndex) => (
            <div key={weekIndex} className="week">
              {week.map((day, dayIndex) => (
                <Day
                  key={dayIndex}
                  day={day}
                  isSelected={(selectedDate && day.day === selectedDate.day && day.month === selectedDate.month && day.year === selectedDate.year) || false} 
                  isCurrentDay={day.isCurrentMonth && day.day === today.getDate() && month === today.getMonth() && year === today.getFullYear()}
                  onDateClick={handleDateClick}
                  communityId={1} //BICE IZMENJENO
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
