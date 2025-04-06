import { Tramo } from "./Tramo";
import { DataRow } from "./DataRow";

export interface DataGroup {
    placa: string;
    datos: DataRow[];
    tramos?: Tramo[]
    totalPasajeros?: number | null;
}