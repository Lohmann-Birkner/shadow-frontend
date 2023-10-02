import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

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

export function formatedDate(time:string){
 const formatedDate=new Intl.DateTimeFormat('de-DE').format(new Date(time))
 return formatedDate
}

export function formatDaytime(time:any){
 return new Intl.DateTimeFormat('en-CA').format(time)
}