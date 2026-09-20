import { useState, useEffect } from 'react';
import { type Trabajador } from '../types';

export function useSistemaPesos() {
  // --- 1. Inicialización de los estados con la memoria del celular ---
  const [trabajadores, setTrabajadores] = useState<Trabajador[]>(() => {
    const guardados = localStorage.getItem('pesos_trabajadores');
    return guardados ? JSON.parse(guardados) : [];
  });

  const [numColumnas, setNumColumnas] = useState<number>(() => {
    const guardados = localStorage.getItem('pesos_num_columnas');
    return guardados ? parseInt(guardados, 10) : 1;
  });

  const [fecha, setFecha] = useState<string>(() => {
    const hoy = new Date().toISOString().split('T')[0];
    return localStorage.getItem('pesos_fecha') || hoy;
  });

  const [busqueda, setBusqueda] = useState<string>('');
  
  const [precioPorKilo, setPrecioPorKilo] = useState<string>(() => {
    return localStorage.getItem('pesos_precio') || '';
  });

  // --- 2. Auto-guardado en LocalStorage ---
  useEffect(() => {
    localStorage.setItem('pesos_trabajadores', JSON.stringify(trabajadores));
    localStorage.setItem('pesos_num_columnas', numColumnas.toString());
    localStorage.setItem('pesos_fecha', fecha);
    localStorage.setItem('pesos_precio', precioPorKilo);
  }, [trabajadores, numColumnas, fecha, precioPorKilo]);

  // --- 3. Funciones controladoras ---
  const agregarColumna = () => {
    setNumColumnas(numColumnas + 1);
    setTrabajadores(trabajadores.map(t => ({
      ...t,
      pesos: [...t.pesos, 0]
    })));
  };

  const actualizarPeso = (trabajadorId: number, indexColumna: number, valor: number) => {
    setTrabajadores(trabajadores.map(t => {
      if (t.id === trabajadorId) {
        const nuevosPesos = [...t.pesos];
        nuevosPesos[indexColumna] = isNaN(valor) ? 0 : valor;
        return { ...t, pesos: nuevosPesos };
      }
      return t;
    }));
  };

  const agregarTrabajador = (nombreIngresado: string) => {
    if (nombreIngresado.trim() === '') return;
    const nuevo: Trabajador = {
      id: Date.now(),
      nombre: nombreIngresado.trim().toLowerCase(),
      pesos: Array(numColumnas).fill(0)
    };
    setTrabajadores([...trabajadores, nuevo]);
  };

  const reiniciarCosecha = () => {
    setTrabajadores([]);
    setNumColumnas(1);
    setPrecioPorKilo('');
    const hoy = new Date().toISOString().split('T')[0];
    setFecha(hoy);
  };

  // --- 4. Operaciones de cálculo automático ---
  const trabajadoresFiltrados = trabajadores.filter(t =>
    t.nombre.includes(busqueda.toLowerCase())
  );

  const totalGeneralKilos = trabajadores.reduce((sum, t) => 
    sum + t.pesos.reduce((s, p) => s + p, 0), 0
  );

  const totalGeneralDinero = totalGeneralKilos * (parseFloat(precioPorKilo) || 0);

  return {
    trabajadores: trabajadoresFiltrados,
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
  };
}
