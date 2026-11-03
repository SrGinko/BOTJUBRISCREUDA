export function chance(percent: number) {
    return Math.random() < percent / 100;
}