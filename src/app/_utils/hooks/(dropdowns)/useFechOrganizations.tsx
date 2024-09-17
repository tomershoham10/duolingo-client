'use client';
import { useCallback, useEffect } from 'react';
import pRetry from 'p-retry';
import { useStore } from 'zustand';
import { useOrganizationStore } from '@/app/store/stores/(dropdowns)/useOrganizationStore';
import { getOrganizationsList } from '@/app/API/classes-service/(dropdowns)/organizations/functions';

export const useFetchOrganizations = () => {
  const organizationsList = useStore(
    useOrganizationStore,
    (state) => state.organizations
  );
  const setOrganizations = useOrganizationStore.getState().setOrganizations;
  //   console.log('useFetchOrganizations organizationsList', organizationsList);
  const fetchOrganizations = useCallback(async () => {
    try {
      const response = await pRetry(getOrganizationsList, {
        retries: 5,
      });
      console.log('useFetchOrganizations response', response);
      response && setOrganizations(response);
    } catch (err) {
      console.error('fetchOrganizations error:', err);
    }
  }, [setOrganizations]);

  useEffect(() => {
    if (organizationsList !== null && organizationsList.length === 0) {
      fetchOrganizations();
    }
  }, [fetchOrganizations, organizationsList]);

  return (
    organizationsList?.sort((a, b) =>
      a.organization_name.localeCompare(b.organization_name)
    ) || null
  );
};
