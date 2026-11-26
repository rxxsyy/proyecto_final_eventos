import { useMemo, useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { useEvents } from '../context/EventContext';

const WEEKDAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
const MONTHS = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

function formatDateKey(year, monthIndex, day) {
  const m = String(monthIndex + 1).padStart(2, '0');
  const d = String(day).padStart(2, '0');
  return `${year}-${m}-${d}`;
}

export default function CalendarView({ onSelectDateForNewEvent }) {
  const { events } = useEvents();
  const [currentDate, setCurrentDate] = useState(() => new Date(2026, 10, 25));
  const [selectedDate, setSelectedDate] = useState('2026-11-27');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const eventsByDate = useMemo(() => {
    const map = {};
    for (const evt of events) {
      if (!evt.date) continue;
      if (!map[evt.date]) {
        map[evt.date] = [];
      }
      map[evt.date].push(evt);
    }
    return map;
  }, [events]);

  const calendarCells = useMemo(() => {
    const firstDayOfMonth = new Date(year, month, 1);
    const startOffset = (firstDayOfMonth.getDay() + 6) % 7; // Lunes = 0
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const cells = [];
    for (let i = 0; i < startOffset; i += 1) {
      cells.push({ type: 'empty', key: `empty-${i}` });
    }
    for (let day = 1; day <= daysInMonth; day += 1) {
      const dateKey = formatDateKey(year, month, day);
      cells.push({
        type: 'day',
        key: dateKey,
        day,
        dateKey,
        dayEvents: eventsByDate[dateKey] || [],
      });
    }
    return cells;
  }, [year, month, eventsByDate]);

  const selectedDayEvents = eventsByDate[selectedDate] || [];

  const handlePrevMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Cuadrícula mensual del calendario */}
      <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">
              {MONTHS[month]} {year}
            </h2>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handlePrevMonth}
              aria-label="Mes anterior"
              className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNextMonth}
              aria-label="Mes siguiente"
              className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-slate-500 mb-2">
          {WEEKDAYS.map((dayName) => (
            <div key={dayName} className="py-1">
              {dayName}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1.5">
          {calendarCells.map((cell) => {
            if (cell.type === 'empty') {
              return <div key={cell.key} className="h-20 rounded-xl bg-slate-50/50" />;
            }

            const isSelected = cell.dateKey === selectedDate;
            const hasEvents = cell.dayEvents.length > 0;

            return (
              <button
                key={cell.key}
                type="button"
                onClick={() => setSelectedDate(cell.dateKey)}
                className={`h-20 rounded-xl border p-1.5 flex flex-col items-start justify-between text-left transition-colors cursor-pointer ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/70 ring-1 ring-indigo-600'
                    : 'border-slate-200 bg-white hover:border-indigo-300'
                }`}
              >
                <span
                  className={`text-xs font-semibold px-1.5 py-0.5 rounded-md ${
                    isSelected ? 'bg-indigo-600 text-white' : 'text-slate-700'
                  }`}
                >
                  {cell.day}
                </span>

                {hasEvents && (
                  <span className="text-[11px] font-medium px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-800 truncate max-w-full">
                    {cell.dayEvents.length}{' '}
                    {cell.dayEvents.length === 1 ? 'evento' : 'eventos'}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

     
      <aside className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <p className="text-xs font-medium text-slate-500">Día seleccionado</p>
          <h3 className="text-base font-bold text-slate-900">{selectedDate}</h3>
        </div>

        {selectedDayEvents.length === 0 ? (
          <p className="text-xs text-slate-500 py-4">
            No hay eventos programados para esta fecha.
          </p>
        ) : (
          <ul className="space-y-2.5">
            {selectedDayEvents.map((evt) => (
              <li
                key={evt.id}
                className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-1"
              >
                <p className="text-sm font-semibold text-slate-900">{evt.title}</p>
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  {evt.time && (
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {evt.time}
                    </span>
                  )}
                  {evt.reminder && <span>• {evt.reminder}</span>}
                </div>
              </li>
            ))}
          </ul>
        )}

        {onSelectDateForNewEvent && (
          <button
            type="button"
            onClick={() => onSelectDateForNewEvent(selectedDate)}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium py-2.5 px-3 rounded-lg transition-colors cursor-pointer"
          >
            Crear evento en {selectedDate}
          </button>
        )}
      </aside>
    </div>
  );
}