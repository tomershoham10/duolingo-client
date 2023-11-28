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
            '3xl': '2560px',
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
                    lighter: '#D7FFB8',
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
                    dark: '#84D8FF',
                    darkest: '#001F3F',
                    text: '#1899D6'
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
                    regular: '#DCDCDC',
                    dark: '#AFAFAF',
                    darker: '#8B8B8B',
                    darkest: '#4B4B4B'
                },

                'duoRed': {
                    buttonBorder: '#CC0000',
                    buttonHover: '#FF5252',
                    button: '#FF4040',
                    
                    lighter: '#FFDFE0',
                    light: '#FFB2B2',
                    default: '#EA2B2B'
                },

                'duoPurple': {
                    lighter: '#ECD7FB',
                    light: '#D296FF',
                    default: '#C87FFB',
                    darker: '#9C6AE5'
                },

                'duoOrange': {
                    buttonBorder: '#FF4500',
                    buttonHover: '#FF9640',
                    button: '#FF8C00',

                    lighter: '#FFA07A'
                }
            },
        },
    },
    plugins: [],
};

export default config;
