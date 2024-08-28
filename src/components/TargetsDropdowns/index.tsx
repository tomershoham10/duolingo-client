'use client';
import { useChildrenList } from '@/app/_utils/hooks/useChildrenList';
import Dropdown, { DropdownSizes } from '@/components/Dropdown';
import { useCallback, useMemo, useState } from 'react';

const TargetsDropdowns: React.FC = () => {
  const [selctedCountry, setSelctedCountry] = useState<CountryType | null>(
    null
  );

  const [selctedOrganization, setSelctedOrganization] =
    useState<OrganizationType | null>(null);

  const countries = useMemo(() => {
    return [
      {
        _id: '111',
        country_name: 'Israel',
      },
      {
        _id: '122',
        country_name: 'U.S.A.',
      },
    ] as unknown as CountryType[];
  }, []);

  const organizations = useMemo(() => {
    return [
      {
        _id: 211,
        organization_name: 'Israeli Navy',
        country: '111',
      },
      {
        _id: 222,
        organization_name: 'U.S.N.',
        country: '122',
      },
    ] as unknown as OrganizationType[];
  }, []);

  const handleCountryChange = useCallback(
    (countryName: string) => {
      const countryObj = countries.find(
        (country) => country.country_name === countryName
      );

      setSelctedCountry(countryObj || null);
      setSelctedOrganization(null);
    },
    [countries]
  );

  const filteredOrganizationsList = useMemo(() => {
    if (!selctedCountry)
      return organizations.map((org) => org.organization_name); // Return an empty array if no country is selected
    console.log(selctedCountry._id);
    const filteredOrganizations = organizations.filter(
      (organization) => organization.country === selctedCountry._id
    );
    console.log(filteredOrganizations);

    const filteredOrganizationsNames = filteredOrganizations.map(
      (organization) => organization.organization_name
    );
    console.log(filteredOrganizationsNames);
    return filteredOrganizationsNames;
  }, [selctedCountry, organizations]);
  const handleOrganizationChange = useCallback(
    (organizationName: string) => {
      const organizationObj = organizations.find(
        (organization) => organization.organization_name === organizationName
      );

      setSelctedOrganization(organizationObj || null);
    },
    [organizations]
  );

  return (
    <section className='flex flex-wrap gap-[8px]'>
      <section className='w-[15rem]'>
        <Dropdown
          isSearchable={true}
          placeholder={'Country'}
          value={selctedCountry?.country_name}
          items={countries.map((country) => country.country_name)}
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
          items={[]}
          //   onChange={(target: TargetType) => handleTargetChange(target)}
          onChange={() => {}}
          size={DropdownSizes.SMALL}
        />
      </section>
      <section className='w-[15rem]'>
        <Dropdown
          isSearchable={true}
          placeholder={'Sub type'}
          items={[]}
          //   onChange={(target: TargetType) => handleTargetChange(target)}
          onChange={() => {}}
          size={DropdownSizes.SMALL}
        />
      </section>
      <section className='w-[15rem]'>
        <Dropdown
          isSearchable={true}
          placeholder={'Model'}
          items={[]}
          //   onChange={(target: TargetType) => handleTargetChange(target)}
          onChange={() => {}}
          size={DropdownSizes.SMALL}
        />
      </section>
      <section className='w-[15rem]'>
        <Dropdown
          isSearchable={true}
          placeholder={'File type'}
          items={[]}
          onChange={() => {}}
          size={DropdownSizes.SMALL}
        />
      </section>
    </section>
  );
};

export default TargetsDropdowns;
