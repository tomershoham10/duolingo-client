interface EditLevelProps {
  levelId: string;
  onClose: () => void;
}

const EditLevel: React.FC<EditLevelProps> = (props) => {
  return (
    <section className='relative m-5 flex h-[30rem] w-[40rem] rounded-md bg-white p-5 dark:bg-duoGrayDark-darkest xl:h-[35rem] xl:w-[55rem] 2xl:h-[50rem] 2xl:w-[78.5rem] 3xl:h-[70rem] 3xl:w-[110rem]'>
    
      <span>level {props.levelId}</span>
      <button onClick={props.onClose}>close</button>
    </section>
  );
};

export default EditLevel;
