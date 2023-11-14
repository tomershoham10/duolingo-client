import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        screens: {
            'sm': '640px',
            'md': '768px',
            'lg': '1024px',
            'xl': '1280px',
            '2xl': '1920px',
        },
        extend: {
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
            },
            colors: {
                'duoGreen': {
                    button: '#59D101',
                    buttonBorder: '#61B800',
                    buttonHover: '#61E002',
                    buttonDisabled: '#58CC02',

                    lightest: '#CDF0B4',
                    light: '#79D635',
                    default: '#58CC02',

                    dark: '#4AAB02',
                    darker: '#459F00',

                    textHover: '#DEF5CC',
                },

                'duoBlue': {
                    button: '#27B6F5',
                    buttonBorder: '#1A87BC',
                    buttonHover: '#1FC2FF',

                    lightest: '#DDF4FF',
                    lighter: '#7DD3FC',
                    light: '#1CB0F6',
                    default: '#20A6EC',
                },

                'duoGray': {
                    //button === default
                    buttonBorder: '#44403c',
                    buttonHover: '#8A837D',

                    //in dropdown for example
                    hover: '#E0E0E0',

                    lighter: '#F7F7F7',
                    light: '#EBEAEB',
                    default: '#E5E5E5',
                    dark: '#AFAFAF',
                    darker: '#8B8B8B',
                    darkest: '#4B4B4B'
                },

                'duoRed': {
                    light: '#FFB2B2',
                    default: '#EA2B2B'
                }
            },
        },
    },
    plugins: [],
};

export default config;
