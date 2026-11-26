import { useEffect, useState } from 'react';
import { PlusCircle, Save, X } from 'lucide-react';
import { useEvents } from '../context/EventContext';

const emptyForm = {
  title: '',
  date: '',
  time: '09:00',
  category: 'Cuidado Personal',
  reminder: '15 minutos antes',
  notes: '',
};

export default function EventForm({ editingEvent, onCancelEdit, defaultDate = '' }) {
  const { addEvent, updateEvent } = useEvents();
  const [formData, setFormData] = useState(emptyForm);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingEvent) {
      setFormData({
        title: editingEvent.title || '',
        date: editingEvent.date || '',
        time: editingEvent.time || '09:00',
        category: editingEvent.category || 'trabajo',
        reminder: editingEvent.reminder || '15 minutos antes',
        notes: editingEvent.notes || '',
      });
      setError('');
    } else {
      setFormData({
        ...emptyForm,
        date: defaultDate || '',
      });
    }
  }, [editingEvent, defaultDate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.date.trim()) {
      setError('El título y la fecha del evento son obligatorios.');
      return;
    }

    const payload = {
      ...formData,
      title: formData.title.trim(),
      notes: formData.notes.trim(),
    };

    if (editingEvent) {
      updateEvent({ ...editingEvent, ...payload });
      if (onCancelEdit) onCancelEdit();
    } else {
      addEvent(payload);
      setFormData({
        ...emptyForm,
        date: defaultDate || '',
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
      aria-label="Formulario de evento"
    >
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <h2 className="text-base font-semibold text-slate-900">
          {editingEvent ? 'Editar evento o recordatorio' : 'Nuevo evento o recordatorio'}
        </h2>
        {editingEvent && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-800"
          >
            <X className="w-4 h-4" />
            Cancelar
          </button>
        )}
      </div>

      {error && (
        <div
          role="alert"
          className="text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2"
        >
          {error}
        </div>
      )}

      <div>
        <label htmlFor="event-title" className="block text-xs font-medium text-slate-700 mb-1">
          Título del evento
        </label>
        <input
          id="event-title"
          name="title"
          type="text"
          value={formData.title}
          onChange={handleChange}
          placeholder="Ej. Rutina de skincare"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label htmlFor="event-date" className="block text-xs font-medium text-slate-700 mb-1">
            Fecha
          </label>
          <input
            id="event-date"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="event-time" className="block text-xs font-medium text-slate-700 mb-1">
            Hora
          </label>
          <input
            id="event-time"
            name="time"
            type="time"
            value={formData.time}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label htmlFor="event-category" className="block text-xs font-medium text-slate-700 mb-1">
            Categoría
          </label>
          <select
            id="event-category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="trabajo">Cuidado Personal</option>
            <option value="personal">Tareas</option>
            <option value="reuniones">Trabajo</option>
          </select>
        </div>

        <div>
          <label htmlFor="event-reminder" className="block text-xs font-medium text-slate-700 mb-1">
            Recordatorio
          </label>
          <select
            id="event-reminder"
            name="reminder"
            value={formData.reminder}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="En el momento">En el momento</option>
            <option value="15 minutos antes">15 minutos antes</option>
            <option value="30 minutos antes">30 minutos antes</option>
            <option value="1 hora antes">1 hora antes</option>
            <option value="1 día antes">1 día antes</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="event-notes" className="block text-xs font-medium text-slate-700 mb-1">
          Notas adicionales
        </label>
        <textarea
          id="event-notes"
          name="notes"
          rows="2"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Detalles, enlace o recordatorio extra..."
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <button
        type="submit"
        className="w-full inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2.5 px-4 rounded-lg transition-colors cursor-pointer"
      >
        {editingEvent ? (
          <>
            <Save className="w-4 h-4" />
            Guardar cambios
          </>
        ) : (
          <>
            <PlusCircle className="w-4 h-4" />
            Agregar evento
          </>
        )}
      </button>
    </form>
  );
}