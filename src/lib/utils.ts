import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { FormatDate } from "./format-date";
import { useIntl } from "react-intl";
import { searchInputs } from "../../types";
import { API_URL_BASE } from "@/constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function showCostInTwoDigit(cost: number) {
  const costInTwoDigitWithEuro = new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(cost);

  return costInTwoDigitWithEuro;
}

//format "Sat Nov 25 2023 00:00:00 GMT+0100 (Mitteleuropäische Normalzeit)" to dd.mm.yyyy
export function formatedDate(time: string) {
  const formatedDate = new Intl.DateTimeFormat("de-DE").format(new Date(time));
  return formatedDate;
}

export function formatDaytime(time: any) {
  return new Intl.DateTimeFormat("en-CA").format(time);
}

export function formatDateForHospital(date: any) {
  const seperatedDateAndTime = date.split(" ");
  const DateResult = FormatDate(seperatedDateAndTime[0]);
  const result = DateResult + " " + seperatedDateAndTime[1];

  return result;
}

export function FormatGender(data: string|undefined) {
  const { locale } = useIntl();
  if (locale === "en") {
    switch (data) {
      case "Weiblich":
        return "Female";
        break;
      case "Männlich":
        return "Male";
        break;
    }
  } else {
    return data;
  }
}

//format "Sat Nov 25 2023 00:00:00 GMT+0100 (Mitteleuropäische Normalzeit)" to yyyy-mm-dd
export function FormatDeadline(date: any) {
  let formatDate = new Date(date);

  let result = [
    formatDate.getFullYear(),
    ("0" + (formatDate.getMonth() + 1)).slice(-2),
    ("0" + formatDate.getDate()).slice(-2),
  ].join("-");
  return result;
}

export const prioritySort = (rowA: any, rowB: any, columnId: any): number => {
  const value = (A: string): number => {
    return A === "low" ? 1 : A === "medium" ? 2 : 3;
  };
  const Anum = value(rowA.original.priority);
  const Bnum = value(rowB.original.priority);
  if (Anum === Bnum) return 0;

  return Anum < Bnum ? 1 : -1;
};

export const formSearchQuery = (searchInputs: searchInputs) => {
  let searchQuery = "";
  let firstParameter = true;
  if (searchInputs.ins_id) {
    searchQuery = "ins_id eq " + `${searchInputs.ins_id}`;
    firstParameter = false;
  }
  if (searchInputs.firstname) {
    if (!firstParameter) {
      searchQuery = searchQuery + ";";
    }
    searchQuery = searchQuery + `first_name eq ${searchInputs.firstname}`;
    firstParameter = false;
  }
  if (searchInputs.lastname) {
    if (!firstParameter) {
      searchQuery = searchQuery + ";";
    }
    searchQuery = searchQuery + `last_name eq ${searchInputs.lastname}`;
    firstParameter = false;
  }
  if (searchInputs.gender) {
    if (!firstParameter) {
      searchQuery = searchQuery + ";";
    }
    searchQuery = searchQuery + `Gender eq ${searchInputs.gender}`;
    firstParameter = false;
  }
  if (searchInputs.dateOfBirthStart) {
    if (!firstParameter) {
      searchQuery = searchQuery + ";";
    }
    searchQuery =
      searchQuery + `Date_of_birth gte ${searchInputs.dateOfBirthStart}`;
    firstParameter = false;
  }
  if (searchInputs.dateOfBirthEnd) {
    if (!firstParameter) {
      searchQuery = searchQuery + ";";
    }
    searchQuery =
      searchQuery + `Date_of_birth ste ${searchInputs.dateOfBirthEnd}`;
    firstParameter = false;
  }
  if (searchInputs.postNumber) {
    if (!firstParameter) {
      searchQuery = searchQuery + ";";
    }
    searchQuery = searchQuery + `ZIP_code eq ${searchInputs.postNumber}`;
    firstParameter = false;
  }
  if (searchInputs.entryDateStart) {
    if (!firstParameter) {
      searchQuery = searchQuery + ";";
    }
    searchQuery = searchQuery + `Entry_date gte ${searchInputs.entryDateStart}`;
    firstParameter = false;
  }
  if (searchInputs.entryDateEnd) {
    if (!firstParameter) {
      searchQuery = searchQuery + ";";
    }
    searchQuery = searchQuery + `Entry_date ste ${searchInputs.entryDateEnd}`;
  }
  console.log(searchQuery);
  return searchQuery;
};
