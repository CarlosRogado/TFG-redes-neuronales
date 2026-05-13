import { useState, useCallback } from 'react';

export const SECCIONES = [
  { id: '01', title: 'Introducción a Redes', icon: 'Rocket' },
  { id: '02', title: 'Aprendizaje automático', icon: 'Brain' },
  { id: '03', title: 'Tipos de Redes', icon: 'Network' },
  { id: '04', title: 'Anatomía de una Neurona', icon: 'Microscope' }
];

export const useDocs = () => {
  const [idActivo, setIdActivo] = useState('01');

  const cambiarSeccion = useCallback((id: string) => {
    setIdActivo(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return { idActivo, cambiarSeccion, secciones: SECCIONES };
};