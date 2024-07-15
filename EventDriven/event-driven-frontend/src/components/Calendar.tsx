import { useEffect, useState } from "react";
import Day from "./Day";
import "../styles/Calendar.css";
import { DocumentType, NewDocumentDTO } from '../dtos/NewDocument';
import DocumentEditorDialog from "./DocumentEditorDialog";
import { FullDocument } from "../dtos/full-document.interface";
import { DiffDTO } from "../dtos/diff.dto";

export interface DayObject {
  day: number;
  month: number;
  year: number;
  isCurrentMonth: boolean;
  documents?: { id: number; name: string; type: DocumentType }[];
}

interface CalendarProps {
  communityName: string | null;
  communityId: number;
}

const Calendar: React.FC<CalendarProps> = ({ communityName, communityId }) => {
  const MONTH_NAMES: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const DAYS: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const [month, setMonth] = useState<number>(0);
  const [year, setYear] = useState<number>(0);
  const [selectedDate, setSelectedDate] = useState<DayObject | null>(null);
  const [documents, setDocuments] = useState<{ [key: string]: { id: number; name: string; type: DocumentType }[] }>({});
  const [openEditor, setOpenEditor] = useState<boolean>(false);
  const [currentDocument, setCurrentDocument] = useState<{ docId: number | null, content: string, type: DocumentType } | null>(null);

  const today = new Date();

  useEffect(() => {
    const today = new Date();
    setMonth(today.getMonth());
    setYear(today.getFullYear());
  }, []);

  useEffect(() => {
    console.log(currentDocument);
  })

  useEffect(() => {
    
    fetchDocumentsForMonth(communityId, month + 1, year);
  }, [month, year, communityId]);

  const fetchDocumentsForMonth = async (communityId: number, month: number, year: number) => {
    try {
      const response = await fetch(`http://localhost:8000/doc/get-docs-calendar-month?calendarId=${communityId}&month=${month}&year=${year}`);
      if (response.ok) {
        const docs = await response.json();
        const docsByDay: { [key: string]: { id: number; name: string; type: DocumentType }[] } = {};
        docs.forEach((doc: { id: number; name: string; day: string; type: DocumentType }) => {
          const day = new Date(doc.day).getDate();
          const key = `${year}-${month}-${day}`;
          if (!docsByDay[key]) {
            docsByDay[key] = [];
          }
          docsByDay[key].push({ id: doc.id, name: doc.name, type: doc.type });
        });
        setDocuments(docsByDay);
      } else {
        console.error('Failed to fetch documents');
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

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
      const key = `${year}-${month + 1}-${day}`;
      weeks[currentWeek].push({
        day,
        month,
        year,
        isCurrentMonth: true,
        documents: documents[key] || [],
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

  const handleUpdateDocument = async (diffDto: DiffDTO) => {
    console.log(currentDocument);
    if (currentDocument!.docId) {
      // Update existing document
      try {
        const data = {
          id: currentDocument!.docId,
          content: diffDto.content
        }
        const response = await fetch('http://localhost:8000/doc/update', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        if (response.ok) {
          console.log('Document updated successfully');
        } else {
          console.error('Failed to update the document');
        }
      } catch (error) {
        console.error('Error updating the document:', error);
      }
    } else {
      // Create new document
      console.error("Error on handling document update");
      //setCurrentDocument({ ...currentDocument, docId: diffDto.id, content: diffDto.content, type: diffDto.type });
    }
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

  const handleDocumentClick = async (documentId: number) => {
    try {
      const response = await fetch(`http://localhost:8000/doc/get?id=${documentId}`);
      if (response.ok) {
        const data: FullDocument = await response.json();
        if (data.type === DocumentType.WHITEBOARD){
          data.content = "data:image/png;base64," + data.content
          //console.log(data.content);
        }
        setCurrentDocument({ docId: data.id, content: data.content, type: data.type });
        console.log(currentDocument);
        setOpenEditor(true);
      } else {
        console.error('Failed to fetch document content');
      }
    } catch (error) {
      console.error('Error fetching document content:', error);
    }
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
                  communityId={communityId}
                  onDocumentClick={handleDocumentClick} // Pass the handler to Day component
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {currentDocument && (
        <DocumentEditorDialog
          open={openEditor}
          onClose={() => {setOpenEditor(false)}}
          onSave={handleUpdateDocument}
          content={currentDocument.content}
          type={currentDocument.type}
          docId={currentDocument.docId!}
        />
      )}
    </div>
  );
};

export default Calendar;
