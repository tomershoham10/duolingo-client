// 'use client';
// import { useEffect, useState } from 'react';
// import { useTargetStore } from '@/app/store/stores/(dropdowns)/useTargetStore';

// export const useChildrenList = (targetId: string) => {
//   const [children, setChildren] = useState<TargetType[]>([]);
//   const targets = useTargetStore((state) => state.targets);

//   useEffect(() => {
//     const getChildrenList = (
//       targets: TargetType[],
//       targetId: string
//     ): TargetType[] => {
//       const target = targets.find((t) => t._id === targetId);
//       if (target) {
//         return targets.filter((t) => target.children.includes(t._id));
//       }
//       return [];
//     };

//     const childrenList = getChildrenList(targets, targetId);
//     setChildren(childrenList);
//   }, [targets, targetId]);

//   return children;
// };
