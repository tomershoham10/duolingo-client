import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    darkMode: 'class',
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
                    text: '#7EC137',
                    midText: '#61B800',
                    darkText: '#58A700',
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

                'duoBlueDark': {
                    text: '#49C0F8',
                    textHover: '#42ADDF',
                    default: '#3B5799',
                    dark: '#384E8E',
                    darkOpacity: '#293B64',
                    darker: '#111C20',
                    darkest: '#1E273B',
                    darkestHover: '#111C20'
                },

                'duoGray': {
                    //button === default
                    buttonBorder: '#44403c',
                    buttonBorderHover: '#CECECE',

                    buttonHover: '#8A837D',

                    //in dropdown for example
                    hover: '#E0E0E0',

                    lightest: '#FFFFFF',
                    lighter: '#F7F7F7',
                    light: '#EBEAEB',
                    defaultHover: '#ECECEC',
                    default: '#E5E5E5',
                    regular: '#DCDCDC',
                    dark: '#AFAFAF',
                    midDark: '#939393',
                    darker: '#8B8B8B',
                    darkest: '#4B4B4B',
                    darkText: '#9D9D9D'
                },

                'duoGrayDark': {
                    lightest: '#DCE6EC',
                    lightestOpacity: '#8C969C',
                    lighter: '#52656D',
                    light: '#37464F',
                    dark: '#202F36',
                    darker: '#202F36',
                    darkest: '#131F24'

                },

                'duoRed': {
                    buttonBorder: '#CC0000',
                    buttonHover: '#FF5252',
                    button: '#FF4040',

                    lighter: '#FFDFE0',
                    light: '#FFB2B2',
                    default: '#EA2B2B',
                    darker: '#D42727'
                },

                'duoPurple': {
                    lighter: '#ECD7FB',
                    light: '#D296FF',
                    default: '#C87FFB',
                    darker: '#9C6AE5'
                },

                'duoYellow': {
                    buttonBorder: '#E7A601',
                    buttonHover: '#FFD147',
                    button: '#FFC800',

                    light: '#FFF5D3',
                    lighter: '#FFF9E6',
                    dark: '#E28908',
                    darker: '#E18500',
                    darkest: '#CD7900'
                }
            },
        },
    }

};

export default config;
