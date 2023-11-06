export const possitionByModularAddition = (index: number): string => {
    const position = index % 8;

    //0 8
    if (position === 0 || position === 4) {
        return "";
    }
    // 1 3
    if (position < 4 && position % 2 !== 0) {
        return "left-[-2.75rem]";
    }

    // 2
    if (position < 4 && position % 2 === 0) {
        return "left-[-4.375rem]";
    }
    // 5 7
    if (position > 4 && position % 2 !== 0) {
        return "left-[2.75rem]";
    }

    // 6
    if (position > 4 && position % 2 === 0) {
        return "left-[4.375rem]";
    }
    return "";
};

