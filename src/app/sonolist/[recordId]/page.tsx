import Sonograms from './_sonolist';

const Sonolist = async ({ params }: { params: { recordId: string } }) => {
  return (
    <section className='flex flex-col'>
      {params.recordId}
      <Sonograms recordId={params.recordId} />
    </section>
  );
};
export default Sonolist;
