import React, { useState, useEffect } from 'react';
import '../styles/Calendar.css';

const Calendar: React.FC = () => {
  const MONTH_NAMES: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const DAYS: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const [month, setMonth] = useState<number>(0);
  const [year, setYear] = useState<number>(0);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);

  useEffect(() => {
    const today = new Date();
    setMonth(today.getMonth());
    setYear(today.getFullYear());
  }, []);

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();

  const generateCalendar = () => {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfWeek = new Date(year, month, 1).getDay();
    const weeks: number[][] = [[]];
    let currentWeek = 0;

    for (let i = 0; i < firstDayOfWeek; i++) {
      weeks[currentWeek].push(0);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      if (weeks[currentWeek].length === 7) {
        currentWeek++;
        weeks[currentWeek] = [];
      }
      weeks[currentWeek].push(day);
    }

    return weeks;
  };

  const handleDateClick = (day: number) => {
    setSelectedDate(day);
    // You can add more logic here, like showing the event modal for the selected date
    // For simplicity, I'll just log the selected date to the console
    console.log(`Selected date: ${year}-${month + 1}-${day}`);
  };

  const handleMonthChange = (increment: number) => {
    const newMonth = month + increment;
    if (newMonth < 0) {
      setMonth(11);
      setYear(year - 1);
    } else if (newMonth > 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(newMonth);
    }
    setSelectedDate(null);
  };

  return (
    <div className="calendar">
      <div className="header">
        <button onClick={() => handleMonthChange(-1)}>&lt;</button>
        <h2>{MONTH_NAMES[month]} {year}</h2>
        <button onClick={() => handleMonthChange(1)}>&gt;</button>
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
              <div
                key={dayIndex}
                className={`day ${day === 0 ? 'empty' : ''} ${day === selectedDate ? 'selected' : ''}`}
                onClick={() => handleDateClick(day)}
              >
                {day !== 0 && day}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
