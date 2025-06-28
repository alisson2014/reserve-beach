import { Court } from "../../../../../types/court";
import { isSelectedFunction, handleCheckboxClickFunction, getStatusChipColorFunction, handleMoreOptionsFunction } from "../../types";

export interface MobileCardProps {
    isSelected: isSelectedFunction;
    handleCheckboxClick: handleCheckboxClickFunction;
    handleMoreOptions: handleMoreOptionsFunction;
    getStatusChipColor: getStatusChipColorFunction;
    row: Court;
};