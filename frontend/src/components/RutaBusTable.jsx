import { useState, useEffect } from 'react';
import { rutaBusService } from '../services/rutaBusService';
import './RutaBusTable.css';

function RutaBusTable({ refreshKey, onEdit }) {
  const [rutas, setRutas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRutas();
  }, [refreshKey]);

  const fetchRutas = async () => {
    try {
      setLoading(true);
      const response = await rutaBusService.getAll();
      setRutas(response.data || []);
      setError(null);
    } catch (err) {
      setError('Error al cargar rutas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Está seguro de eliminar esta ruta?')) return;

    try {
      await rutaBusService.delete(id);
      alert('✅ Ruta eliminada exitosamente');
      fetchRutas();
    } catch (err) {
      alert('❌ Error al eliminar ruta');
      console.error(err);
    }
  };

  const handleExportXML = async (metodo = 1) => {
    try {
      const blob = metodo === 1 
        ? await rutaBusService.exportXMLMetodo1()
        : await rutaBusService.exportXMLMetodo2();
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `rutas_buses_metodo${metodo}_${new Date().toISOString().split('T')[0]}.xml`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      alert(`✅ XML exportado (Método ${metodo})`);
    } catch (err) {
      alert('❌ Error al exportar XML');
      console.error(err);
    }
  };

  if (loading) return <div className="loading">⏳ Cargando rutas...</div>;
  if (error) return <div className="error">❌ {error}</div>;

  return (
    <div className="table-container">
      <div className="table-header">
        <h3>📋 Listado de Rutas</h3>
        <div className="export-buttons">
          <button onClick={() => handleExportXML(1)} className="btn-xml btn-xml-1">
            📥 XML (Método 1)
          </button>
          <button onClick={() => handleExportXML(2)} className="btn-xml btn-xml-2">
            📥 XML (Método 2)
          </button>
        </div>
      </div>

      {rutas.length === 0 ? (
        <div className="no-data">No hay rutas registradas</div>
      ) : (
        <div className="table-wrapper">
          <table className="rutas-table">
            <thead>
              <tr>
                <th>Fecha Salida</th>
                <th>Ruta</th>
                <th>Conductor</th>
                <th>Dinero ($)</th>
                <th>Observaciones</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {rutas.map((ruta) => (
                <tr key={ruta._id} className="fade-in">
                  <td>{new Date(ruta.fechaSalida).toLocaleString('es-ES')}</td>
                  <td><strong>{ruta.ruta}</strong></td>
                  <td>{ruta.conductor}</td>
                  <td className="text-right">${ruta.cantidadDinero.toFixed(2)}</td>
                  <td title={ruta.observaciones}>
                    {ruta.observaciones ? ruta.observaciones.substring(0, 30) + '...' : 'N/A'}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        onClick={() => onEdit(ruta)}
                        className="btn-action btn-edit"
                        title="Editar"
                      >
                        ✏️
                      </button>
                      <button 
                        onClick={() => handleDelete(ruta._id)}
                        className="btn-action btn-delete"
                        title="Eliminar"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default RutaBusTable;