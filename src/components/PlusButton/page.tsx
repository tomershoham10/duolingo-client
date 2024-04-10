import { TiPlus } from 'react-icons/ti';

const PlusButton: React.FC<PlusButtonProps> = (props) => {
  const { label, onClick } = props;
  return (
    <div
      className={`my-3 flex cursor-pointer flex-row items-center justify-start ${
        !!label ? 'group' : ''
      }`}
    >
      <button
        className={`flex h-8 w-8 items-center justify-center rounded-full bg-duoGray-lighter text-2xl dark:bg-duoGrayDark-light lg:h-9 lg:w-9  ${
          !!label
            ? 'group-hover:w-fit group-hover:rounded-2xl group-hover:bg-duoGray-hover group-hover:px-2 group-hover:py-3 dark:group-hover:bg-duoGrayDark-lighter'
            : 'hover:bg-duoGray-hover dark:hover:bg-duoGrayDark-lighter'
        }`}
        onClick={onClick}
      >
        <TiPlus />
        {!!label ? (
          <>
            <span className='ml-1 hidden text-sm font-bold group-hover:block lg:text-base lg:font-extrabold'>
              {label}
            </span>
          </>
        ) : null}
      </button>
    </div>
  );
};

export default PlusButton;
