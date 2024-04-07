import Sonograms from './_sonolist';

const Sonolist = async ({ params }: { params: { recordId: string } }) => {
  return (
    <section className='flex flex-col px-3'>
      <p className='py-4 text-2xl font-bold'>{params.recordId}</p>
      <Sonograms recordId={params.recordId} />
    </section>
  );
};
export default Sonolist;
