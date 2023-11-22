"use client"
import { create } from 'zustand';
import { mountStoreDevtool } from 'simple-zustand-devtools';

enum TypesOfTargets {
    VESSEL = "vessel",
    SONAR = "sonar",
    TORPEDO = "torpedo"
}

enum TypesOfVessels {
    FRIGATE = "frigate",
    SUBMARINE = "submarine",
    COASTPATROL = "coastPatrol",
    CARGO = "cargo",
    TUGBOAT = "tugboat",
}

enum TypesOfTorpedos {
    ELECTRIC = "electric"
}

enum TypesOfSonars {
    REGULAR = "regular"
}

export interface TargetType {
    _id: string;
    name: string;
    countryId: string;
    type: TypesOfTargets;
    subType: TypesOfVessels | TypesOfTorpedos | TypesOfSonars;
}

type TargetState = {
    targets: TargetType[];
}

type Action = {
    setTargets: (targets: TargetType[]) => void;
    addTarget: (target: TargetType) => void;
    removeTarget: (targetId: string) => void;
}



export const useTargetStore = create<TargetState & Action>(
    (set) => ({
        targets: [],
        setTargets: (targets: TargetType[]) => set(() => ({ targets: targets })),
        addTarget: (target: TargetType) => set((state) => ({ targets: [...state.targets, target] })),
        removeTarget: (targetId: string) => set((state) => ({ targets: state.targets.filter(t => t._id !== targetId) })),
    })
);


if (typeof window !== 'undefined' && localStorage) {
    const targetData = localStorage.getItem("targetsList");
    if (targetData) {
        const parsedData = JSON.parse(targetData) as TargetType[];
        console.log("useTargetStore parsedData", parsedData);
        useTargetStore.getState().setTargets(Object.values(parsedData));
        // console.log("useTargetStore useTargetStore.getState().targets", useTargetStore.getState().targets, typeof parsedData);
    }
}


if (process.env.NODE_ENV === 'development') {
    mountStoreDevtool('TargetStore', useTargetStore);
}