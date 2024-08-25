import { useEffect, useState } from 'react';

interface CountdownProps {
  onComplete: () => void;
}

const Countdown: React.FC<CountdownProps> = ({ onComplete }) => {
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (count > 0) {
      const timer = setTimeout(() => setCount(count - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      onComplete(); // Trigger the callback when the countdown ends
    }
  }, [count, onComplete]);

  return (
    <div className='text-center text-8xl font-extrabold'>
      {count > 0 && count}
    </div>
  );
};

export default Countdown;
