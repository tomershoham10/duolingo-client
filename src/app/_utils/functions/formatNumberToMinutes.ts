export const formatNumberToMinutes = (timeInSeconds: number): string => {
    if (isNaN(timeInSeconds) || timeInSeconds < 0) {
        return '00:00';
    }

    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);

    const formatTwoDigits = (num: number): string => num.toString().padStart(2, '0');

    return `${formatTwoDigits(minutes)}:${formatTwoDigits(seconds)}`;
}