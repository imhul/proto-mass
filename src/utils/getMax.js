export const getMax = (a, b) => {
    let max = false;
    if (a < b) {
        max = b
    } else if (b < a) {
        max = a
    }
    return max;
};
