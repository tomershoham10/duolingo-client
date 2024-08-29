"use client"
import { create } from 'zustand';
import { mountStoreDevtool } from 'simple-zustand-devtools';

type CountryState = {
    countries: CountryType[];
}

type Action = {
    setCountries: (countries: CountryType[]) => void;
    addCountry: (country: CountryType) => void;
    removeCountry: (countryId: string) => void;
}

export const useCountryStore = create<CountryState & Action>(
    (set) => ({
        countries: [],
        setCountries: (countries: CountryType[]) => set(() => ({ countries: countries })),
        addCountry: (country: CountryType) => set((state) => ({ countries: [...state.countries, country] })),
        removeCountry: (countryId: string) => set((state) => ({ countries: state.countries.filter(c => c._id !== countryId) })),
    })
);

if (typeof window !== 'undefined' && localStorage) {
    const countryData = localStorage.getItem("countriesList");
    // console.log("countryData - store", countryData);
    if (countryData) {
        const parsedData = JSON.parse(countryData) as CountryType[];
        // console.log("useCountryStore parsedData", parsedData);
        useCountryStore.getState().setCountries(Object.values(parsedData));
        // console.log("useCountryStore useCountryStore.getState().countries", useCountryStore.getState().countries, typeof parsedData);
    }
}


if (process.env.NODE_ENV === 'development') {
    mountStoreDevtool('CountryStore', useCountryStore);
}