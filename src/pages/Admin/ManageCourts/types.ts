export type isSelectedFunction = (id: number) => boolean;
export type handleCheckboxClickFunction = (_event: React.MouseEvent<unknown>, id: number) => void;
export type handleClickFunction = (event: React.MouseEvent<HTMLButtonElement>) => void;
export type getStatusChipColorFunction = (active: boolean) => 'success' | 'error';