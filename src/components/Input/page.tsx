import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamation } from '@fortawesome/free-solid-svg-icons';

export enum InputTypes {
  TEXT = 'text',
  NUMBER = 'number',
  PASSWORD = 'password',
}

const Input: React.FC<InputProps> = (props: InputProps) => {
  return (
    <div className={`relative ${props.className} w-full`}>
      <input
        type={props.type}
        name={props.name}
        className={`text:sm h-10 w-full rounded-xl border-2 bg-duoGray-lighter px-1 py-2 font-bold text-duoGray-darkest focus:outline-none dark:border-duoGrayDark-light dark:bg-duoGrayDark-dark dark:text-duoGrayDark-lightest dark:focus:border-duoBlueDark-text lg:h-14 lg:p-3 lg:text-xl ${
          props.failed ? 'border-duoRed-light' : 'border-duoGray-default'
        }`}
        placeholder={props.placeholder}
        value={props.value}
        onChange={(e) =>
          props.onChange ? props.onChange(e.target.value) : null
        }
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
