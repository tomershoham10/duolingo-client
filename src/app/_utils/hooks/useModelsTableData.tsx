import { useMemo } from 'react';
import { useFetchTargets } from './(dropdowns)/useFechTargets';
import { useFetchCountries } from './(dropdowns)/useFechCountries';
import { useFetchOrganizations } from './(dropdowns)/useFechOrganizations';

const useModelsTableData = () => {
  const targetsList = useFetchTargets();
  const modelsList = useMemo(() => {
    return targetsList?.filter((target) => target.level === 3) || [];
  }, [targetsList]);

  const countriesList = useFetchCountries();
  const organizationsList = useFetchOrganizations();

  const modelsTableData = useMemo(() => {
    if (targetsList === null) {
      return [];
    } else {
      const data: any[] = [];
      let organizationName: string | null = null;
      let countryName: string | null = null;

      modelsList.forEach((target) => {
        const targetOrg = target.organization;
        if (targetOrg && organizationsList) {
          const orgId = targetOrg[0];
          const organizationObj = organizationsList.find(
            (org) => org._id === orgId
          );
          organizationName = organizationObj?.organization_name || null;
          if (organizationObj && countriesList) {
            const countryObj = countriesList.find(
              (country) => country._id === organizationObj.country
            );
            countryName = countryObj?.country_name || null;
          }
        }

        const subTypeId = target.father;
        const subTypeObj = targetsList.find(
          (target) => target._id === subTypeId
        );

        let mainObj: TargetType | undefined = Object.create(null);
        if (subTypeObj) {
          mainObj = targetsList.find(
            (target) => target._id === subTypeObj.father
          );
        }

        data.push({
          country: countryName || 'N/A',
          organization: organizationName || 'N/A',
          mainTypeName: mainObj?.name || 'N/A',
          mainTypeId: mainObj?._id,
          subTypeName: subTypeObj?.name || 'N/A',
          subTypeId: subTypeObj?._id,
          modelName: target.name,
          modelId: target._id,
        });
      });

      return data;
    }
  }, [countriesList, modelsList, organizationsList, targetsList]);

  return modelsTableData;
};

export default useModelsTableData;
