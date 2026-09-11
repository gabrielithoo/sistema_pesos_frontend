// Estructura de un trabajador individual
export interface Trabajador {
  id: number;       // Un identificador único (usaremos la fecha/hora en milisegundos)
  nombre: string;   // El nombre del trabajador (ej: 'gabriel', 'juan')
  pesos: number[];  // Un arreglo con los kilos de cada pesada dinámica (ej:)
}

// Estructura para guardar el historial del día completo en el celular
export interface RegistroCosecha {
  id: string;                    // Fecha en formato texto que servirá de ID (ej: "2026-09-11")
  fecha: string;                 // Fecha legible para mostrar en pantalla
  trabajadores: Trabajador[];    // La lista de todos los trabajadores con sus pesos de ese día
  precioPorKilo: number;         // El precio por kilo pactado para ese día
  totalKilos: number;            // La suma de absolutamente todos los kilogramos del día
  totalDinero: number;           // El cálculo final de cuánto dinero se debe pagar en total
}
