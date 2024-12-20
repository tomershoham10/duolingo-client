// components/AnimatedSVG.js
import React from 'react';
import './animations.css'; // Adjust the path as necessary

const AnimatedSVG = () => {
  return (
    <div className='flex h-full w-full items-center justify-center'>
      <svg
        className='h-auto w-1/2 md:w-1/3 lg:w-1/4'
        viewBox='0 0 94 73'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <mask
          id='mask0_36_2'
          style={{ maskType: 'luminance' }}
          maskUnits='userSpaceOnUse'
          x='0'
          y='0'
          width='94'
          height='73'
        >
          <path d='M0.5 0.5H93.5V72.5H0.5V0.5Z' fill='white' stroke='white' />
        </mask>
        <g mask='url(#mask0_36_2)'>
          <mask
            id='mask1_36_2'
            style={{ maskType: 'luminance' }}
            maskUnits='userSpaceOnUse'
            x='-16'
            y='-18'
            width='122'
            height='106'
          >
            <path
              d='M-15.8675 -17.8675H105.868V87.8675H-15.8675V-17.8675Z'
              fill='white'
              stroke='white'
              strokeWidth='0.265'
            />
          </mask>
          <g mask='url(#mask1_36_2)'>
            <g id='large-wave' className='large-wave-animation'>
              <path
                d='M69.915 5.13754C81.0665 11.3407 88.619 23.2462 88.619 36.901C88.619 50.5642 81.0575 62.4757 69.8948 68.6757'
                stroke='#152228'
                strokeWidth='8.10381'
                strokeLinecap='round'
              />
            </g>
            <g id='small-wave' className='small-wave-animation'>
              <path
                d='M60.9951 21.4727C66.3741 24.5137 70.0087 30.2862 70.0087 36.901C70.0087 43.5277 66.3611 49.3092 60.9659 52.3456'
                stroke='#152228'
                strokeWidth='7.38831'
                strokeLinecap='round'
              />
            </g>
            <mask
              id='mask2_36_2'
              style={{ maskType: 'luminance' }}
              maskUnits='userSpaceOnUse'
              x='-8'
              y='-9'
              width='107'
              height='92'
            >
              <path
                d='M-7.86759 -8.86759H98.8676V82.8676H-7.86759V-8.86759Z'
                fill='white'
                stroke='white'
                strokeWidth='0.264818'
              />
            </mask>
            <g mask='url(#mask2_36_2)'>
              <path
                d='M40.6714 70.7044L18.4677 56.2314H23.1889C28.5673 56.2314 33.0358 52.1636 33.0358 47.0311V27.7239C33.0358 22.5914 28.5673 18.5236 23.1889 18.5236H17.8945L40.6743 3.67513C40.6747 3.67488 40.6751 3.67463 40.6754 3.67439C42.0408 2.78902 43.8928 3.11701 44.8001 4.32738L44.8001 4.3274L44.8048 4.33364C45.1427 4.77515 45.3174 5.30933 45.3174 5.8413V68.5401C45.3174 69.9608 44.0641 71.206 42.3853 71.206C41.778 71.206 41.1862 71.0348 40.6733 70.7056C40.6727 70.7052 40.672 70.7048 40.6714 70.7044ZM12.8012 52.2032C12.8012 53.0963 13.0961 53.943 13.615 54.6424H9.71743C5.10357 54.6424 1.45946 51.1772 1.45946 47.0311V27.7239C1.45946 23.5778 5.10357 20.1126 9.71743 20.1126H13.3742C13.0066 20.733 12.8012 21.4404 12.8012 22.1782V52.2032ZM16.0301 54.6424L15.6124 54.3702L15.6115 54.3696C14.8343 53.8645 14.3901 53.0518 14.3901 52.2032V22.1782C14.3901 21.402 14.7765 20.6367 15.47 20.1126H23.1889C27.8027 20.1126 31.4469 23.5778 31.4469 27.7239V47.0311C31.4469 51.1772 27.8027 54.6424 23.1889 54.6424H16.0301Z'
                fill='#152228'
                stroke='#152228'
                strokeWidth='1.58891'
              />
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
};

export default AnimatedSVG;
