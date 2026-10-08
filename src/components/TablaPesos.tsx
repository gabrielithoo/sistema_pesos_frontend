import Swal from "sweetalert2";
import { useSistemaPesos } from "../hooks/useSistemaPesos";
import { exportarTablaComoImagen } from "../utils/exportarImagen";

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
    totalGeneralDinero,
  } = useSistemaPesos();

  const manejarDescarga = () => {
    exportarTablaComoImagen({
      idElemento: "tablaExcel",
      descripcion: "General",
      fecha,
    });
  };

  const confirmarNuevaCosecha = () => {
  Swal.fire({
    title: "¿Empezar nueva cosecha?",
    text: "Se borrarán todos los registros actuales de la pantalla.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, limpiar todo",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      reiniciarCosecha();
    }
  });
};

  const lanzarModalNuevoTrabajador = async () => {
  const { value: nombre } = await Swal.fire({
    title: "Nuevo trabajador",
    input: "text",
    inputLabel: "Nombre del trabajador",
    inputPlaceholder: "Ej: Juan Pérez",
    inputAttributes: {
      maxlength: "15",
      autocapitalize: "words",
      autocomplete: "off",
    },
    showCancelButton: true,
    confirmButtonText: "Agregar",
    cancelButtonText: "Cancelar",
    inputValidator: (value) => {
      if (!value || value.trim() === "") {
        return "Escribe un nombre válido.";
      }
    },
  });

  if (nombre) {
    agregarTrabajador(nombre.trim());
  }
};
  const manejarAgregarColumna = () => {
  if (numColumnas >= 15) {
    Swal.fire({
      title: "Límite alcanzado",
      text: "No puedes agregar más de 15 columnas de peso.",
      icon: "warning",
      confirmButtonText: "Entendido",
    });

    return;
  }

  agregarColumna();
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

        <div className="contenedor-botones-top">
          <button className="btn-top" onClick={lanzarModalNuevoTrabajador}>
            Agregar nombre
          </button>
          <button className="btn-top" onClick={manejarDescarga}>
            📷 Descargar
          </button>
        </div>
      </div>

{/* TABLA RESPONSIVA */}
<div className="tabla-responsiva">
  <table id="tablaExcel">
    <thead>
      <tr>
        <th className="col-nombre">nombres</th>

        <th colSpan={numColumnas}>
          datos (pesos kg)
        </th>

        {/* Primero el total */}
        <th className="col-total-trabajador">
          Total
        </th>

        {/* El botón queda al final */}
        <th className="col-boton-mas col-mas-cabecera no-descargar">
          <button
            className="btn-mas-celda"
            onClick={manejarAgregarColumna}
          >
            +
          </button>
        </th>
      </tr>
    </thead>

    <tbody>
      {trabajadores.map((t) => {
        const totalTrabajador = Math.round(
          t.pesos.reduce((s, p) => s + p, 0)
        );

        return (
          <tr key={t.id}>
            <td className="col-nombre">{t.nombre}</td>

            {Array.from({ length: numColumnas }).map((_, indexCol) => (
              <td key={indexCol}>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={4}
                  className="celda-peso"
                  value={
                    t.pesos[indexCol] === 0
                      ? ""
                      : t.pesos[indexCol]
                  }
                  onChange={(e) => {
                    const textoOriginal = e.target.value;

                    if (textoOriginal === "") {
                      actualizarPeso(t.id, indexCol, 0);
                      return;
                    }

                    const textoSanitizado =
                      textoOriginal.replace(/[^0-9]/g, "");

                    if (textoSanitizado === "") return;
                    if (textoSanitizado.length > 4) return;

                    actualizarPeso(
                      t.id,
                      indexCol,
                      parseInt(textoSanitizado, 10)
                    );
                  }}
                />
              </td>
            ))}

            {/* Total del trabajador */}
            <td className="col-total-trabajador">
              {totalTrabajador}
            </td>

            {/* Botón de acción al final */}
            <td className="col-boton-mas no-descargar">
              <button
                className="btn-mas-celda"
                onClick={manejarAgregarColumna}
              >
                +
              </button>
            </td>
          </tr>
        );
      })}
    </tbody>
  </table>
</div>



      {/* 💡 TOTAL GENERAL */}
      <div className="contenedor-total-descarga">
        <div className="gran-total total-reducido">
          TOTAL GENERAL: <span>{Math.round(totalGeneralKilos)}</span> KG
        </div>
      </div>

      {/* 💡 PANEL DE PRECIOS Y DINERO (S/) */}
      <div className="panel-totales">
        <div className="info-pago">
          <span>Precio por Kilo (S/):</span>
          <input
            type="text"
            value={precioPorKilo === "0.00" ? "" : precioPorKilo}
            onChange={(e) => {
              const valorFiltrado = e.target.value.replace(/[^0-9.]/g, "");
              if (valorFiltrado.length <= 5) {
                setPrecioPorKilo(valorFiltrado);
              }
            }}
            placeholder="Ej: 1.20"
            className="btn-pago-input"
          />
        </div>

        <div className="info-pago total-dinero-verde">
          <span>Total a Pagar (Dinero):</span>
          <span>
            S/ <span>{totalGeneralDinero.toFixed(2)}</span>
          </span>
        </div>
      </div>

      <div className="contenedor-nueva-cosecha">
        <button className="btn-guardar-jornada" onClick={confirmarNuevaCosecha}>
          [Nuevos Registros] Limpiar todo
        </button>
      </div>
    </div>
  );
}
