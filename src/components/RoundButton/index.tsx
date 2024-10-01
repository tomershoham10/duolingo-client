const RoundButton: React.FC<RoundButtonProps> = (props) => {
  const { label, Icon, className, onClick } = props;
  return (
    <div
      className={`group mx-auto my-3 flex w-fit cursor-pointer flex-row items-center justify-start ${className}`}
    >
      <button
      
        className={`flex h-8 min-w-8 items-center justify-center rounded-full bg-duoGray-lighter text-2xl text-duoGrayDark-lightest transition-all duration-300 ease-in-out dark:bg-duoGrayDark-light ${
          label
            ? 'group-hover:rounded-2xl group-hover:px-2 dark:group-hover:bg-duoGrayDark-lighter'
            : 'dark:hover:bg-duoGrayDark-lighter'
        }`}
        onClick={onClick}
      >
        <Icon className='flex-shrink-0' />
        {label && (
          <span className='max-w-0 overflow-hidden whitespace-nowrap text-sm font-bold transition-all duration-300 ease-in-out group-hover:ml-2 group-hover:max-w-[200px] lg:text-base lg:font-extrabold'>
            {label}
          </span>
        )}
      </button>
    </div>
  );
};

export default RoundButton;
