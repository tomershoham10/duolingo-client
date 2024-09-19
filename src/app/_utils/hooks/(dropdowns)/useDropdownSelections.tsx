import { useCallback } from 'react';

export const useDropdownSelections = (
  updateSelectedMainTypeId: (selectedMainTypeId: string | null) => void,
  updateSelectedSubTypeId: (selectedSubTypeId: string | null) => void,
  updateSelectedModel: (selectedModel: TargetType | null) => void,
  updateSelectedFile: (selectedFile: Partial<FileType> | null) => void,
  selectedSubTypeId: string | null
) => {
  const handleMainTypeSelected = useCallback(
    (main: TargetType | null) => {
      updateSelectedMainTypeId(main?._id || null);
      updateSelectedFile(null);
    },
    [updateSelectedFile, updateSelectedMainTypeId]
  );

  const handleSubTypeSelected = useCallback(
    (subType: TargetType | null) => {
      updateSelectedSubTypeId(subType?._id || null);
      updateSelectedFile(null);
    },
    [updateSelectedFile, updateSelectedSubTypeId]
  );

  const handleModelSelected = useCallback(
    (model: TargetType | null) => {
      updateSelectedModel(model);
      updateSelectedFile(null);
      if (model && selectedSubTypeId === null) {
        updateSelectedSubTypeId(model.father || null);
      }
    },
    [
      selectedSubTypeId,
      updateSelectedFile,
      updateSelectedModel,
      updateSelectedSubTypeId,
    ]
  );

  return {
    handleMainTypeSelected,
    handleSubTypeSelected,
    handleModelSelected,
  };
};
