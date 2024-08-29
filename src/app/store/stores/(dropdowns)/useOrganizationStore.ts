"use client"
import { create } from 'zustand';
import { mountStoreDevtool } from 'simple-zustand-devtools';

type OrganizationState = {
    organizations: OrganizationType[];
}

type Action = {
    setOrganizations: (organizations: OrganizationType[]) => void;
    addOrganization: (organization: OrganizationType) => void;
    removeOrganization: (organizationId: string) => void;
}

export const useOrganizationStore = create<OrganizationState & Action>(
    (set) => ({
        organizations: [],
        setOrganizations: (organizations: OrganizationType[]) => set(() => ({ organizations: organizations })),
        addOrganization: (organization: OrganizationType) => set((state) => ({ organizations: [...state.organizations, organization] })),
        removeOrganization: (organizationId: string) => set((state) => ({ organizations: state.organizations.filter(c => c._id !== organizationId) })),
    })
);

if (typeof window !== 'undefined' && localStorage) {
    const organizationData = localStorage.getItem("organizationsList");
    // console.log("organizationData - store", organizationData);
    if (organizationData) {
        const parsedData = JSON.parse(organizationData) as OrganizationType[];
        // console.log("useOrganizationStore parsedData", parsedData);
        useOrganizationStore.getState().setOrganizations(Object.values(parsedData));
        // console.log("useOrganizationStore useOrganizationStore.getState().organizations", useOrganizationStore.getState().organizations, typeof parsedData);
    }
}


if (process.env.NODE_ENV === 'development') {
    mountStoreDevtool('OrganizationStore', useOrganizationStore);
}