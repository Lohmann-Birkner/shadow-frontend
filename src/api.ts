import data from "../mock_insured_patients.json";
import axios from "axios";
import { apiUrlBase } from "./constants";
import {
    InsuredPersonT,
} from "../types";

export const getInsured = (id: string) => {
  const insured = data.find((insured) => insured.insuranceNumber === id);
  return insured;
};

export const getInsuredPersonSearchResults = async (
  catalog: string,
  value: string
) => {
  const response = await axios.get(
    `${apiUrlBase}/api/insured?q=${catalog};${value}`
  );

  return response.data as InsuredPersonT[];
};

export const getInsuredPerson= async ()=>{
    const response = await axios.get(
        `${apiUrlBase}/api/somepatients`
      );
     
      return response.data as InsuredPersonT[];
}
