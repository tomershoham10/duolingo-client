export const formatNumberToMinutes = (time: number) => {
    let hours: number = 0;
    let minutes: number = Math.floor(time); //340
    let seconds: number = Math.floor(60 * (time - minutes));

    if (minutes > 60) {
        hours = Math.floor(minutes / 60); //5
        minutes = minutes - hours * 60; //40
    }
    return (hours < 10 ? `0${hours}` : hours) + ':'
        + (minutes < 10 ? `0${minutes}` : minutes + ':' +
            (seconds < 10 ? `0${seconds}` : seconds));
}