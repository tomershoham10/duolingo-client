'use client';
import { useStore } from 'zustand';
import { useInfoBarStore } from '@/app/store/stores/useInfoBarStore';
import FilesTable from './_FilesTable';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Table, { TableHead, TableRow } from '@/components/Table/page';
import pRetry from 'p-retry';
import {
  BucketsNames,
  getFileByBucketName,
} from '@/app/API/files-service/functions';
import { useFetchTargets } from '@/app/_utils/hooks/(dropdowns)/useFechTargets';
import { useFetchCountries } from '@/app/_utils/hooks/(dropdowns)/useFechCountries';
import { useFetchOrganizations } from '@/app/_utils/hooks/(dropdowns)/useFechOrganizations';

const Files: React.FC = () => {
  console.log('records');
  const targetsList = useFetchTargets().filter((target) => target.level === 3);

  const countiresList = useFetchCountries();
  const organizationsList = useFetchOrganizations();

  const memoizedValue = useMemo(() => {
    const data: any[] = [];
    let organizationName: string | null = null;
    let countryName: string | null = null;
    targetsList.forEach((target) => {
      const targetOrg = target.organization;
      if (targetOrg) {
        const orgId = targetOrg[0];
        const organizationObj = organizationsList.find(
          (org) => org._id === orgId
        );
        organizationName = organizationObj?.organization_name || null;
        if (organizationObj) {
          const countryObj = countiresList.find(
            (country) => country._id === organizationObj.country
          );
          countryName = countryObj?.country_name || null;
        }
      }
      data.push({
        country: countryName || 'N/A',
        organization: organizationName || 'N/A',
        name: target.name,
      });
    });

    return data;
  }, [countiresList, organizationsList, targetsList]);
  console.log('memoizedValue',memoizedValue);

  const updateSelectedFile = useInfoBarStore.getState().updateSelectedFile;

  const TABLE_HEAD: TableHead[] = [
    { key: 'country', label: 'Country' },
    { key: 'organization', label: 'Organization' },
    { key: 'mainType', label: 'main type' },
    { key: 'subType', label: 'sub type' },
    { key: 'model', label: 'name' },
  ];

  const [recordsData, setRecordsData] = useState<FileType[]>([]);

  const [tableData, setTableData] = useState<TableRow[]>([]);

  //   const fetchData = useCallback(async () => {
  //     try {
  //       const level1IdsList = targetsList
  //         .filter((target) => target.level === 1)
  //         .map((target) => target._id);

  //       const fetchPromises = level1IdsList.map((level1Id) =>
  //         pRetry(() => getFileByBucketName(level1Id), { retries: 5 })
  //       );

  //       // Wait for all promises to resolve
  //       const results = await Promise.all(fetchPromises);
  //       console.log('files fetch data', results);
  //       // Flatten the results if needed and update state
  //       const allRecordsData = results.flat() as FileType[];
  //       setRecordsData(allRecordsData || []);
  //     } catch (error) {
  //       console.error('Failed to fetch records:', error);
  //     }
  //   }, [targetsList]);

  //   useEffect(() => {
  //     console.log('records fetchData');
  //     fetchData();
  //   }, [fetchData]);

  //   useEffect(() => {
  //     console.log('recordsData triggered', recordsData);
  //     setTableData(
  //       recordsData.map((data) => {
  //         return {
  //           ...data,
  //           fileType: data.name.endsWith('wav')
  //             ? BucketsNames.RECORDS
  //             : BucketsNames.IMAGES,
  //         };
  //       })
  //     );
  //   }, [recordsData]);

  const handleSelectTableRow = useCallback(
    (item: any) => {
      console.log('item', item);

      const modifiedRecord = {
        id: item.id,
        name: item.name,
        exerciseType: item.exerciseType,
        metadata: { ...item.metadata },
      };

      console.log('modifiedRecord', modifiedRecord);
      updateSelectedFile(modifiedRecord);
    },
    [updateSelectedFile]
  );

  const selectedRowIndex = useMemo(() => {
    return undefined;
  }, []);
  return (
    <section className='h-full p-6 text-duoGray-darkest dark:text-duoGrayDark-lightest'>
      {/* <FilesTable
        tableData={tableData}
        onSelect={handleSelectTableRow}
        selectedRowIndex={selectedRowIndex}
      /> */}
      <Table
        headers={TABLE_HEAD}
        rows={tableData}
        onSelect={() => {}}
        selectedRowIndex={selectedRowIndex}
      />
    </section>
  );
};
export default Files;
