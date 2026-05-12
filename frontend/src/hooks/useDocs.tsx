import { useState, useCallback } from 'react';

export const SECTIONS = [
  { id: '01', title: 'Introducción a Redes', icon: 'Rocket' },
  { id: '02', title: 'Machine Learning', icon: 'Brain' },
  { id: '03', title: 'Tipos de Redes', icon: 'Network' },
  { id: '04', title: 'Anatomía de una Neurona', icon: 'Microscope' },
];

export const useDocs = () => {
  const [activeId, setActiveId] = useState('01');

  const changeSection = useCallback((id: string) => {
    setActiveId(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return { activeId, changeSection, sections: SECTIONS };
};