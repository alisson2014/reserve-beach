import { CourtCreate } from "../../../types/court";

export type isSelectedFunction = (id: number) => boolean;
export type handleCheckboxClickFunction = (_event: React.MouseEvent<unknown>, id: number) => void;
export type handleMoreOptionsFunction = (event: React.MouseEvent<HTMLElement>, id: number) => void;
export type getStatusChipColorFunction = (active: boolean) => 'success' | 'error';

export interface ICourtForm extends CourtCreate {
    weekdays: string[];
    hours: string[];
};