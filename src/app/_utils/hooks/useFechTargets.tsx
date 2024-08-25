import { useCallback, useEffect } from 'react';
import pRetry from 'p-retry';
import { useStore } from 'zustand';
import { useTargetStore } from '@/app/store/stores/useTargetStore';
import { getTargetsList } from '@/app/API/classes-service/targets/functions';

export const useFetchTargets = () => {
  const targetsList = useStore(useTargetStore, (state) => state.targets);

  const fetchTargets = useCallback(async () => {
    try {
      await pRetry(getTargetsList, {
        retries: 5,
      });
    } catch (err) {
      console.error('fetchTargets error:', err);
    }
  }, []);

  useEffect(() => {
    if (!targetsList) {
      fetchTargets();
    }
  }, [fetchTargets, targetsList]);

  return targetsList;
};
