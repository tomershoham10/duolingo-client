"use client"
import { create } from 'zustand';
import { mountStoreDevtool } from 'simple-zustand-devtools';

export enum AlertSizes {
    small = "small",
    medium = "medium",
    large = "large",
}

interface AlertObjType {
    id: number;
    message: string;
    size: AlertSizes;
    actionLabel?: string;
    action?: () => Promise<void>;
}

type AlertState = {
    alerts: Array<AlertObjType>;
}
type Action = {
    addAlert: (message: string,
        size: AlertSizes,
        actionLabel?: string,
        action?: () => Promise<void>,
    ) => void;
    removeAlert: (id: number) => void;
}

let alertId = 0;

export const useAlertStore = create<AlertState & Action>((set) => ({
    alerts: [],
    addAlert: (message, size, actionLabel, action) => {
        alertId += 1;
        set((state) => ({
            alerts: [
                ...state.alerts,
                {
                    id: alertId,
                    message,
                    size,
                    actionLabel,
                    action,
                },
            ],
        }));
    },
    removeAlert: (id) => {
        set((state) => ({
            alerts: state.alerts.filter((alert) => alert.id !== id),
        }));
    },
}));

if (process.env.NODE_ENV === 'development') {
    mountStoreDevtool('AlertStore', useAlertStore);
}


