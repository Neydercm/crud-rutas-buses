import { useState, useEffect } from 'react';
import { rutaBusService } from '../services/rutaBusService';
import './Charts.css';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';

const COLORS = ['#3498db', '#2ecc71', '#f1c40f', '#e74c3c', '#9b59b6', '#1abc9c'];

function Charts({ refreshKey }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState('pie'); // 'pie' o 'bar'

  useEffect(() => {
    fetchEstadisticas();
  }, [refreshKey]);

  const fetchEstadisticas = async () => {
    try {
      setLoading(true);
      const response = await rutaBusService.getEstadisticas();
      setData(response.data);
      setError(null);
    } catch (err) {
      setError('Error al cargar estadísticas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="charts-loading">⏳ Cargando gráficos...</div>;
  if (error) return <div className="charts-error">❌ {error}</div>;
  if (!data) return <div className="charts-no-data">Sin datos para mostrar</div>;

  const pieData = data.porRuta.map(item => ({
    name: item.ruta,
    value: item.totalDinero
  }));

  const barData = data.porRuta.map(item => ({
    ruta: item.ruta.substring(0, 15) + (item.ruta.length > 15 ? '...' : ''),
    totalDinero: item.totalDinero,
    cantidadViajes: item.cantidadViajes
  }));

  return (
    <div className="charts-container">
      <div className="charts-header">
        <h3>📊 Análisis Financiero</h3>
        <div className="view-toggle">
          <button 
            onClick={() => setView('pie')}
            className={`toggle-btn ${view === 'pie' ? 'active' : ''}`}
          >
            🥧 Pastel
          </button>
          <button 
            onClick={() => setView('bar')}
            className={`toggle-btn ${view === 'bar' ? 'active' : ''}`}
          >
            📊 Barras
          </button>
        </div>
      </div>

      <div className="stats-summary">
        <div className="stat-card">
          <h4>💰 Total General</h4>
          <p className="stat-value">${data.totalGeneral.toFixed(2)}</p>
        </div>
        <div className="stat-card">
          <h4>🚌 Rutas Activas</h4>
          <p className="stat-value">{data.totalRutas}</p>
        </div>
        <div className="stat-card">
          <h4>📅 Fecha</h4>
          <p className="stat-value">{new Date().toLocaleDateString('es-ES')}</p>
        </div>
      </div>

      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={350}>
          {view === 'pie' ? (
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, 'Total']} />
              <Legend verticalAlign="bottom" />
            </PieChart>
          ) : (
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="ruta" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, 'Total']} />
              <Legend />
              <Bar dataKey="totalDinero" fill="#3498db" name="Dinero Recaudado" />
              <Bar dataKey="cantidadViajes" fill="#2ecc71" name="Cantidad de Viajes" />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      <div className="details-table">
        <h4>📈 Detalles por Ruta</h4>
        <table>
          <thead>
            <tr>
              <th>Ruta</th>
              <th>Total $</th>
              <th>Viajes</th>
              <th>Promedio $</th>
              <th>% del Total</th>
            </tr>
          </thead>
          <tbody>
            {data.porRuta.map((item, index) => {
              const porcentaje = ((item.totalDinero / data.totalGeneral) * 100).toFixed(2);
              return (
                <tr key={item.ruta}>
                  <td>{item.ruta}</td>
                  <td>${item.totalDinero.toFixed(2)}</td>
                  <td>{item.cantidadViajes}</td>
                  <td>${item.promedioDinero}</td>
                  <td>{porcentaje}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Charts;