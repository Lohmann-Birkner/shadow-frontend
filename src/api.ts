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
import { formSearchQuery } from "./lib/utils";
import { getSession, useSession } from "next-auth/react";

export const getAllPatients = async (authorization: any) => {
  // const session = await getSession();
  // const authorization = session?.user?.name;
  const response = await axios.get(
    `${API_URL_BASE}/somepatients`,

    {
      headers: {
        authorization: `Token ${authorization}`,
      },
    }
  );
  return response.data as PatientT[];
};

// export const getPatientByQuery = async (searchInputs: searchInputs) => {
//   const response = await axios.get(
//     `${API_URL_BASE}/insured?q=${searchInputs.catalog};${searchInputs.searchQuery}`
//   );

//   return response.data as PatientT[];
// };

// export const getPatientSearchResult = async (searchInputs: searchInputs) => {
//   const response = await axios.get(
//     `${API_URL_BASE}/insured?q=ins_id eq ${searchInputs.ins_id};
//     first_name eq ${searchInputs.firstname};
//     last_name eq ${searchInputs.lastname};
//     Gender eq ${searchInputs.gender};
//     Date_of_birth gte ${searchInputs.dateOfBirthStart};
//     Date_of_birth ste ${searchInputs.dateOfBirthEnd};
//     ZIP_code eq ${searchInputs.postNumber};
//     Entry_date gte ${searchInputs.entryDateStart};
//     Entry_date ste ${searchInputs.entryDateEnd}`
//   );

export const getPatientSearchResult = async (searchInputs: searchInputs) => {
  const session = await getSession();
  const authorization = session?.user?.name;
  const searchQuery = formSearchQuery(searchInputs);

  const res = await axios.get(`${API_URL_BASE}/insured?q=${searchQuery}`, {
    headers: { authorization: `Token ${authorization}` },
  });
  // console.log(`${API_URL_BASE}/insured?q=${searchQuery}`);
  return res.data.data as PatientT[];
};

export const getPatientById = async (id: string) => {
  const session = await getSession();
  const authorization = session?.user?.name;
  console.log(authorization);
  const response = await axios.get(`${API_URL_BASE}/insured/${id}`, {
    headers: { authorization: `Token ${authorization}` },
  });

  return response.data as PatientT;
};

export const getPatientMedicalService = async (id: string) => {
  const session = await getSession();
  const authorization = session?.user?.name;
  const response = await axios.get(`${API_URL_BASE}/medical_service/${id}`, {
    headers: { authorization: `Token ${authorization}` },
  });

  return response.data as MedicalServiceT[];
};

export const getPatientMedication = async (id: string) => {
  const session = await getSession();
  const authorization = session?.user?.name;
  const response = await axios.get(`${API_URL_BASE}/medication/${id}`, {
    headers: { authorization: `Token ${authorization}` },
  });

  return response.data as MedicationT[];
};

export const getPatientWorkInability = async (id: string) => {
  const session = await getSession();
  const authorization = session?.user?.name;
  const response = await axios.get(`${API_URL_BASE}/work_inability/${id}`, {
    headers: { authorization: `Token ${authorization}` },
  });

  return response.data as WorkInabilityT[];
};

export const getPatientMedaid = async (id: string) => {
  const session = await getSession();
  const authorization = session?.user?.name;
  const response = await axios.get(`${API_URL_BASE}/medaid/${id}`, {
    headers: { authorization: `Token ${authorization}` },
  });

  return response.data as MedaidT[];
};

export const getPatientHospital = async (id: string) => {
  const session = await getSession();
  const authorization = session?.user?.name;
  const response = await axios.get(`${API_URL_BASE}/hospital/${id}`, {
    headers: { authorization: `Token ${authorization}` },
  });

  return response.data as HospitalT[];
};

