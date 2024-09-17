'use client';
import { useCallback, useEffect } from 'react';
import pRetry from 'p-retry';
import { useStore } from 'zustand';
import { useCountryStore } from '@/app/store/stores/(dropdowns)/useCountryStore';
import { getCountriesList } from '@/app/API/classes-service/(dropdowns)/countries/functions';

export const useFetchCountries = () => {
  const countiresList = useStore(useCountryStore, (state) => state.countries);
  const setCountries = useCountryStore.getState().setCountries;
  //   console.log('usefetchCountries countiresList', countiresList);
  const fetchCountries = useCallback(async () => {
    try {
      const response = await pRetry(getCountriesList, {
        retries: 5,
      });
      console.log('usefetchCountries response', response);
      response && setCountries(response);
    } catch (err) {
      console.error('fetchCountries error:', err);
    }
  }, [setCountries]);

  useEffect(() => {
    if (countiresList !== null && countiresList.length === 0) {
      fetchCountries();
    }
  }, [fetchCountries, countiresList]);

  return (
    countiresList?.sort((a, b) =>
      a.country_name.localeCompare(b.country_name)
    ) || null
  );
};
