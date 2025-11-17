import { useState, useEffect } from 'react';
import axios from 'axios';
import './RutaBusForm.css';

function RutaBusForm({ rutaEditar, onRutaCreated, onRutaUpdated, onCancel }) {
  const [formData, setFormData] = useState({
    fechaSalida: '',
    ruta: '',
    conductor: '',
    cantidadDinero: '',
    observaciones: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (rutaEditar) {
      setFormData({
        fechaSalida: formatDateTimeLocal(rutaEditar.fechaSalida),
        ruta: rutaEditar.ruta,
        conductor: rutaEditar.conductor,
        cantidadDinero: rutaEditar.cantidadDinero,
        observaciones: rutaEditar.observaciones || ''
      });
    } else {
      resetForm();
    }
  }, [rutaEditar]);

  const formatDateTimeLocal = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const resetForm = () => {
    const now = new Date();
    const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
      .toISOString().slice(0, 16);
    
    setFormData({
      fechaSalida: localDateTime,
      ruta: '',
      conductor: '',
      cantidadDinero: '',
      observaciones: ''
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'cantidadDinero' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      
      if (rutaEditar) {
        await axios.put(`${apiUrl}/rutas/${rutaEditar._id}`, formData);
        onRutaUpdated();
        alert('✅ Ruta actualizada exitosamente');
      } else {
        await axios.post(`${apiUrl}/rutas`, formData);
        onRutaCreated();
        alert('✅ Ruta creada exitosamente');
        resetForm();
      }
    } catch (error) {
      console.error('Error al guardar:', error);
      const message = error.response?.data?.message || 'Error al guardar la ruta';
      alert(`❌ ${message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="crud-form">
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="fechaSalida">Fecha y Hora de Salida *</label>
          <input
            type="datetime-local"
            id="fechaSalida"
            name="fechaSalida"
            value={formData.fechaSalida}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="ruta">Nombre de la Ruta *</label>
          <input
            type="text"
            id="ruta"
            name="ruta"
            value={formData.ruta}
            onChange={handleChange}
            placeholder="Ej: Ruta 101 - Centro"
            required
            maxLength="100"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="conductor">Nombre del Conductor *</label>
          <input
            type="text"
            id="conductor"
            name="conductor"
            value={formData.conductor}
            onChange={handleChange}
            placeholder="Ej: Juan Pérez García"
            required
            maxLength="100"
          />
        </div>

        <div className="form-group">
          <label htmlFor="cantidadDinero">Cantidad de Dinero ($) *</label>
          <input
            type="number"
            id="cantidadDinero"
            name="cantidadDinero"
            value={formData.cantidadDinero}
            onChange={handleChange}
            placeholder="Ej: 250.50"
            required
            min="0"
            step="0.01"
          />
        </div>
      </div>

      <div className="form-group full-width">
        <label htmlFor="observaciones">Observaciones</label>
        <textarea
          id="observaciones"
          name="observaciones"
          value={formData.observaciones}
          onChange={handleChange}
          placeholder="Incidentes, condiciones especiales, etc."
          rows="3"
          maxLength="500"
        ></textarea>
      </div>

      <div className="form-actions">
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="btn btn-primary"
        >
          {isSubmitting ? '⏳ Guardando...' : (rutaEditar ? '✏️ Actualizar' : '💾 Guardar')}
        </button>
        
        {rutaEditar && (
          <button 
            type="button" 
            onClick={onCancel}
            className="btn btn-secondary"
          >
            ❌ Cancelar
          </button>
        )}
      </div>
    </form>
  );
}

export default RutaBusForm;