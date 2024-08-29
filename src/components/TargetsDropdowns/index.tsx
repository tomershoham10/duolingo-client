'use client';
import { useFetchCountries } from '@/app/_utils/hooks/(dropdowns)/useFechCountries';
import { useFetchOrganizations } from '@/app/_utils/hooks/(dropdowns)/useFechOrganizations';
import { useFetchTargets } from '@/app/_utils/hooks/(dropdowns)/useFechTargets';
import { useChildrenList } from '@/app/_utils/hooks/useChildrenList';
import Dropdown, { DropdownSizes } from '@/components/Dropdown';
import { useCallback, useMemo, useState } from 'react';

interface TargetsDropdownsProps {
  excludeFileType?: boolean;
  onModelSelected?: (model: TargetType) => void;
}

const TargetsDropdowns: React.FC<TargetsDropdownsProps> = (props) => {
  const { excludeFileType, onModelSelected } = props;
  const [selctedCountry, setSelctedCountry] = useState<CountryType | null>(
    null
  );
  const [selectedMainType, setSelectedMainType] = useState<TargetType | null>(
    null
  );
  const [selectedSubType, setSelectedSubType] = useState<TargetType | null>(
    null
  );
  const [selectedModel, setSelectedModel] = useState<TargetType | null>(null);

  const [selctedOrganization, setSelctedOrganization] =
    useState<OrganizationType | null>(null);

  const targetsList = useFetchTargets();
  const countiresList = useFetchCountries();
  const organizationsList = useFetchOrganizations();
  console.log('TargetsDropdowns', targetsList);

  const handleCountryChange = useCallback(
    (countryName: string) => {
      const countryObj = countiresList.find(
        (country) => country.country_name === countryName
      );

      setSelctedCountry(countryObj || null);
      setSelctedOrganization(null);
    },
    [countiresList]
  );

  const filteredOrganizationsList = useMemo(() => {
    if (!selctedCountry) {
      return organizationsList.map((org) => org.organization_name);
    }
    console.log(selctedCountry._id);
    const filteredOrganizations = organizationsList.filter(
      (organization) => organization.country === selctedCountry._id
    );
    console.log(filteredOrganizations);

    const filteredOrganizationsNames = filteredOrganizations.map(
      (organization) => organization.organization_name
    );
    console.log(filteredOrganizationsNames);
    return filteredOrganizationsNames;
  }, [selctedCountry, organizationsList]);

  const filteredSubTypesList = useMemo(() => {
    if (!selectedMainType) {
      return targetsList
        .filter((target) => target.level === 2)
        .map((target) => target.name);
    }

    const filteredSubTypes = targetsList.filter(
      (target) => target.level === 2 && target.father === selectedMainType._id
    );
    const filteredSubTypesNames = filteredSubTypes.map(
      (subType) => subType.name
    );

    return filteredSubTypesNames;
  }, [selectedMainType, targetsList]);

  const filteredModelsList = useMemo(() => {
    if (!selectedSubType) {
      return [];
    }

    const filteredModels = targetsList.filter(
      (target) =>
        target.level === 3 &&
        target.father === selectedSubType._id &&
        (selctedOrganization
          ? target.organization?.includes(selctedOrganization._id)
          : true)
    );
    const filteredModelsNames = filteredModels.map((model) => model.name);

    return filteredModelsNames;
  }, [selctedOrganization, selectedSubType, targetsList]);

  const handleOrganizationChange = useCallback(
    (organizationName: string) => {
      const organizationObj = organizationsList.find(
        (organization) => organization.organization_name === organizationName
      );

      setSelctedOrganization(organizationObj || null);
      setSelectedModel(null);
    },
    [organizationsList]
  );

  const handelMainTypeChange = useCallback(
    (targetName: string) => {
      const filtedMain = targetsList.find(
        (target) => target.name === targetName && target.level === 1
      );
      setSelectedMainType(filtedMain || null);
      setSelectedSubType(null);
      setSelectedModel(null);
    },
    [targetsList]
  );

  const handelSubTypeChange = useCallback(
    (targetName: string) => {
      const filtedSubType = targetsList.find(
        (target) => target.name === targetName && target.level === 2
      );
      setSelectedSubType(filtedSubType || null);
      setSelectedModel(null);
    },
    [targetsList]
  );

  const handelModelChange = useCallback(
    (targetName: string) => {
      const filtedModel = targetsList.find(
        (target) =>
          target.name === targetName &&
          target.level === 3 &&
          target.father === selectedSubType?._id &&
          (selctedOrganization
            ? target.organization?.includes(selctedOrganization._id)
            : true)
      );
      setSelectedModel(filtedModel || null);
      onModelSelected && filtedModel && onModelSelected(filtedModel);
    },
    [onModelSelected, selctedOrganization, selectedSubType?._id, targetsList]
  );

  return (
    <section className='flex flex-wrap gap-[8px]'>
      <section className='w-[15rem]'>
        <Dropdown
          isSearchable={true}
          placeholder={'Country'}
          value={selctedCountry?.country_name}
          items={countiresList.map((country) => country.country_name)}
          onChange={handleCountryChange}
          size={DropdownSizes.SMALL}
        />
      </section>
      <section className='w-[15rem]'>
        <Dropdown
          isSearchable={true}
          placeholder={'Organization'}
          items={filteredOrganizationsList}
          value={selctedOrganization?.organization_name}
          onChange={handleOrganizationChange}
          size={DropdownSizes.SMALL}
        />
      </section>
      <section className='w-[15rem]'>
        <Dropdown
          isSearchable={true}
          placeholder={'Main type'}
          value={selectedMainType?.name}
          items={targetsList
            .filter((target) => target.level === 1)
            .map((target) => target.name)}
          onChange={handelMainTypeChange}
          size={DropdownSizes.SMALL}
        />
      </section>
      <section className='w-[15rem]'>
        <Dropdown
          isSearchable={true}
          placeholder={'Sub type'}
          value={selectedSubType?.name}
          items={filteredSubTypesList}
          onChange={handelSubTypeChange}
          size={DropdownSizes.SMALL}
        />
      </section>
      <section className='w-[15rem]'>
        <Dropdown
          isSearchable={true}
          placeholder={'Model'}
          value={selectedModel?.name}
          items={filteredModelsList}
          onChange={handelModelChange}
          size={DropdownSizes.SMALL}
        />
      </section>
      {!excludeFileType && (
        <section className='w-[15rem]'>
          <Dropdown
            isSearchable={true}
            placeholder={'File type'}
            items={[]}
            onChange={() => {}}
            size={DropdownSizes.SMALL}
          />
        </section>
      )}
    </section>
  );
};

export default TargetsDropdowns;
