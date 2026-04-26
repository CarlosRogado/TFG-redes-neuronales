import {useEffect, useState} from 'react';

export function usePersistentState<T>(key: string, valorInicial: T): [T, (value: T) => void] {
    const [state, setState] = useState<T>(()=> {
        const valorGuardado = localStorage.getItem(key);
        if(valorGuardado) {
            try{
                return JSON.parse(valorGuardado);
            } catch {
                return (valorGuardado as unknown) as T;
            }
        }
        return valorInicial;
    });

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(state));
    }, [key, state]);

    return [state, setState];
}