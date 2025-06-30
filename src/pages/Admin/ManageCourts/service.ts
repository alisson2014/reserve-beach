import * as yup from "yup";
import { ObjectSchema } from "yup";
import { getStatusChipColorFunction, ICourtForm } from "./types";

export const getStatusChipColor: getStatusChipColorFunction = active => active ? 'success' : 'error';

export const schema: ObjectSchema<ICourtForm> = yup.object({
    name: yup.string().required("O nome é obrigatório"),
    description: yup.string().optional(), 
    schedulingFee: yup.number().typeError("O preço deve ser um número").positive("O preço deve ser maior que zero").required("O preço do agendamento é obrigatório"),
    capacity: yup.number().typeError("A capacidade deve ser um número").positive("A capacidade deve ser positiva").required("A capacidade é obrigatória"),
    imageUrl: yup.string()
        .url("A URL da imagem não é válida")
        .transform(value => value === '' ? undefined : value) 
        .optional(),
    weekdays: yup
        .array()
        .of(yup.string().required())
        .min(1, "Selecione pelo menos um dia da semana")
        .required("O campo de dias da semana é obrigatório"),
    hours: yup
        .array()
        .of(yup.string().required())
        .min(1, "Selecione pelo menos um horário")
        .required("O campo de horários é obrigatório"),
});

export const defaultValues: ICourtForm = {
    name: '',
    description: '',
    schedulingFee: 0,
    capacity: 0,
    imageUrl: '',
    weekdays: [],
    hours: []
};

export const weekdayMap: { [key: string]: number } = {
    "Domingo": 0,
    "Segunda": 1,
    "Terça": 2,
    "Quarta": 3,
    "Quinta": 4,
    "Sexta": 5,
    "Sábado": 6
};
export const weekdays = Object.keys(weekdayMap);
export const hours = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00 - ${String(i).padStart(2, '0')}:59`);