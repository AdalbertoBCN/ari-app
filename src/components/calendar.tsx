"use client"

import * as React from "react"

import { Calendar as CalendarRoot } from "@/components/ui/calendar"
import { useDate } from "@/hooks/useDate"

export function Calendar() {
  const { selectedDate, setSelectedDate } = useDate();
  const [currentMonth, setCurrentMonth] = React.useState(new Date());

  React.useEffect(() => {
    if (selectedDate) {
      setCurrentMonth(new Date(selectedDate.getFullYear(), selectedDate.getMonth()));
    }
  }, [selectedDate]);

  const handleMonthChange = (newMonth: Date) => {
    setCurrentMonth(newMonth);
  };

  return (
    <div className="flex justify-center py-3">
      <CalendarRoot
        mode="single"
        selected={selectedDate}
        month={currentMonth}
        onSelect={(date) => {
          if (date) {
            setSelectedDate(date);
          }
        }}
        onMonthChange={handleMonthChange}
      />
    </div>
  );
}
