import { useState } from 'react';
import { rutaBusService } from '../services/rutaBusService';
import './XMLViewer.css';

function XMLViewer() {
  const [xmlContent, setXmlContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleViewXML = async (metodo = 1) => {
    setLoading(true);
    try {
      const blob = metodo === 1 
        ? await rutaBusService.exportXMLMetodo1()
        : await rutaBusService.exportXMLMetodo2();
      
      const text = await blob.text();
      
      // Formatear XML para visualización
      const formatted = formatXML(text);
      setXmlContent(formatted);
    } catch (err) {
      alert('❌ Error al cargar XML');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatXML = (xml) => {
    try {
      // Añadir indentación y saltos de línea
      return xml
        .replace(/></g, '>\n<')
        .replace(/\n</g, '\n    <')
        .replace(/<\/ruta>/g, '\n    </ruta>')
        .replace(/<\/ControlRutasBuses>/g, '\n</ControlRutasBuses>');
    } catch (e) {
      return xml;
    }
  };

  const handleDownload = () => {
    if (!xmlContent) return;
    
    const blob = new Blob([xmlContent], { type: 'application/xml' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rutas_${new Date().toISOString().split('T')[0]}.xml`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="xmlviewer-container">
      <div className="xmlviewer-header">
        <h3>🌳 Visualización XML</h3>
        <div className="xml-actions">
          <button onClick={() => handleViewXML(1)} className="btn-xml-view">
            👁️ Ver Método 1
          </button>
          <button onClick={() => handleViewXML(2)} className="btn-xml-view">
            👁️ Ver Método 2
          </button>
          {xmlContent && (
            <button onClick={handleDownload} className="btn-xml-download">
              💾 Descargar
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="xml-loading">⏳ Cargando XML...</div>
      ) : xmlContent ? (
        <pre className="xml-content">{xmlContent}</pre>
      ) : (
        <div className="xml-placeholder">
          <p>Presione "Ver Método 1" o "Ver Método 2" para cargar el XML</p>
        </div>
      )}
    </div>
  );
}

export default XMLViewer;