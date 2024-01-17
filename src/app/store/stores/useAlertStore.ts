"use client"
import { create } from 'zustand';
import { mountStoreDevtool } from 'simple-zustand-devtools';

export enum AlertSizes {
    small = "small",
    medium = "medium",
    large = "large",
}

type AlertState = {
    alerts: Array<{
        id: number;
        message: string;
        size: AlertSizes;
    }>;
}
type Action = {
    addAlert: (message: string, size: AlertSizes) => void;
    removeAlert: (id: number) => void;
}

let alertId = 0;

export const useAlertStore = create<AlertState & Action>((set) => ({
    alerts: [],
    addAlert: (message, size) => {
        alertId += 1;
        set((state) => ({
            alerts: [
                ...state.alerts,
                {
                    id: alertId,
                    message,
                    size,
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


