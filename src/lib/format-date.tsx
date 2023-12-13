import { useIntl } from "react-intl";

export const FormatDate = (date: string|undefined) => {
    const { locale } = useIntl();
    if (locale === "de") {
        return date?.split("-").reverse().join(".");
    } else {
        return date;
    }
};

