import axios from "axios";
import { API_URL_BASE } from "./constants";
import {
    PatientT,
    searchInputs,
    MedicalServiceT,
    MedicationT,
    WorkInabilityT,
    MedaidT,
    HospitalT,
    RehabT,
} from "../types";

export const getAllPatients = async () => {
    const response = await axios.get(`${API_URL_BASE}/somepatients`);

    return response.data as PatientT[];
};

export const getPatientByQuery = async (searchInputs: searchInputs) => {
    const response = await axios.get(
        `${API_URL_BASE}/insured?q=${searchInputs.catalog};${searchInputs.searchQuery}`
    );

    return response.data as PatientT[];
};

export const getPatientById = async (id: string) => {
    const response = await axios.get(`${API_URL_BASE}/insured/${id}`);

    return response.data as PatientT;
};

export const getPatientMedicalService = async (id: string) => {
    const response = await axios.get(`${API_URL_BASE}/medical_service/${id}`);

    return response.data as MedicalServiceT[];
};

export const getPatientMedication = async (id: string) => {
    const response = await axios.get(`${API_URL_BASE}/medication/${id}`);

    return response.data as MedicationT[];
};

export const getPatientWorkInability = async (id: string) => {
    const response = await axios.get(`${API_URL_BASE}/work_inability/${id}`);

    return response.data as WorkInabilityT[];
};

export const getPatientMedaid = async (id: string) => {
    const response = await axios.get(`${API_URL_BASE}/medaid/${id}`);

    return response.data as MedaidT[];
};

export const getPatientHospital = async (id: string) => {
    const response = await axios.get(`${API_URL_BASE}/hospital/${id}`);

    return response.data as HospitalT[];
};

export const getPatientRehab = async (id: string) => {
    const response = await axios.get(`${API_URL_BASE}/rehab/${id}`);

    return response.data as RehabT[];
};
