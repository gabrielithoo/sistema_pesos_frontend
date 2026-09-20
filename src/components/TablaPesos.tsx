import Swal from 'sweetalert2';
import { useSistemaPesos } from '../hooks/useSistemaPesos';
import { exportarTablaComoImagen } from '../utils/exportarImagen';

export default function TablaPesos() {
  const {
    trabajadores,
    numColumnas,
    fecha,
    setFecha,
    busqueda,
    setBusqueda,
    precioPorKilo,
    setPrecioPorKilo,
    agregarColumna,
    actualizarPeso,
    agregarTrabajador,
    reiniciarCosecha,
    totalGeneralKilos,
    totalGeneralDinero
  } = useSistemaPesos();

  const manejarDescarga = () => {
    exportarTablaComoImagen({
      idElemento: 'tablaExcel',
      descripcion: 'General', // Mandamos un valor fijo por defecto al utilitario
      fecha
    });
  };

  const confirmarNuevaCosecha = () => {
    Swal.fire({
      title: '¿Empezar nueva cosecha?',
      text: "Se borrarán todos los registros actuales de la pantalla.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#dc3545',
      confirmButtonText: 'Sí, limpiar todo',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        reiniciarCosecha();
      }
    });
  };

  const lanzarModalNuevoTrabajador = async () => {
    const { value: nombre } = await Swal.fire({
      title: "Nuevo Trabajador",
      input: "text",
      inputLabel: "Ingrese el nombre del nuevo trabajador:",
      inputPlaceholder: "Ej: Juan Pérez",
      inputAttributes: {maxlength: "15"},
      showCancelButton: true,
      confirmButtonColor: "#28a745",
      cancelButtonColor: "#dc3545",
      confirmButtonText: "Agregar",
      cancelButtonText: "Cancelar",
      inputValidator: (value) => {
        if (!value || value.trim() === "") {
          return "¡Necesitas escribir un nombre válido!";
        }
      },
    });

    if (nombre) {
      agregarTrabajador(nombre);
    }
  };

  return (
    <div>
      {/* HEADER DE ACCIONES OPTIMIZADO */}
      <div className="header-acciones">
        <div className="fecha-contenedor">
          Fecha:
          <input 
            type="date" 
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
          />
        </div>

        <div>
          <input
            type="text"
            id="inputBuscar"
            placeholder="Buscar nombre..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-top" onClick={lanzarModalNuevoTrabajador}>agregar</button>
          <button className="btn-top" onClick={manejarDescarga}>📷 descargar</button>
        </div>
      </div>

      {/* 📊 TABLA RESPONSIVA TIPO EXCEL */}
      <div className="tabla-responsiva">
        <table id="tablaExcel">
          <thead>
            <tr>
              <th className="col-nombre">nombres</th>
              <th colSpan={numColumnas}>datos (pesos kg)</th>
              <th className="col-boton-mas" style={{ width: '50px' }}>
                <button className="btn-mas-celda" onClick={agregarColumna}>+</button>
              </th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {trabajadores.map((t) => {
              const totalTrabajador = Math.round(t.pesos.reduce((s, p) => s + p, 0));

              return (
                <tr key={t.id}>
                  <td className="col-nombre">{t.nombre}</td>
                  {Array.from({ length: numColumnas }).map((_, indexCol) => (
                    <td key={indexCol}>
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        className="celda-peso"
                        value={t.pesos[indexCol] === 0 ? '' : t.pesos[indexCol]}
                        onChange={(e) => {
                          const textoOriginal = e.target.value;
                          if (textoOriginal === '') {
                            actualizarPeso(t.id, indexCol, 0);
                            return;
                          }
                          const textoSanitizado = textoOriginal.replace(/[^0-9]/g, '');
                          if (textoSanitizado === '') return;
                          if (textoSanitizado.length > 4) return;

                          actualizarPeso(t.id, indexCol, parseInt(textoSanitizado, 10));
                        }}
                      />
                    </td>
                  ))}
                  
                  <td className="col-boton-mas">
                    <button className="btn-mas-celda" onClick={agregarColumna}>+</button>
                  </td>

                  <td className="col-total-trabajador">
                    {totalTrabajador}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 💡 TOTAL GENERAL */}
      <div className="contenedor-total-descarga" style={{ justifyContent: 'center' }}>
        <div className="gran-total total-reducido" style={{ maxWidth: '100%' }}>
          TOTAL GENERAL: <span>{Math.round(totalGeneralKilos)}</span> KG
        </div>
      </div>

      {/* 💡 PANEL DE PRECIOS Y DINERO (S/) */}
      <div className="panel-totales" style={{ marginBottom: '20px', padding: '15px' }}>
        <div className="info-pago">
          <span>Precio por Kilo (S/):</span>
          <input
            type="text"
            value={precioPorKilo}
            onChange={(e) => {
              const valorFiltrado = e.target.value.replace(/[^0-9.]/g, '');
              if (valorFiltrado.length <= 5) {
                setPrecioPorKilo(valorFiltrado);
              }
            }}
            placeholder="Ej: 1.20"
            style={{
              width: '100px',
              padding: '6px',
              fontSize: '16px',
              textAlign: 'right',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          />
        </div>

        <div className="info-pago" style={{ color: '#28a745', marginTop: '10px' }}>
          <span>Total a Pagar (Dinero):</span>
          <span>S/ <span>{totalGeneralDinero.toFixed(2)}</span></span>
        </div>
      </div>

      <div style={{ marginTop: '15px', marginBottom: '30px' }}>
        <button className="btn-guardar-jornada" onClick={confirmarNuevaCosecha}>
          [Nueva cosecha]
        </button>
      </div>
    </div>
  );
}
