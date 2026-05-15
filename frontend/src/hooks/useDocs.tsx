import { useState, useCallback } from 'react';

export const secciones = {
  teoria: [
    { id: '01', title: '¿Qué es una red neuronal?' },
    { id: '02', title: 'Tipos de aprendizaje' },
    { id: '03', title: 'Arquitectura de una red' },
    { id: '04', title: 'La neurona artificial' },
    { id: '05', title: '¿Cómo aprende una red?' },
    { id: '06', title: 'Algoritmos genéticos' },
  ],
  implementacion: [
    { id: '07', title: 'Arquitectura de la app' },
    { id: '08', title: 'La red del proyecto' },
    { id: '09', title: 'El algoritmo genético' },
    { id: '10', title: 'Dashboard y gráficas' },
    { id: '11', title: 'Guía de uso' },
  ]
};


export const useDocs = () => {
  const [idActivo, setIdActivo] = useState('01');

  const cambiarSeccion = useCallback((id: string) => {
    setIdActivo(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return { idActivo, cambiarSeccion, secciones: secciones };
};