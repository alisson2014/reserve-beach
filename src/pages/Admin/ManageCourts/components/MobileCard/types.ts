import { Court } from "../../../../../types/court";
import { isSelectedFunction, handleCheckboxClickFunction, handleClickFunction, getStatusChipColorFunction } from "../../types";

export interface MobileCardProps {
    isSelected: isSelectedFunction;
    handleCheckboxClick: handleCheckboxClickFunction;
    handleClick: handleClickFunction;
    getStatusChipColor: getStatusChipColorFunction;
    row: Court;
};