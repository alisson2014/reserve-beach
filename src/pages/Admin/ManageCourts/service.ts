import { getStatusChipColorFunction } from "./types";

export const getStatusChipColor: getStatusChipColorFunction = active => active ? 'success' : 'error';