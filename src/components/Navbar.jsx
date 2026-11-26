import { CalendarDays, ListTodo } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useEvents } from '../context/EventContext';

export default function Navbar() {
  const { events } = useEvents();
  const pendingCount = events.filter((evt) => !evt.completed).length;

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

        <nav className="flex items-center gap-2" aria-label="Navegación principal">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`
            }
          >
            <ListTodo className="w-4 h-4" />
            <span>Eventos</span>
            <span className="ml-1 px-2 py-0.5 text-xs rounded-full bg-indigo-100 text-indigo-700 font-semibold">
              {pendingCount}
            </span>
          </NavLink>

          <NavLink
            to="/calendario"
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`
            }
          >
            <CalendarDays className="w-4 h-4" />
            <span>Calendario</span>
          </NavLink>
        </nav>
      </div>
    </header>
  );
}