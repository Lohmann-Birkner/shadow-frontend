import axios from "axios";
import data from "../mock_insured_patients.json";
import { API_URL_BASE } from "./constants";
import { PatientT } from "../types";

export const getAllPatients = async () => {
    const response = await axios.get(`${API_URL_BASE}/somepatients`);

    return response.data as PatientT[];
};

export const getInsured = (id: string) => {
    const insured = data.find((insured) => insured.insuranceNumber === id);
    return insured;
};
