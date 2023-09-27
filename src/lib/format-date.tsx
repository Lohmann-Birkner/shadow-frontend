import { useIntl } from "react-intl";

export const FormatDate = (date: string) => {
    const { locale } = useIntl();

    if (locale === "en") {
        const toDateType = new Date(date);
        const formattedDate = new Intl.DateTimeFormat("de-DE", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        }).format(toDateType);
        return formattedDate.replace(/\./g, "-");
    } else {
        return date;
    }
};
