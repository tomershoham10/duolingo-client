import Table from '@/components/Table/page';

const FilesSection: React.FC = () => {
  const headers = [
    { key: 'file', label: 'name' },
    { key: 'type', label: 'type' },
    { key: 'length', label: 'length (sec)' },
  ];

  const data = [
    { file: 'abc', type: 'record', length: 10 },
    { file: 'abc', type: 'record', length: 10 },
    { file: 'abc', type: 'record', length: 10 },
  ];

  return (
    <div className='w-fit mx-auto'>
      <Table headers={headers} rows={data} />
    </div>
  );
};

export default FilesSection;
