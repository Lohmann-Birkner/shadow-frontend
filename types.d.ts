export type PatientT = {
    ins_id: string;
    first_name: string;
    last_name: string;
    Membership_number: number;
    Person_indicator: number;
    Gender: string;
    Date_of_birth: string;
    ZIP_code: string;
    Insured_person_number: string;
    Entry_date: string;
    Discharge_date: string;
    Reason_for_leaving: string;
};

export type TaskT = {
    id: string;
    insuranceNumber: string;
    title: string;
    content: string;
    done: boolean;
    date: string;
    deadline: string;
    priority: low | medium | high;
};

export type searchInputs = {
    catalog: string;
    searchQuery: string;
};

export type MedicalServiceT = {
    Case_number: string;
    Insurance_area: number;
    Quarter: number;
    ID_Prescriber: number;
    Physician_specialty_group: number;
    UtilizationIs_accident: string;
    Treatment_type: string;
    Points: number;
    Total_costs: number;
    Calculated_costs: number;
    Non_budget_costs: number;
    Dialysis_costs: number;
    Start_Treatment: string;
    End_Treatment: string;
    Insurance_stats_5: string;
    Distance: number;
    Insurance_stats_2: string;
    diags: DiagsT[];
    ops: OpsT[];
};

export type DiagsT = {
    Number_ICD: number;
    ICD: string;
    Quality_ICD: string;
    Localization_ICD: string;
};

export type OpsT = {
    Quarter: number;
    Number_procedure: number;
    Identifier_operation: string;
    Localization_procedure: string;
};

export type MedicationT = {
    Issue_date: string;
    ID_Prescriber: number;
    Group_prescriber: number;
    KV_area_Prescriber: number;
    positions: PositionsT[];
};
export type PositionsT = {
    Date_Prescription: date;
    Pharmaceutical_registration_number: number;
    Total_cost_medication: number;
    Individual_cost_medication: number;
    Package_size: string;
    Substance_code: string;
    Daily_dosage: number;
    Total_cost_prescription: number;
    Surcharge: number;
    Care_provider_type: string;
    Medical_Aid_position_number: string;
};
