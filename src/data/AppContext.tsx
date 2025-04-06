import React, { createContext } from 'react';
import { DataGroup } from '../interfaces/DataGroup';
import { Tramo } from '../interfaces/Tramo';

interface DataGroupContextProps {
    data: DataGroup[];
    setData: React.Dispatch<React.SetStateAction<DataGroup[]>>;
    busSeleccionado: DataGroup | null;
    setBusSeleccionado: React.Dispatch<React.SetStateAction<DataGroup | null>>;
    tramos: Tramo[];
    setTramos: React.Dispatch<React.SetStateAction<Tramo[]>>;
}

export const MyAppContext = createContext<DataGroupContextProps>({} as DataGroupContextProps);

export const AppProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [data, setData] = React.useState<DataGroup[]>([]);
    const [busSeleccionado, setBusSeleccionado] = React.useState<DataGroup | null>(null);
    const [ tramos, setTramos ] = React.useState<Tramo[]>([]);

    return <MyAppContext.Provider value={{ data, setData, busSeleccionado, setBusSeleccionado, tramos, setTramos }}>
        { children }
    </MyAppContext.Provider>;
}