export const formatNumber = (value, digits = 2) => {
    try {
        return new Intl.NumberFormat("en-US", {
            minimumFractionDigits: 0,
            maximumFractionDigits: digits,
        }).format(value);
    } catch {
        return value.toFixed(2);
    }
};

export function roundedValue(n) {
    const sign = Math.sign(n);
    const abs = Math.abs(n);

    const remainder = abs % 100;
    const rounded =
        remainder >= 50
            ? Math.ceil(abs / 100) * 100
            : Math.floor(abs / 100) * 100 + 50;

    return sign * rounded;
}
