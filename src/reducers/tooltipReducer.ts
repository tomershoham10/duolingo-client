export enum tooltipAction {
    SET_IS_IN_DELETING_MODE = 'setIsInDeletingMode',
    SET_IS_POP_EFFECT = 'setIsPopEffect',
    SET_BACKGROUND_COLOR = 'setBackgroundColor',
    SET_BORDER_COLOR = 'setBorderColor',
    SET_TEXT_COLOR = 'setTextColor',
    TOGGLE_DELETING_MODE = 'toggleDeletingMode',
}

type Action =
    | { type: tooltipAction.SET_IS_IN_DELETING_MODE; payload: boolean }
    | { type: tooltipAction.SET_IS_POP_EFFECT; payload: boolean }
    | { type: tooltipAction.SET_BACKGROUND_COLOR; payload: string }
    | { type: tooltipAction.SET_BORDER_COLOR; payload: string }
    | { type: tooltipAction.SET_TEXT_COLOR; payload: string }
    | { type: tooltipAction.TOGGLE_DELETING_MODE }

export interface TooltipType {
    isInDeletingMode: boolean,
    isPopEffect: boolean,
    backgroundColor: string,
    borderColor: string,
    textColor: string,
}

export const tooltipReducer = (
    state: TooltipType,
    action: Action
): TooltipType => {
    switch (action.type) {
        case tooltipAction.SET_IS_IN_DELETING_MODE:
            return { ...state, isInDeletingMode: action.payload };
        case tooltipAction.SET_IS_POP_EFFECT:
            return { ...state, isPopEffect: action.payload };
        case tooltipAction.SET_BACKGROUND_COLOR:
            return { ...state, backgroundColor: action.payload };
        case tooltipAction.SET_BORDER_COLOR:
            return { ...state, borderColor: action.payload };
        case tooltipAction.SET_TEXT_COLOR:
            return { ...state, textColor: action.payload };

        case tooltipAction.TOGGLE_DELETING_MODE:
            return { ...state, isInDeletingMode: !state.isInDeletingMode };
        default:
            return state;
    }
};

