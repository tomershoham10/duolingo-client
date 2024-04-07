'use client';
import React, { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import {
  getFileByName,
  getSonolistNamesByRecordId,
} from '@/app/API/files-service/functions';

interface SonolistProps {
  recordId: string;
}

const Sonograms: React.FC<SonolistProps> = ({ recordId }) => {
  const [sonolist, setSonolist] = useState<string[]>([]);

  const fetchSonograms = useCallback(async () => {
    try {
      const sonolistNames = await getSonolistNamesByRecordId(recordId);
      const promises = sonolistNames.map(async (sonogram) => {
        try {
          const blob = await getFileByName('sonograms', sonogram);
          if (blob) {
            const reader = new FileReader();
            const promise = new Promise<string>((resolve, reject) => {
              reader.onload = () => {
                const result = reader.result;
                if (typeof result === 'string') {
                  resolve(result);
                } else {
                  reject(new Error('Failed to read blob data'));
                }
              };
              reader.onerror = reject;
            });

            reader.readAsDataURL(blob);
            return promise;
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
      <p>abc</p>
      {sonolist.length > 0 && (
        <ul className='h-96'>
          {sonolist.map((sonolink, index) => (
            <li key={index} className='h-[10rem] w-[40%]'>
              <Image
                src={sonolink}
                alt={`Sonogram ${index}`}
                width={800}
                height={600}
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
