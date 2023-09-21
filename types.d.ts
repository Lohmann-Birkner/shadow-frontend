export type InsuredT = {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  sex: string;
  zipcode: string;
  insuranceNumber: string;
};

export type TaskT = {
  id: string;
  insuranceNumber: string;
  title: string;
  content: string;
  done: boolean;
  date: string;
  deadline: string;
  priority: "low" | "medium" | "high";
};

export type InsuredPersonT = {
  ins_id:string;
  first_name:string;
  last_name:string;
  Membership_number:number;
  Person_indicator:number;
  Gender:string;
  Date_of_birth:string;
  ZIP_code:string;
  Insured_person_number:string;
  Entry_date:string;
  Discharge_date:string;
  Reason_for_leaving:string;
};
