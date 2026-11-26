import { createContext, useContext, useEffect, useReducer } from 'react';

const STORAGE_KEY = 'eventos_recordatorios_app_v1';

const initialEvents = [
  {
    id: 'evt-1',
    title: 'Presentación Final Proyecto React',
    date: '2026-11-27',
    time: '15:00',
    category: 'reuniones',
    reminder: '30 minutos antes',
    notes: 'Demostración de CRUD, filtros, calendario y pruebas unitarias.',
    completed: false,
  },
  {
    id: 'evt-2',
    title: 'Revisión de entregas y pendientes',
    date: '2026-11-26',
    time: '10:00',
    category: 'trabajo',
    reminder: '1 hora antes',
    notes: 'Organizar prioridades del día y validar avances.',
    completed: false,
  },
  {
    id: 'evt-3',
    title: 'Paseo y cuidado en casa',
    date: '2026-11-28',
    time: '17:30',
    category: 'personal',
    reminder: 'En el momento',
    notes: 'Tiempo libre personal para desconectar y recargar energías.',
    completed: false,
  },
];

function loadInitialState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return { events: parsed };
      }
    }
  } catch {
    
  }
  return { events: initialEvents };
}

function eventReducer(state, action) {
  switch (action.type) {
    case 'ADD_EVENT':
      return {
        ...state,
        events: [action.payload, ...state.events],
      };

    case 'UPDATE_EVENT':
      return {
        ...state,
        events: state.events.map((evt) =>
          evt.id === action.payload.id ? { ...evt, ...action.payload } : evt
        ),
      };

    case 'TOGGLE_COMPLETED':
      return {
        ...state,
        events: state.events.map((evt) =>
          evt.id === action.payload ? { ...evt, completed: !evt.completed } : evt
        ),
      };

    case 'DELETE_EVENT':
      return {
        ...state,
        events: state.events.filter((evt) => evt.id !== action.payload),
      };

    default:
      return state;
  }
}

const EventContext = createContext(null);

export function EventProvider({ children }) {
  const [state, dispatch] = useReducer(eventReducer, undefined, loadInitialState);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.events));
    } catch {
    }
  }, [state.events]);

  const addEvent = (eventData) => {
    const newEvent = {
      ...eventData,
      id: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      completed: false,
    };
    dispatch({ type: 'ADD_EVENT', payload: newEvent });
  };

  const updateEvent = (eventData) => {
    dispatch({ type: 'UPDATE_EVENT', payload: eventData });
  };

  const toggleCompleted = (id) => {
    dispatch({ type: 'TOGGLE_COMPLETED', payload: id });
  };

  const deleteEvent = (id) => {
    dispatch({ type: 'DELETE_EVENT', payload: id });
  };

  return (
    <EventContext.Provider
      value={{
        events: state.events,
        addEvent,
        updateEvent,
        toggleCompleted,
        deleteEvent,
      }}
    >
      {children}
    </EventContext.Provider>
  );
}

export function useEvents() {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvents debe usarse dentro de un EventProvider');
  }
  return context;
}