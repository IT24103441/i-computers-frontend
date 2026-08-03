export default function formatTimestamp(timestamp, timeZone = "Asia/Colombo") {
    const date = new Date(timestamp);

    if (isNaN(date.getTime())) {
        throw new Error("N/A");
    }

    const getOrdinal = (day) => {
        if (day > 3 && day < 21) return `${day}th`;

        switch (day % 10) {
            case 1:
                return `${day}st`;
            case 2:
                return `${day}nd`;
            case 3:
                return `${day}rd`;
            default:
                return `${day}th`;
        }
    };

    const parts = new Intl.DateTimeFormat("en-US", {
        timeZone,
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    }).formatToParts(date);

    const getPart = (type) => parts.find((part) => part.type === type)?.value;

    const day = Number(getPart("day"));
    const weekday = getPart("weekday");
    const month = getPart("month");
    const year = getPart("year");
    const hour = getPart("hour");
    const minute = getPart("minute");
    const dayPeriod = getPart("dayPeriod");

    return `${getOrdinal(day)} ${weekday}, ${month} ${year} @${hour}:${minute} ${dayPeriod}.`;
}