import { useIntl } from "react-intl";

export const FormatDate = (date: string) => {
    const { locale } = useIntl();
    if (locale === "en") {
        return date.split("-").reverse().join("-");
    } else {
        return date;
    }
};
