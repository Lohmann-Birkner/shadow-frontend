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
  PrescriberT,
  DocumentationT,
  TaskRelatedToUserT,
  TaskForFormT,
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

export const getDocumentById = async (patient_id: string) => {
  const response = await axios.get(
    `${API_URL_BASE}/documentation/${patient_id}`
  );
  return response.data as DocumentationT;
};

export const addDocument = async (
  patient_id: number | undefined,
  data: { doc_text: string }|undefined
) => {
  return await axios.post(`${API_URL_BASE}/documentation/${patient_id}`, data);
};

export const getTaskRelatedToUserById = async () => {
  const response = await axios.get(`${API_URL_BASE}/todos/overview`);

  return response.data as TaskRelatedToUserT[];
};

export const updateTaskByTaskId = async (
  formData: TaskForFormT,
  todo_id: string
) => {
  console.log(11111);
  console.log(formData);
  console.log(22222);

  return await axios.put(`${API_URL_BASE}/todos/${todo_id}`, formData);
};

export const deleteTaskbyTaskId = async (taskId: string) => {
  const response = await axios.delete(`${API_URL_BASE}/todos/${taskId}`);

  return response.status;
};

export const updateTaskStatusAndPriority = async (
  id: string,
  statusAndPriority: { done: boolean; priority: string }
) => {
  return await axios.put(`${API_URL_BASE}/todos/${id}`, statusAndPriority);
};

export const addTask = async (data: {
  todo_title: string;

  todo_content: string;
  todo_deadline: string;
}) => {
  console.log("add tasks");

  return await axios.post(`${API_URL_BASE}/todos`, data);
};

export const getUser = async (data: { username: string; password: string }) => {
  const response = await axios.post(
    `https://thinkhealthapi.org:2053/auth/login`,
    data
  );

  console.log("response", response);

  return response;
};

export const signup = async (data: {
  email: string;
  password: string;
  password2: string;
  first_name: string;
  last_name: string;
}) => {
  const response = await axios.post(
    `https://thinkhealthapi.org:2053/auth/signup`,
    data
  );

  return response;
};
