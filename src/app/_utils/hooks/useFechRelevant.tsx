'use client';
import { useCallback, useEffect } from 'react';
import pRetry from 'p-retry';
import { useStore } from 'zustand';
import { useRelevantStore } from '@/app/store/stores/useRelevantStore';
import { getRelevantLists } from '@/app/API/classes-service/relevant/functions';

export const useFechRelevant = () => {
  const relevantLists = useStore(
    useRelevantStore,
    (state) => state.relevantLists
  );
  const setRelevantLists = useRelevantStore.getState().setRelevantLists;
  //   console.log('useFechRelevant relevantLists', relevantLists);
  const fetchTargets = useCallback(async () => {
    try {
      const response = await pRetry(getRelevantLists, {
        retries: 5,
      });
      console.log('useFechRelevant response', response);
      response && setRelevantLists(response);
    } catch (err) {
      console.error('fetchTargets error:', err);
    }
  }, [setRelevantLists]);

  useEffect(() => {
    // console.log(
    //   'useFechRelevant check',
    //   relevantLists,
    //   relevantLists !== null && relevantLists.length === 0
    // );
    if (relevantLists !== null && relevantLists.length === 0) {
      fetchTargets();
    }
  }, [fetchTargets, relevantLists]);

  return (
    relevantLists?.sort((a, b) =>
      a.relevant_name.localeCompare(b.relevant_name)
    ) || null
  );
};