export const getPatientRehab = async (id: string) => {
  const session = await getSession();
  const authorization = session?.user?.name;
  const response = await axios.get(`${API_URL_BASE}/rehab/${id}`, {
    headers: { authorization: `Token ${authorization}` },
  });

  return response.data as RehabT[];
};

export const getDocumentById = async (ins_id: string) => {
  const session = await getSession();
  const authorization = session?.user?.name;
  const response = await axios.get(`${API_URL_BASE}/documentation/${ins_id}`, {
    headers: { authorization: `Token ${authorization}` },
  });
  return response.data as DocumentationT;
};

export const addDocument = async (
  ins_id: undefined | string | string[],
  data: { doc_text: string } | undefined
) => {
  console.log(data);
  const session = await getSession();
  const authorization = session?.user?.name;
  return await axios.post(`${API_URL_BASE}/documentation/${ins_id}`, data, {
    headers: {
      authorization: `Token ${authorization}`,
    },
  });
};

export const deleteDocument = async (doc_id: number | undefined) => {
  const session = await getSession();
  const authorization = session?.user?.name;
  const response = await axios.delete(
    `${API_URL_BASE}/documentation/${doc_id}`,
    {
      headers: {
        authorization: `Token ${authorization}`,
      },
    }
  );
  return response.status;
};

export const updateDocument = async (
  doc_id: number | undefined,
  formData: { doc_text: string }
) => {
  const session = await getSession();
  const authorization = session?.user?.name;
  return await axios.put(`${API_URL_BASE}/documentation/${doc_id}`, formData, {
    headers: {
      authorization: `Token ${authorization}`,
    },
  });
};
//get the todos/tasks not only for the general tasks also for the the tasks only related to one patient
export const getTaskRelatedToUserById = async (related_patient_id?: string) => {
  const session = await getSession();
  const authorization = session?.user?.name;
  if (related_patient_id) {
    const response = await axios.get(
      `${API_URL_BASE}/todos/${related_patient_id}`,
      {
        headers: {
          authorization: `Token ${authorization}`,
        },
      }
    );
    return response.data as TaskRelatedToUserT[];
  } else {
    const response = await axios.get(`${API_URL_BASE}/todos/overview`, {
      headers: {
        authorization: `Token ${authorization}`,
      },
    });
    return response.data as TaskRelatedToUserT[];
  }
};

export const getTaskRelatedToPatient = async (related_patient_id: string) => {
  const session = await getSession();
  const authorization = session?.user?.name;
  const response = await axios.get(
    `${API_URL_BASE}/todos/${related_patient_id}`,
    {
      headers: {
        authorization: `Token ${authorization}`,
      },
    }
  );

  return response.data as TaskRelatedToUserT[];
};

export const updateTaskByTaskId = async (
  formData: TaskForFormT,
  todo_id: string
) => {
  const session = await getSession();
  const authorization = session?.user?.name;
  return await axios.put(`${API_URL_BASE}/todos/${todo_id}`, formData, {
    headers: {
      authorization: `Token ${authorization}`,
    },
  });
};

export const deleteTaskbyTaskId = async (taskId: string) => {
  const session = await getSession();
  const authorization = session?.user?.name;
  const response = await axios.delete(`${API_URL_BASE}/todos/${taskId}`, {
    headers: {
      authorization: `Token ${authorization}`,
    },
  });

  return response.status;
};

export const updateTaskStatusAndPriority = async (
  id: string,
  statusAndPriority: { done: boolean; priority: string }
) => {
  const session = await getSession();
  const authorization = session?.user?.name;
  return await axios.put(`${API_URL_BASE}/todos/${id}`, statusAndPriority, {
    headers: {
      authorization: `Token ${authorization}`,
    },
  });
};

export const addTask = async (data: {
  todo_title: string;

  todo_content: string;
  todo_deadline: string;
}) => {
  const session = await getSession();
  const authorization = session?.user?.name;

  return await axios.post(`${API_URL_BASE}/todos`, data, {
    headers: {
      authorization: `Token ${authorization}`,
    },
  });
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
