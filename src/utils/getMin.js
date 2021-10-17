export const getMin = (a, b) => {
    let min = false;
    if (a < b) {
        min = a;
    } else if (b < a) {
        min = b;
    }
    return min;
};
