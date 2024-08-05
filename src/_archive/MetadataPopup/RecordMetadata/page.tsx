// 'use client';

// import { lazy } from 'react';
// import { useStore } from 'zustand';
// import { useInfoBarStore } from '@/app/store/stores/useInfoBarStore';
// import { ExercisesTypes } from '@/app/API/classes-service/exercises/functions';
// import { BucketsNames } from '@/app/API/files-service/functions';
// const FSARecMetaPopup = lazy(() => import('./FSA/page'));
// const SpotreccRecMetaPopup = lazy(() => import('./Spotrecc/page'));

// export interface RecordMetaEditProps {
//   file: any;
//   //   file: Partial<FileType>;
//   recordLength: number;
//   recordName: string;
//   onSave: (type: BucketsNames, data: Partial<Metadata>) => void;
// }

// const RecordMetadata: React.FC<RecordMetaEditProps> = (props) => {
//   const selectedFile = useStore(
//     useInfoBarStore,
//     (state) => state.selectedFile
//   ) as FileType | undefined;

//   return (
//     <div className='relative m-5 flex h-[35rem] w-[40rem] justify-center rounded-md bg-white p-5 dark:bg-duoGrayDark-darkest md:h-[35rem] xl:h-[35rem] xl:w-[55rem] 2xl:w-[57.5rem] 3xl:w-[70rem]'>
//       {selectedFile?.exerciseType === ExercisesTypes.FSA ? (
//         <FSARecMetaPopup {...props} />
//       ) : (
//         <SpotreccRecMetaPopup {...props} />
//       )}
//     </div>
//   );
// };

// export default RecordMetadata;
