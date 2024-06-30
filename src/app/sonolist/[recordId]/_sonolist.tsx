'use client';
import React, { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import {
  getFileByName,
  getSonolistNamesByRecordId,
} from '@/app/API/files-service/functions';
import pRetry from 'p-retry';

interface SonolistProps {
  recordId: string;
}

const Sonograms: React.FC<SonolistProps> = ({ recordId }) => {
  const [sonolist, setSonolist] = useState<string[]>([]);

  const fetchSonograms = useCallback(async () => {
    try {
      //   const sonolistNames = await getSonolistNamesByRecordId(recordId);

      const sonolistNames = await pRetry(
        () => getSonolistNamesByRecordId(recordId),
        {
          retries: 5,
        }
      );
      const promises = sonolistNames.map(async (sonogram) => {
        try {
          //   const blob = await getFileByName(BucketsNames.SONOGRAMS, sonogram);

          const url = await pRetry(
            () => getFileByName(BucketsNames.IMAGES, sonogram),
            {
              retries: 5,
            }
          );
          if (url) {
            return url;
          } else {
            return null;
          }
        } catch (error) {
          console.error('Error reading file:', error);
          return null;
        }
      });

      const results = await Promise.all(promises);
      const filteredResults = results.filter(
        (result): result is string => typeof result === 'string'
      );
      setSonolist(filteredResults); // Set filtered results directly
    } catch (error) {
      console.error('Error fetching sonogram names:', error);
    }
  }, [recordId]);

  useEffect(() => {
    fetchSonograms(); // Trigger fetchSonograms when recordId changes
  }, [fetchSonograms]);

  useEffect(() => {
    console.log('sonolist', sonolist);
  }, [sonolist]);

  return (
    <section className='flex h-full w-full flex-col text-duoGray-darkest dark:text-duoGrayDark-lightest'>
      {sonolist.length > 0 && (
        <ul className='h-96'>
          {sonolist.map((sonolink, index) => (
            <li
              key={index}
              className='w-[20rem] border-2 border-duoGrayDark-light md:w-[24rem] lg:w-[32rem] xl:w-[40rem] 2xl:w-[60rem] 3xl:w-[80rem]'
            >
              <Image
                src={sonolink}
                alt={`Sonogram ${index}`}
                width={0}
                height={0}
                layout='responsive'
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default Sonograms;
