export const formatNumberToMinutes = (time: number) => {
    let hours: number = 0;
    let minutes: number = Math.floor(time);
    let seconds: number = Math.floor(60 * (time - minutes));

    if (minutes > 60) {
        hours = Math.floor(minutes / 60);
        minutes = minutes - hours * 60;
    }
    return (hours < 10 ? `0${hours}` : hours) + ':'
        + (minutes < 10 ? `0${minutes}` : minutes + ':' +
            (seconds < 10 ? `0${seconds}` : seconds));
}