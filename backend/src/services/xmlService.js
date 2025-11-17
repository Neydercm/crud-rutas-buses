const { create } = require('xmlbuilder2');
const { Builder } = require('xml2js');

/**
 * Método 1: Transformar objetos JSON a XML usando xml2js
 * Ventaja: Automatizado, bueno para estructuras simples
 * Desventaja: Menos control sobre formato
 */
const generarXMLDesdeJSON = async (rutas) => {
  try {
    const builder = new Builder({
      rootName: 'ControlRutasBuses',
      xmldec: { version: '1.0', encoding: 'UTF-8' },
      renderOpts: { 
        pretty: true, 
        indent: '  ',
        newline: '\n'
      }
    });

    const datosXML = {
      metadata: {
        fechaGeneracion: new Date().toISOString(),
        totalRegistros: rutas.length,
        generadoPor: 'Sistema de Control de Buses v1.0'
      },
      rutas: {
        ruta: rutas.map(ruta => ({
          id: ruta._id.toString(),
          fechaSalida: ruta.fechaSalida.toISOString(),
          ruta: ruta.ruta,
          conductor: ruta.conductor,
          cantidadDinero: ruta.cantidadDinero.toFixed(2),
          observaciones: ruta.observaciones || 'N/A',
          estado: ruta.estado,
          timestamps: {
            createdAt: ruta.createdAt,
            updatedAt: ruta.updatedAt
          }
        }))
      }
    };

    return builder.buildObject(datosXML);
  } catch (error) {
    throw new Error(`Error en transformación JSON→XML: ${error.message}`);
  }
};

/**
 * Método 2: Generar XML directamente usando xmlbuilder2
 * Ventaja: Control total, atributos, namespaces, validación
 * Desventaja: Más verboso
 */
const generarXMLDirecto = (rutas) => {
  try {
    const root = create({ version: '1.0', encoding: 'UTF-8' })
      .ele('ControlRutasBuses', {
        xmlns: 'http://buscontrol.example.com/rutas',
        fechaGeneracion: new Date().toISOString(),
        totalRegistros: rutas.length
      });
    
    root.ele('metadata')
      .ele('sistema').txt('Control de Buses v1.0').up()
      .ele('empresa').txt('Transporte Urbano S.A.').up()
      .ele('periodo').txt('Diario').up();
    
    const rutasElem = root.ele('rutas');
    
    rutas.forEach((ruta, index) => {
      const rutaElem = rutasElem.ele('ruta', { 
        id: ruta._id.toString(),
        numero: (index + 1).toString()
      });
      
      rutaElem.ele('fechaSalida', { formato: 'ISO8601' }).txt(ruta.fechaSalida.toISOString()).up();
      rutaElem.ele('ruta').txt(ruta.ruta).up();
      rutaElem.ele('conductor').txt(ruta.conductor).up();
      rutaElem.ele('cantidadDinero', { moneda: 'USD' }).txt(ruta.cantidadDinero.toFixed(2)).up();
      rutaElem.ele('observaciones').txt(ruta.observaciones || 'N/A').up();
      rutaElem.ele('estado').txt(ruta.estado).up();
    });

    return root.end({ prettyPrint: true });
  } catch (error) {
    throw new Error(`Error en generación XML directa: ${error.message}`);
  }
};

module.exports = {
  generarXMLDesdeJSON,
  generarXMLDirecto
};