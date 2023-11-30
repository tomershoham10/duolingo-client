import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamation } from '@fortawesome/free-solid-svg-icons';

export enum Types {
  text = 'text',
  password = 'password',
}

interface InputProps {
  type: Types;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  failed?: boolean;
}

const Input: React.FC<InputProps> = ({
  type,
  placeholder,
  value,
  onChange,
  className,
  failed,
}) => {
  return (
    <div className={`relative ${className} w-full`}>
      <input
        type={type}
        className={`w-full rounded-xl border-2 bg-duoGray-lighter p-3 text-duoGray-darkest focus:outline-none ${
          failed ? 'border-duoRed-light' : 'border-duoGray-default'
        }`}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {failed && (
        <FontAwesomeIcon
          icon={faExclamation}
          className='absolute right-3 top-1/2 w-4 -translate-y-1/2 transform rounded-full border-2 border-duoRed-default p-[0.1rem] text-duoRed-default'
        />
      )}
    </div>
  );
};
export default Input;
