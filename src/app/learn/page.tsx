import UserUnitSection from '../../components/UnitSection/StudentUnit/page';

const Dashboard: React.FC = () => {
  return (
    <div
      className='flex w-full flex-col items-center justify-start'
      // bg-gradient-to-b from-duoBlue-lightest to-duoBlue-darkest overflow-auto
    >
      <UserUnitSection />
    </div>
  );
};

export default Dashboard;
