import { useMemo, useState } from 'react';
import { CheckCircle2, Circle } from 'lucide-react';
import { useEvents } from '../context/EventContext';

const CATEGORY_STYLES = {
  trabajo: 'bg-blue-50 text-blue-700 border-blue-200',
  personal: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  reuniones: 'bg-purple-50 text-purple-700 border-purple-200',
};

const CATEGORY_LABELS = {
  trabajo: 'Cuidado Personal',
  personal: 'Tareas',
  reuniones: 'Trabajo',
};

export default function EventList({ onEditEvent, selectedDate = '', onClearDate }) {
  const { events, toggleCompleted, deleteEvent } = useEvents();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('todas');
  const [sortOrder, setSortOrder] = useState('date-asc');

  const filteredAndSortedEvents = useMemo(() => {
    return events
      .filter((evt) => {
        const matchesDate = !selectedDate || evt.date === selectedDate;
        const matchesCategory =
          selectedCategory === 'todas' || evt.category === selectedCategory;
        const query = searchTerm.trim().toLowerCase();
        const matchesSearch =
          !query ||
          evt.title.toLowerCase().includes(query) ||
          (evt.notes && evt.notes.toLowerCase().includes(query));
        return matchesDate && matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortOrder === 'title-asc') {
          return a.title.localeCompare(b.title);
        }
        const dateA = `${a.date}T${a.time || '00:00'}`;
        const dateB = `${b.date}T${b.time || '00:00'}`;
        return sortOrder === 'date-asc'
          ? dateA.localeCompare(dateB)
          : dateB.localeCompare(dateA);
      });
  }, [events, searchTerm, selectedCategory, sortOrder, selectedDate]);

  return (
    <section className="space-y-4" aria-label="Lista de eventos">
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por título o notas..."
              aria-label="Buscar eventos"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              aria-label="Ordenar eventos"
              className="w-full sm:w-auto rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="date-asc">Fecha: Urgente</option>
              <option value="date-desc">Fecha: No Urgente</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por categoría">
            {[
              { id: 'todas', label: 'Todas' },
              { id: 'trabajo', label: 'Cuidado Personal' },
              { id: 'personal', label: 'Tareas' },
              { id: 'reuniones', label: 'Trabajo' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {selectedDate && onClearDate && (
            <button
              type="button"
              onClick={onClearDate}
              className="text-xs font-medium text-indigo-700 hover:underline cursor-pointer"
            >
              Limpiar fecha ({selectedDate})
            </button>
          )}
        </div>
      </div>

      {/* Listado de tarjetas */}
      {filteredAndSortedEvents.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center">
          <p className="text-sm font-medium text-slate-700">
            No se encontraron eventos con los filtros colocados.
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Prueba cambiando la categoría o verifica los datos.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {filteredAndSortedEvents.map((evt) => (
            <li
              key={evt.id}
              className={`rounded-xl border p-4 transition-all ${
                evt.completed
                  ? 'border-slate-200 bg-slate-50/70 opacity-75'
                  : 'border-slate-200 bg-white hover:border-indigo-200'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <button
                    type="button"
                    onClick={() => toggleCompleted(evt.id)}
                    aria-label={
                      evt.completed
                        ? `Marcar "${evt.title}" como pendiente`
                        : `Marcar "${evt.title}" como completado`
                    }
                    className="mt-0.5 text-indigo-600 hover:text-indigo-800 shrink-0 cursor-pointer"
                  >
                    {evt.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3
                        className={`text-sm font-semibold ${
                          evt.completed ? 'line-through text-slate-500' : 'text-slate-900'
                        }`}
                      >
                        {evt.title}
                      </h3>
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${
                          CATEGORY_STYLES[evt.category] || 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        {CATEGORY_LABELS[evt.category] || evt.category}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-xs text-slate-500">
                      <span>{evt.date}</span>
                      {evt.time && <span>{evt.time}</span>}
                      {evt.reminder && (
                        <span className="text-amber-700 font-medium">
                          {evt.reminder}
                        </span>
                      )}
                    </div>

                    {evt.notes && (
                      <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                        {evt.notes}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => onEditEvent(evt)}
                    aria-label={`Editar ${evt.title}`}
                    className="px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteEvent(evt.id)}
                    aria-label={`Eliminar ${evt.title}`}
                    className="px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}