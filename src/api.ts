import data from "../mock_insured_patients.json";

export const getInsured = (id: string) => {
    const insured = data.find((insured) => insured.insuranceNumber === id);
    return insured;
};
