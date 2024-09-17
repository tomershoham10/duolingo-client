'use client';
import { useCallback, useEffect } from 'react';
import pRetry from 'p-retry';
import { useStore } from 'zustand';
import { useTargetStore } from '@/app/store/stores/(dropdowns)/useTargetStore';
import { getTargetsList } from '@/app/API/classes-service/(dropdowns)/targets/functions';

export const useFetchTargets = () => {
  const targetsList = useStore(useTargetStore, (state) => state.targets);
  const setTargets = useTargetStore.getState().setTargets;
  //   console.log('useFetchTargets targetsList', targetsList);
  const fetchTargets = useCallback(async () => {
    try {
      const response = await pRetry(getTargetsList, {
        retries: 5,
      });
      console.log('useFetchTargets response', response);
      response && setTargets(response);
    } catch (err) {
      console.error('fetchTargets error:', err);
    }
  }, [setTargets]);

  useEffect(() => {
    // console.log(
    //   'useFetchTargets check',
    //   targetsList,
    //   targetsList !== null && targetsList.length === 0
    // );
    if (targetsList !== null && targetsList.length === 0) {
      fetchTargets();
    }
  }, [fetchTargets, targetsList]);

  return targetsList?.sort((a, b) => a.name.localeCompare(b.name)) || null;
};
