import { useState } from "react";
import { useLocale } from "next-intl";
import { m } from "framer-motion";
import { EASE_STUDIO } from "@/lib/motion";

interface AdvancedCalendarProps {
  selectedDate: string;
  onDateSelect: (date: string) => void;
  selectedTime?: string;
  onTimeSelect?: (time: string) => void;
}

const MONTHS = {
  tr: ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"],
  en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
};

const WEEKDAYS = {
  tr: ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"],
  en: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
};

function startOfTomorrow(): Date {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(0, 0, 0, 0);
  return d;
}

export default function AdvancedCalendar({ selectedDate, onDateSelect }: Readonly<AdvancedCalendarProps>) {
  const locale = useLocale() === "tr" ? "tr" : "en";
  const [currentMonth, setCurrentMonth] = useState(() => {
    const t = startOfTomorrow();
    return new Date(t.getFullYear(), t.getMonth(), 1);
  });

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const leadingBlanks = (new Date(year, month, 1).getDay() + 6) % 7;
  const cells: (number | null)[] = [
    ...Array.from({ length: leadingBlanks }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const tomorrow = startOfTomorrow();
  const isDisabled = (day: number) => {
    const date = new Date(year, month, day);
    return date < tomorrow || date.getDay() === 0;
  };
  const isSelected = (day: number) =>
    !!selectedDate && new Date(year, month, day).toDateString() === new Date(selectedDate).toDateString();

  const now = new Date();
  const canGoBack = new Date(year, month - 1, 1) >= new Date(now.getFullYear(), now.getMonth(), 1);

  const select = (day: number) => {
    if (isDisabled(day)) return;
    onDateSelect(`${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`);
  };

  const navButton = "w-9 h-9 flex items-center justify-center border border-line text-ink transition-colors hover:bg-night hover:text-bone hover:border-ink disabled:opacity-30 disabled:pointer-events-none";

  return (
    <div className="select-none">
      <div className="flex items-end justify-between mb-5">
        <p className="text-2xl font-serif text-ink leading-none">
          {MONTHS[locale][month]} <span className="italic text-mute">{year}</span>
        </p>
        <div className="flex gap-1">
          <button type="button" onClick={() => setCurrentMonth(new Date(year, month - 1, 1))} disabled={!canGoBack} className={navButton} aria-label={locale === "tr" ? "Önceki ay" : "Previous month"}>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth={1.5} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button type="button" onClick={() => setCurrentMonth(new Date(year, month + 1, 1))} className={navButton} aria-label={locale === "tr" ? "Sonraki ay" : "Next month"}>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth={1.5} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 border-t border-l border-line">
        {WEEKDAYS[locale].map((d) => (
          <div key={d} className="border-r border-b border-line py-2 text-center font-mono text-[11px] uppercase tracking-[0.12em] text-mute">
            {d}
          </div>
        ))}
        {cells.map((day, index) => {
          if (day === null) {
            return <div key={`blank-${index}`} className="border-r border-b border-line aspect-square bg-paper-2/40" aria-hidden />;
          }
          const disabled = isDisabled(day);
          const selected = isSelected(day);
          return (
            <button
              key={`${year}-${month}-${day}`}
              type="button"
              onClick={() => select(day)}
              disabled={disabled}
              aria-pressed={selected}
              aria-label={new Date(year, month, day).toLocaleDateString(locale === "tr" ? "tr-TR" : "en-US", { weekday: "long", day: "numeric", month: "long" })}
              className={`relative aspect-square border-r border-b border-line text-sm transition-colors ${
                disabled ? "text-line cursor-not-allowed" : "text-ink hover:bg-night hover:text-bone"
              } ${selected ? "text-paper" : ""}`}
            >
              {selected && (
                <m.span layoutId="calendar-selected" className="absolute inset-0 bg-ink" transition={{ duration: 0.35, ease: EASE_STUDIO }} />
              )}
              <span className="relative z-10 font-mono text-[13px]">{day}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
