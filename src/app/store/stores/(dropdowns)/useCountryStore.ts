"use client"
import { create } from 'zustand';
import { mountStoreDevtool } from 'simple-zustand-devtools';

type CountryState = {
    countries: CountryType[] | null;
}

type Action = {
    setCountries: (countries: CountryType[]) => void;
    addCountry: (country: CountryType) => void;
    removeCountry: (countryId: string) => void;
}

export const useCountryStore = create<CountryState & Action>(
    (set) => ({
        countries: null,
        setCountries: (countries: CountryType[]) => set(() => ({ countries: countries })),
        addCountry: (country: CountryType) => set((state) => ({
            countries: state.countries ? [...state.countries, country] : [country]
        })),
        removeCountry: (countryId: string) => set((state) => ({
            countries: state.countries ?
                state.countries.filter(c => c._id !== countryId) :
                state.countries
        })),
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
    } else {
        useCountryStore.getState().setCountries([]);
    }
} else {
    useCountryStore.getState().setCountries([]);
}


if (process.env.NODE_ENV === 'development') {
    mountStoreDevtool('CountryStore', useCountryStore);
}