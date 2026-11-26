import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { EventProvider } from '../context/EventContext';
import App from '../App';

function renderApp() {
  localStorage.clear();
  return render(
    <EventProvider>
      <App />
    </EventProvider>
  );
}

describe('Aplicación de Gestión de Eventos', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('renderiza el encabezado y los eventos iniciales', () => {
    renderApp();
    expect(screen.getByRole('heading', { name: /^Eventos$/i })).toBeInTheDocument();
    expect(screen.getByText(/Presentación Final Proyecto React/i)).toBeInTheDocument();
  });

  test('permite agregar un nuevo evento y mostrarlo en la lista', () => {
    renderApp();

    fireEvent.change(screen.getByLabelText(/Título del evento/i), {
      target: { value: 'Reunión de comunicaciones' },
    });
    fireEvent.change(screen.getByLabelText(/Fecha/i), {
      target: { value: '2026-12-01' },
    });
    fireEvent.change(screen.getByLabelText(/Hora/i), {
      target: { value: '14:30' },
    });
    fireEvent.change(screen.getByLabelText(/^Categoría$/i, { selector: 'select' }), {
      target: { value: 'reuniones' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Agregar evento/i }));

    expect(screen.getByText('Reunión de comunicaciones')).toBeInTheDocument();
  });

  test('muestra un mensaje de error si se intenta enviar el formulario vacío', () => {
    renderApp();

    fireEvent.click(screen.getByRole('button', { name: /Agregar evento/i }));

    expect(screen.getByRole('alert')).toHaveTextContent(
      /El título y la fecha del evento son obligatorios/i
    );
  });

  test('filtra eventos mediante el buscador', () => {
    renderApp();

    const searchInput = screen.getByLabelText(/Buscar eventos/i);
    fireEvent.change(searchInput, { target: { value: 'Paseo' } });

    expect(screen.getByText(/Paseo y cuidado en casa/i)).toBeInTheDocument();
    expect(screen.queryByText(/Presentación Final Proyecto React/i)).not.toBeInTheDocument();
  });

  test('permite navegar a la vista de Calendario', () => {
    renderApp();

    fireEvent.click(screen.getByRole('link', { name: /Calendario/i }));

    expect(screen.getByText(/Noviembre 2026/i)).toBeInTheDocument();
  });
});