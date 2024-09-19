// 'use client';
// import { useCallback } from 'react';
// import TargetsDropdowns from '@/components/TargetsDropdowns';

// interface UploadProps {
//   //   handleExerciseType: (value: string) => void;

//   handleMainChanged: (value: TargetType) => void;
//   handleSubTypeChanged: (value: TargetType) => void;
//   handleModelChanged: (value: TargetType) => void;
// }

// const SelectModel: React.FC<UploadProps> = (props) => {
//   const { handleMainChanged, handleSubTypeChanged, handleModelChanged } = props;

//   const handleMainSelected = useCallback(
//     (model: TargetType) => {
//       handleMainChanged(model);
//     },
//     [handleMainChanged]
//   );

//   const handleSubTypeSelected = useCallback(
//     (model: TargetType) => {
//       handleSubTypeChanged(model);
//     },
//     [handleSubTypeChanged]
//   );

//   const handleModelSelected = useCallback(
//     (model: TargetType) => {
//       handleModelChanged(model);
//     },
//     [handleModelChanged]
//   );
//   return (
//     <section className='mt-12 w-full px-4 py-4 3xl:gap-y-12'>
//       <p className='mb-1 font-bold text-duoGrayDark-lighter'>
//         Please select a model
//       </p>
//       <TargetsDropdowns
//         excludeFileType={true}
//         onMainSelected={handleMainSelected}
//         onSubTypeSelected={handleSubTypeSelected}
//         onModelSelected={handleModelSelected}
//       />
//     </section>
//   );
// };

// export default SelectModel;
