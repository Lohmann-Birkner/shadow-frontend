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
