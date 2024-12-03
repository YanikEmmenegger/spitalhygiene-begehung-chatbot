import {format} from "date-fns";
import {de} from "date-fns/locale";


export const getDisplayNameofDate = (siteDate: string): string => {
    const todayDate = new Date().toISOString().slice(0, 10);

    //Add logic to display "Yesterday" if siteDate is yesterday
    const yesterday = new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().slice(0, 10);
    if (siteDate === yesterday) return "Gestern";
    //logic to display "Today" if siteDate is today
    if (siteDate === todayDate) return "Heute";
    //logic to display "Tomorrow" if siteDate is tomorrow
    const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().slice(0, 10);
    if (siteDate === tomorrow) return "Morgen";
    //Logic to display the date if none of the above
    const date = new Date(siteDate);

    return format(date, "EE, dd MMM", {locale: de});
}
