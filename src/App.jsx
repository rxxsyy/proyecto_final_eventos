import { useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import EventForm from './components/EventForm';
import EventList from './components/EventList';
import CalendarView from './components/CalendarView';

function MainEventsView({ editingEvent, onStartEdit, onCancelEdit, selectedDate, onSelectDate }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-6">
      <EventForm
        editingEvent={editingEvent}
        onCancelEdit={onCancelEdit}
        defaultDate={selectedDate}
      />

      <div className="border-t border-slate-200 pt-6">
        <EventList
          onEditEvent={onStartEdit}
          selectedDate={selectedDate}
          onClearDate={() => onSelectDate('')}
        />
      </div>
    </div>
  );
}

export default function App() {
  const [editingEvent, setEditingEvent] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');

  const handleStartEdit = (eventItem) => {
    setEditingEvent(eventItem);
  };

  const handleCancelEdit = () => {
    setEditingEvent(null);
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-100 text-slate-900">
        <Navbar />

        <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
          <Routes>
            <Route
              path="/"
              element={
                <MainEventsView
                  editingEvent={editingEvent}
                  onStartEdit={handleStartEdit}
                  onCancelEdit={handleCancelEdit}
                  selectedDate={selectedDate}
                  onSelectDate={setSelectedDate}
                />
              }
            />
            <Route
              path="/eventos"
              element={<Navigate to="/" replace />}
            />
            <Route
              path="/calendario"
              element={
                <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm">
                  <CalendarView
                    selectedDate={selectedDate}
                    onSelectDate={setSelectedDate}
                    onEditEvent={handleStartEdit}
                  />
                </div>
              }
            />
            <Route
              path="*"
              element={<Navigate to="/" replace />}
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}