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
  related_patient_id: string;
  title: string;
  content: string;
  done: boolean;
  date: string;
  deadline: string;
  priority: low | medium | high;
};

export type TaskRelatedToUserT = {
  todo_id: string;
  todo_date: string;
  todo_title: string;
  todo_content: string;
  todo_deadline: string;
  todo_creator_id: string;
  archived: boolean;
  done: boolean;
  priority: low | medium | high;
  related_patient_id: string;
};

export type TaskForFormT = {
  todo_title: string;
  todo_content: string;
  todo_deadline:date|string;
  priority: string|undefined;
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
  Prescriber_information: PrescriberT;
  diags: {
    Number_ICD: number;
    ICD: string;
    Quality_ICD: string;
    Localization_ICD: string;
  }[];
  ops: {
    Quarter: number;
    Number_procedure: number;
    Identifier_operation: string;
    Localization_procedure: string;
  }[];
};

export type MedicationT = {
  Issue_date: string;
  ID_Prescriber: number;
  Group_prescriber: number;
  KV_area_Prescriber: number;
  Prescriber_information: PrescriberT;
  positions: {
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
    Substance_code_text: string;
    pzn_text: string;
  }[];
};

export type WorkInabilityT = {
  Main_ICD: string;
  Case_ID: number;
  Start_work_inability: string;
  End_work_inability: string;
  Total_days_benefits: number;
  ID_Prescriber: number;
  Core_ID_prescriber: number;
  Physician_Specialty_Group: string;
  Payment_area: string;
  Type_EEL: string;
  Start_EEL: string;
  End_EEL: string;
  Total_days_EEL: number;
  Net_amount_EEL: number;
  Main_ICD_Text: string;
  Prescriber_information: PrescriberT;
  diagnosis: {
    Date_diagnosis: string;
    Date_healing: string;
    Primary_diagnosis: string;
    Secondary_diagnosis: string;
    Type_diagnosis: string;
    Localization_diagnosis: string;
    Severity_diagnosis: string;
    Certainty_diagnosis: string;
    Work_accident: string;
    Physician_number: string;
    Start_AU: string;
    End_AU: string;
    Start_application_AU: string;
    End_application_AU: string;
    Main_ICD_Text: string;
    Secondary_ICD_Text: string;
  }[];
};

export type Position = {
  Occupation_group: number;
  Start_service: string;
  End_service: string;
  Net_amount: number;
  Count: number;
  Number_medical_aid: string;
  Group_medical_aid: string;
  Group_ID_medical_aid: string;
  Pharmaceutical_registration_number: number;
  Diagnosis: string;
  ICD_Text: string;
  PZN_Text: string;
  medaid_text: string;
};

export type MedaidT = {
  ID_prescriber: number;
  Date_prescription: string;
  Group_prescriber: number;
  Prescriber_information: PrescriberT;
  positions: Position[];
};

export type HospitalT = {
  ID_Insured: number;
  Case_number: string;
  Admission_date: string;

  Reason_admission: string;

  Admission_weight_infant: number;
  Reason_discharge: string;
  Date_discharge: string;
  Delivery_date: string;
  Number_ventilation_days: number;
  Cost_total: number;
  ID_Hospital: number;
  Department_Admission: string;
  Department_Discharge: string;
  ICD: string;
  DRG: string;
  Occupancy_days: number;
  ICD_Text: string;
  DRG_Text: string;
  Reason_admission_text: string;
  Reason_discharge_text;
  diagnosis: {
    ICD_Number: string;
    Localization_diagnosis: string;
    ID_type_diagnosis: string;
    Type_diagnosis: string;
    Kind_diagnosis: string;
    ICD_Text: string;
  }[];
  billing: {
    Type_fee: string;
    Start_billing: string;
    End_billing: string;
    Number_billings: number;
    Total_amount_billed: number;
    Fee_Text: string;
  }[];
  procedure: {
    ID_operation: string;
    Date_operation: string;
    Localization_Operation: string;
    Category_115_SGB: number;
    OPS_Text: string;
  }[];
};

export type RehabT = {
  Hospital_indicator: string;
  Start_rehab: string;
  payment: {
    End_rehab: string;
    Main_diagnosis: string;
    Discharge_reason: string;
    ID_care_level: string;
    Care_level: string;
    Payment_amount: number;
    ICD_Text: string;
  }[];
  diagnosis: {
    Type_diagnosis: string;
    Main_diagnosis: string;
    Localization_diagnosis: string;
    Localization_diagnosis_addition: string;
    Primary_diagnosis: string;
    Secondary_diagnosis: string;
  }[];
};

export type PrescriberT = {
  prescriber_group_id: number;
  physician_ident: number;
  description: string;
  address_id: number;
  data_source_sgn: string;
  physician_spec_description: string;
};

export type DocumentationT = {
  insured_id: number;
  user_id: number;
  doc_text: string;
};
