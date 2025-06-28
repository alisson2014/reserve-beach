export type isSelectedFunction = (id: number) => boolean;
export type handleCheckboxClickFunction = (_event: React.MouseEvent<unknown>, id: number) => void;
export type handleMoreOptionsFunction = (event: React.MouseEvent<HTMLButtonElement>, id: number) => void;
export type getStatusChipColorFunction = (active: boolean) => 'success' | 'error';