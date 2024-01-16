import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamation } from '@fortawesome/free-solid-svg-icons';

const Input: React.FC<InputProps> = (props: InputProps) => {
  return (
    <div className={`relative ${props.className} w-full`}>
      <input
        type={props.type}
        className={`dark:bg-duoGrayDark-dark dark:border-duoGrayDark-light w-full text-xl font-bold rounded-xl border-2 bg-duoGray-lighter p-3 text-duoGray-darkest dark:text-duoGrayDark-lightest dark:focus:border-duoBlueDark-text focus:outline-none ${
          props.failed ? 'border-duoRed-light' : 'border-duoGray-default'
        }`}
        placeholder={props.placeholder}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
      />
      {props.failed && (
        <FontAwesomeIcon
          icon={faExclamation}
          className='absolute right-3 top-1/2 w-4 -translate-y-1/2 transform rounded-full border-2 border-duoRed-default p-[0.1rem] text-duoRed-default'
        />
      )}
    </div>
  );
};
export default Input;
