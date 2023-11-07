import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { FormatDate } from "./format-date";
import { useIntl } from "react-intl";


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

export function FormatGender(data: string) {
  const { locale } = useIntl();
    if (locale === "en") {
        switch(data){
          case "W":
            return "F";
            break;
          case "M":
            return "M";
            break;
        }
    } else {
        return data;
    }
  
}

export function FormatDeadline(date:Date){
  let formatDate = new Date(date);

  let result = [
    formatDate.getFullYear(),
    ('0' + (formatDate.getMonth() + 1)).slice(-2),
    ('0' + formatDate.getDate()).slice(-2)
  ].join('-');
  return result;
}
