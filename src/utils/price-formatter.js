export default function getFormattedPrice(price) {
    if (price == null || isNaN(price)) return "LKR 0.00";
    return "LKR " + Number(price).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}
