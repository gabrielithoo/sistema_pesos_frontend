import html2canvas from 'html2canvas';
import Swal from 'sweetalert2';

interface OpcionesExportar {
  idElemento: string;
  descripcion: string;
  fecha: string;
}

/**
 * Servicio independiente encargado de tomar capturas de pantalla de elementos HTML
 * y descargarlos como imágenes en el dispositivo.
 */
export async function exportarTablaComoImagen({ idElemento, descripcion, fecha }: OpcionesExportar): Promise<void> {
  const elemento = document.getElementById(idElemento);
  
  if (!elemento) {
    Swal.fire({
      title: "Error",
      text: `No se encontró el elemento con ID: ${idElemento}`,
      icon: "error"
    });
    return;
  }

  try {
    const canvas = await html2canvas(elemento, {
      backgroundColor: '#ffffff', // Asegura el fondo blanco de Excel en la foto
      useCORS: true,
      scale: 2 // Alta definición para pantallas táctiles de celulares
    });

    const urlImagen = canvas.toDataURL('image/png');
    const enlace = document.createElement('a');
    
    // Nombra el archivo según el lote y fecha actual del negocio
    const nombreArchivo = `Tabla_Cosecha_${descripcion.trim() || 'General'}_${fecha}.png`;
    
    enlace.href = urlImagen;
    enlace.download = nombreArchivo;
    enlace.click();

    Swal.fire({
      title: "¡Foto Descargada!",
      text: "La tabla se guardó en tu galería correctamente.",
      icon: "success",
      confirmButtonColor: "#28a745"
    });
  } catch (error) {
    console.error("Error al exportar imagen:", error);
    Swal.fire({
      title: "Error",
      text: "No se pudo generar la imagen de la tabla.",
      icon: "error"
    });
  }
}
