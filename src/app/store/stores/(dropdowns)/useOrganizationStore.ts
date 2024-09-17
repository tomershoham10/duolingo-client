"use client"
import { create } from 'zustand';
import { mountStoreDevtool } from 'simple-zustand-devtools';

type OrganizationState = {
    organizations: OrganizationType[] | null;
}

type Action = {
    setOrganizations: (organizations: OrganizationType[]) => void;
    addOrganization: (organization: OrganizationType) => void;
    removeOrganization: (organizationId: string) => void;
}

export const useOrganizationStore = create<OrganizationState & Action>(
    (set) => ({
        organizations: null,
        setOrganizations: (organizations: OrganizationType[]) => set(() => ({ organizations: organizations })),
        addOrganization: (organization: OrganizationType) => set((state) => ({
            organizations: state.organizations ? [...state.organizations, organization] : [organization]
        })),
        removeOrganization: (organizationId: string) => set((state) => ({
            organizations: state.organizations ?
                state.organizations.filter(c => c._id !== organizationId)
                : state.organizations
        })),
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
    } else {
        useOrganizationStore.getState().setOrganizations([]);
    }
} else {
    useOrganizationStore.getState().setOrganizations([]);
}


if (process.env.NODE_ENV === 'development') {
    mountStoreDevtool('OrganizationStore', useOrganizationStore);
}