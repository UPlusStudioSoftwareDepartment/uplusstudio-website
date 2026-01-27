"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";

interface AdvancedCalendarProps {
  selectedDate: string;
  onDateSelect: (date: string) => void;
  onTimeSelect: (time: string) => void;
  selectedTime: string;
}

export default function AdvancedCalendar({ selectedDate, onDateSelect, onTimeSelect, selectedTime }: AdvancedCalendarProps) {
  const { t } = useTranslation("appointment");
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    
    return days;
  };

  const isDateDisabled = (day: number | null) => {
    if (!day) return true;
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const isDateSelected = (day: number | null) => {
    if (!day) return false;
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const selected = new Date(selectedDate);
    return date.toDateString() === selected.toDateString();
  };

  const handleDateClick = (day: number | null) => {
    if (!day || isDateDisabled(day)) return;
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    // Format date as YYYY-MM-DD in local timezone
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const dayStr = String(date.getDate()).padStart(2, '0');
    onDateSelect(`${year}-${month}-${dayStr}`);
  };

  const monthNames = [
    "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
    "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
  ];

  const weekDays = ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"];

  const navigateMonth = (direction: number) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + direction, 1));
  };

  return (
    <div className="space-y-4">
      {/* Calendar */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigateMonth(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <h3 className="text-lg font-semibold">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h3>
          
          <button
            onClick={() => navigateMonth(1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Week days */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {weekDays.map((day) => (
            <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-2">
          {generateCalendarDays().map((day, index) => (
            <button
              key={index}
              onClick={() => handleDateClick(day)}
              disabled={isDateDisabled(day)}
              className={`
                aspect-square flex items-center justify-center rounded-lg text-sm font-medium transition-all
                ${!day ? 'invisible' : ''}
                ${isDateDisabled(day) 
                  ? 'text-gray-300 cursor-not-allowed' 
                  : 'hover:bg-blue-50 cursor-pointer'
                }
                ${isDateSelected(day) 
                  ? 'bg-blue-500 text-white hover:bg-blue-600' 
                  : ''
                }
              `}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Info */}
      {(selectedDate || selectedTime) && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h4 className="font-medium text-blue-900 mb-2">{t("selected")}</h4>
          <div className="text-sm text-blue-700 space-y-1">
            {selectedDate && (
              <p>{t("date")}: {new Date(selectedDate).toLocaleDateString('tr-TR', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
              })}</p>
            )}
            {selectedTime && <p>{t("time")}: {selectedTime}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
