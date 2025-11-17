import { useState } from 'react';
import Navbar from './components/Navbar';
import RutaBusForm from './components/RutaBusForm';
import RutaBusTable from './components/RutaBusTable';
import Charts from './components/Charts';
import XMLViewer from './components/XMLViewer';
import './App.css';

function App() {
  const [selectedRuta, setSelectedRuta] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRutaCreated = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleRutaUpdated = () => {
    setSelectedRuta(null);
    setRefreshKey(prev => prev + 1);
  };

  const handleEdit = (ruta) => {
    setSelectedRuta(ruta);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setSelectedRuta(null);
  };

  return (
    <div className="app-container">
      <Navbar />
      
      <main className="main-content">
        <section className="form-section">
          <h2>📝 Formulario de Control</h2>
          <RutaBusForm 
            rutaEditar={selectedRuta} 
            onRutaCreated={handleRutaCreated}
            onRutaUpdated={handleRutaUpdated}
            onCancel={handleCancel}
          />
        </section>

        <section className="charts-section">
          <h2>📊 Estadísticas en Tiempo Real</h2>
          <Charts refreshKey={refreshKey} />
        </section>

        <section className="table-section">
          <h2>📋 Registros de Rutas</h2>
          <RutaBusTable 
            refreshKey={refreshKey}
            onEdit={handleEdit}
          />
        </section>

        <section className="xml-section">
          <h2>🌳 Visualización XML</h2>
          <XMLViewer />
        </section>
      </main>
    </div>
  );
}

export default App;